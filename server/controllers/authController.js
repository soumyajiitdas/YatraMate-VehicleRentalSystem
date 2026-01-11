const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendOTPEmail } = require('../utils/email');

const requiresSecureCookies = (req) => {
    const forwardedProtoHeader = req.headers['x-forwarded-proto'];
    const forwardedProtocols = forwardedProtoHeader
        ? forwardedProtoHeader.split(',').map(proto => proto.trim())
        : [];
    const isForwardedSecure = forwardedProtocols.includes('https');
    const originHeader = req.headers.origin || '';
    const isOriginSecure = typeof originHeader === 'string' && originHeader.startsWith('https://');

    return (
        req.secure ||
        isForwardedSecure ||
        isOriginSecure ||
        process.env.NODE_ENV === 'production'
    );
};

// Generate JWT token
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Send token response
const createSendToken = (req, res, user, statusCode, role = null) => {
    const userRole = role || user.role;
    const token = signToken(user._id, userRole);
    const useSecureCookies = requiresSecureCookies(req);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' : 'lax',
        secure: useSecureCookies,
        path: '/'
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    const userObj = user.toObject();
    delete userObj.password_hash;
    delete userObj.email_otp;
    delete userObj.email_otp_expires;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                phone: user.phone || user.contact_number,
                address: user.address,
                profile_image: user.profile_image,
                is_verified: user.is_verified,
                is_active: user.is_active
            }
        }
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register new user (customer) - Now requires email verification
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // If user exists but is not verified, allow re-registration
        if (!existingUser.is_verified) {
            // Generate new OTP
            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Update existing user with new data and OTP
            existingUser.name = name;
            existingUser.password_hash = await bcrypt.hash(password, 12);
            existingUser.phone = phone;
            existingUser.address = address;
            existingUser.email_otp = otp;
            existingUser.email_otp_expires = otpExpires;
            await existingUser.save();

            // Send OTP email
            try {
                await sendOTPEmail(email, otp, name);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                return next(new AppError('Failed to send verification email. Please try again.', 500));
            }

            return res.status(200).json({
                status: 'success',
                message: 'Verification OTP has been sent to your email.',
                data: {
                    email: email,
                    requiresVerification: true
                }
            });
        }
        return next(new AppError('User with this email already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user (unverified)
    const newUser = await User.create({
        name,
        email,
        password_hash: hashedPassword,
        phone,
        address,
        role: 'user',
        is_verified: false,
        email_otp: otp,
        email_otp_expires: otpExpires
    });

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Delete the user if email fails
        await User.findByIdAndDelete(newUser._id);
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(201).json({
        status: 'success',
        message: 'Registration successful! Please verify your email with the OTP sent.',
        data: {
            email: email,
            requiresVerification: true
        }
    });
});

// Verify email OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new AppError('Please provide email and OTP', 400));
    }

    // Find user with OTP fields
    const user = await User.findOne({ email }).select('+email_otp +email_otp_expires');

    if (!user) {
        return next(new AppError('No user found with this email', 404));
    }

    if (user.is_verified) {
        return next(new AppError('Email is already verified', 400));
    }

    // Check if OTP matches
    if (user.email_otp !== otp) {
        return next(new AppError('Invalid OTP', 400));
    }

    // Check if OTP has expired
    if (user.email_otp_expires < Date.now()) {
        return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    // Mark user as verified and clear OTP
    user.is_verified = true;
    user.email_otp = undefined;
    user.email_otp_expires = undefined;
    await user.save({ validateBeforeSave: false });

    // Log in the user
    createSendToken(req, res, user, 200);
});

// Resend OTP
exports.resendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide email', 400));
    }

    const user = await User.findOne({ email }).select('+email_otp +email_otp_expires');

    if (!user) {
        return next(new AppError('No user found with this email', 404));
    }

    if (user.is_verified) {
        return next(new AppError('Email is already verified', 400));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.email_otp = otp;
    user.email_otp_expires = otpExpires;
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, user.name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'New OTP has been sent to your email.'
    });
});

// Login user (all roles)
exports.login = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    let user;
    let userRole = role || 'user';

    // Check if logging in as vendor
    if (userRole === 'vendor') {
        user = await Vendor.findOne({ email });
        if (!user) {
            return next(new AppError('Incorrect email or password', 401));
        }
    } else {
        // For user, admin, office_staff
        user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // Check if email is verified (only for regular users, not admin/office_staff)
        if (user.role === 'user' && !user.is_verified) {
            return res.status(401).json({
                status: 'fail',
                message: 'Please verify your email before logging in.',
                requiresVerification: true,
                email: email
            });
        }

        // If role is specified, verify it matches
        if (role && user.role !== role) {
            return next(new AppError('Incorrect email or password', 401));
        }

        userRole = user.role;
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // Check if user is active (for non-vendors)
    if (userRole !== 'vendor' && !user.is_active) {
        return next(new AppError('Your account has been deactivated', 401));
    }

    // Check if vendor is verified
    if (userRole === 'vendor' && !user.is_verified) {
        return next(new AppError('Your vendor account is pending verification', 401));
    }

    createSendToken(req, res, user, 200, userRole);
});

// Get current logged in user
exports.getCurrentUser = catchAsync(async (req, res, next) => {
    let user;

    if (req.user.role === 'vendor') {
        user = await Vendor.findById(req.user.id);
    } else {
        user = await User.findById(req.user.id);
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: req.user.role,
                phone: user.phone || user.contact_number,
                address: user.address,
                profile_image: user.profile_image,
                is_verified: user.is_verified,
                is_active: user.is_active,
                company_name: user.company_name,
                is_organization: user.is_organization
            }
        }
    });
});

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new AppError('Please provide current and new password', 400));
    }

    // Get user
    let user;
    if (req.user.role === 'vendor') {
        user = await Vendor.findById(req.user.id);
    } else {
        user = await User.findById(req.user.id);
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordCorrect) {
        return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password_hash = await bcrypt.hash(newPassword, 12);
    await user.save();

    createSendToken(req, res, user, 200, req.user.role);
});

// Update profile
exports.updateProfile = catchAsync(async (req, res, next) => {
    // Don't allow password update through this route
    if (req.body.password || req.body.password_hash) {
        return next(new AppError('This route is not for password updates', 400));
    }

    // Filter allowed fields
    const allowedFields = ['name', 'phone', 'address', 'profile_image', 'contact_number', 'company_name'];
    const filteredBody = {};
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredBody[key] = req.body[key];
        }
    });

    // Update user
    let user;
    if (req.user.role === 'vendor') {
        user = await Vendor.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });
    } else {
        user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Logout user
exports.logout = catchAsync(async (req, res, next) => {
    const useSecureCookies = requiresSecureCookies(req);

    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' : 'lax',
        secure: useSecureCookies,
        path: '/'
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
});

// Register vendor
exports.registerVendor = catchAsync(async (req, res, next) => {
    const { name, email, password, is_organization, company_name, contact_number, id_type, document_url, address } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
        return next(new AppError('Vendor with this email already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new vendor
    const newVendor = await Vendor.create({
        name,
        email,
        password_hash: hashedPassword,
        is_organization: is_organization || false,
        company_name,
        contact_number,
        id_type,
        document_url,
        address,
        role: 'vendor'
    });

    // Don't auto-login, vendor needs to be verified first
    res.status(201).json({
        status: 'success',
        message: 'Vendor registration successful! Your account is pending verification.',
        data: {
            vendor: {
                id: newVendor._id,
                name: newVendor.name,
                email: newVendor.email,
                is_verified: newVendor.is_verified
            }
        }
    });
});
