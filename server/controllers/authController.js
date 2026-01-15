const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const PendingUser = require('../models/PendingUser');
const PendingVendor = require('../models/PendingVendor');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendOTPEmail, sendPasswordResetEmail, sendPasswordChangeOTPEmail } = require('../utils/email');

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
// User is stored in PendingUser collection until email is verified
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists in verified users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if there's already a pending registration for this email
    const existingPending = await PendingUser.findOne({ email });
    
    if (existingPending) {
        // Update existing pending registration with new data and OTP
        existingPending.name = name;
        existingPending.password_hash = hashedPassword;
        existingPending.phone = phone;
        existingPending.address = address;
        existingPending.email_otp = otp;
        existingPending.email_otp_expires = otpExpires;
        await existingPending.save();
    } else {
        // Create new pending user registration
        await PendingUser.create({
            name,
            email,
            password_hash: hashedPassword,
            phone,
            address,
            email_otp: otp,
            email_otp_expires: otpExpires
        });
    }

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Delete the pending user if email fails
        await PendingUser.findOneAndDelete({ email });
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

// Verify email OTP - Move user from PendingUser to User collection
exports.verifyOTP = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new AppError('Please provide email and OTP', 400));
    }

    // First check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email is already verified', 400));
    }

    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
        return next(new AppError('No pending registration found with this email. Please register again.', 404));
    }

    // Check if OTP matches
    if (pendingUser.email_otp !== otp) {
        return next(new AppError('Invalid OTP', 400));
    }

    // Check if OTP has expired
    if (pendingUser.email_otp_expires < Date.now()) {
        return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    // Create verified user in User collection
    const newUser = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password_hash: pendingUser.password_hash,
        phone: pendingUser.phone,
        address: pendingUser.address,
        role: 'user',
        is_verified: true,
        is_active: true
    });

    // Delete pending registration
    await PendingUser.findByIdAndDelete(pendingUser._id);

    // Log in the user
    createSendToken(req, res, newUser, 200);
});

// Resend OTP - For pending user registrations
exports.resendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide email', 400));
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email is already verified', 400));
    }

    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
        return next(new AppError('No pending registration found with this email. Please register again.', 404));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    pendingUser.email_otp = otp;
    pendingUser.email_otp_expires = otpExpires;
    await pendingUser.save();

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, pendingUser.name);
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

        // Check if vendor email is verified
        if (!user.email_verified) {
            return res.status(401).json({
                status: 'fail',
                message: 'Please verify your email before logging in.',
                requiresVerification: true,
                email: email,
                userType: 'vendor'
            });
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
                email: email,
                userType: 'user'
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

    // Check if vendor is verified (admin verification)
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

// Register vendor - Now requires email verification
// Vendor is stored in PendingVendor collection until email is verified
exports.registerVendor = catchAsync(async (req, res, next) => {
    const { name, email, password, is_organization, company_name, contact_number, id_type, document_url, address } = req.body;

    // Check if vendor already exists in verified vendors
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
        return next(new AppError('Vendor with this email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Check if there's already a pending registration for this email
    const existingPending = await PendingVendor.findOne({ email });
    
    if (existingPending) {
        // Update existing pending registration with new data and OTP
        existingPending.name = name;
        existingPending.password_hash = hashedPassword;
        existingPending.is_organization = is_organization || false;
        existingPending.company_name = company_name;
        existingPending.contact_number = contact_number;
        existingPending.id_type = id_type;
        existingPending.document_url = document_url;
        existingPending.address = address;
        existingPending.email_otp = otp;
        existingPending.email_otp_expires = otpExpires;
        await existingPending.save();
    } else {
        // Create new pending vendor registration
        await PendingVendor.create({
            name,
            email,
            password_hash: hashedPassword,
            is_organization: is_organization || false,
            company_name,
            contact_number,
            id_type,
            document_url,
            address,
            email_otp: otp,
            email_otp_expires: otpExpires
        });
    }

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Delete the pending vendor if email fails
        await PendingVendor.findOneAndDelete({ email });
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(201).json({
        status: 'success',
        message: 'Registration successful! Please verify your email with the OTP sent.',
        data: {
            email: email,
            requiresVerification: true,
            userType: 'vendor'
        }
    });
});

// Verify vendor email OTP - Move vendor from PendingVendor to Vendor collection
exports.verifyVendorOTP = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new AppError('Please provide email and OTP', 400));
    }

    // First check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
        return next(new AppError('Email is already verified', 400));
    }

    // Find pending vendor
    const pendingVendor = await PendingVendor.findOne({ email });

    if (!pendingVendor) {
        return next(new AppError('No pending registration found with this email. Please register again.', 404));
    }

    // Check if OTP matches
    if (pendingVendor.email_otp !== otp) {
        return next(new AppError('Invalid OTP', 400));
    }

    // Check if OTP has expired
    if (pendingVendor.email_otp_expires < Date.now()) {
        return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    // Create verified vendor in Vendor collection (email verified but not admin verified yet)
    const newVendor = await Vendor.create({
        name: pendingVendor.name,
        email: pendingVendor.email,
        password_hash: pendingVendor.password_hash,
        is_organization: pendingVendor.is_organization,
        company_name: pendingVendor.company_name,
        contact_number: pendingVendor.contact_number,
        id_type: pendingVendor.id_type,
        document_url: pendingVendor.document_url,
        address: pendingVendor.address,
        role: 'vendor',
        email_verified: true,
        is_verified: false // Still needs admin verification
    });

    // Delete pending registration
    await PendingVendor.findByIdAndDelete(pendingVendor._id);

    // Don't auto-login, vendor still needs admin verification
    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully! Your vendor account is now pending admin verification.',
        data: {
            vendor: {
                id: newVendor._id,
                name: newVendor.name,
                email: newVendor.email,
                email_verified: newVendor.email_verified,
                is_verified: newVendor.is_verified
            }
        }
    });
});

// Resend vendor OTP - For pending vendor registrations
exports.resendVendorOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide email', 400));
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
        return next(new AppError('Email is already verified', 400));
    }

    // Find pending vendor
    const pendingVendor = await PendingVendor.findOne({ email });

    if (!pendingVendor) {
        return next(new AppError('No pending registration found with this email. Please register again.', 404));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    pendingVendor.email_otp = otp;
    pendingVendor.email_otp_expires = otpExpires;
    await pendingVendor.save();

    // Send OTP email
    try {
        await sendOTPEmail(email, otp, pendingVendor.name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'New OTP has been sent to your email.'
    });
});

// Forgot Password - Send reset token via email
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide your email address', 400));
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('No user found with this email address', 404));
    }

    // Generate reset token (using crypto for secure random token)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token before saving to database
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set token and expiry (10 minutes)
    user.password_reset_token = hashedToken;
    user.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Create reset URL - use frontend URL
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;

    try {
        await sendPasswordResetEmail(email, resetURL, user.name);

        res.status(200).json({
            status: 'success',
            message: 'Password reset link has been sent to your email.'
        });
    } catch (emailError) {
        // If email fails, clear the reset token
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        await user.save({ validateBeforeSave: false });

        console.error('Email sending failed:', emailError);
        return next(new AppError('Failed to send password reset email. Please try again.', 500));
    }
});

// Reset Password - Verify token and update password
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return next(new AppError('Please provide reset token and new password', 400));
    }

    if (password.length < 8) {
        return next(new AppError('Password must be at least 8 characters long', 400));
    }

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Find user with valid token and non-expired
    const user = await User.findOne({
        password_reset_token: hashedToken,
        password_reset_expires: { $gt: Date.now() }
    }).select('+password_reset_token +password_reset_expires');

    if (!user) {
        return next(new AppError('Invalid or expired password reset token', 400));
    }

    // Update password
    user.password_hash = await bcrypt.hash(password, 12);
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully. You can now login with your new password.'
    });
});


// Request OTP for password change (for logged-in users)
exports.requestPasswordChangeOTP = catchAsync(async (req, res, next) => {
    const { currentPassword } = req.body;

    if (!currentPassword) {
        return next(new AppError('Please provide your current password', 400));
    }

    // Get user based on role
    let user;
    if (req.user.role === 'vendor') {
        user = await Vendor.findById(req.user.id);
    } else {
        user = await User.findById(req.user.id);
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordCorrect) {
        return next(new AppError('Current password is incorrect', 401));
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in user document
    if (req.user.role === 'vendor') {
        user.password_change_otp = otp;
        user.password_change_otp_expires = otpExpires;
        await user.save({ validateBeforeSave: false });
    } else {
        user.password_change_otp = otp;
        user.password_change_otp_expires = otpExpires;
        await user.save({ validateBeforeSave: false });
    }

    // Send OTP email
    try {
        await sendPasswordChangeOTPEmail(user.email, otp, user.name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Clear OTP on failure
        user.password_change_otp = undefined;
        user.password_change_otp_expires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'Verification OTP has been sent to your email.'
    });
});

// Verify OTP and change password
exports.verifyPasswordChangeOTP = catchAsync(async (req, res, next) => {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
        return next(new AppError('Please provide OTP and new password', 400));
    }

    if (newPassword.length < 6) {
        return next(new AppError('Password must be at least 6 characters long', 400));
    }

    // Get user based on role with OTP fields
    let user;
    if (req.user.role === 'vendor') {
        user = await Vendor.findById(req.user.id).select('+password_change_otp +password_change_otp_expires');
    } else {
        user = await User.findById(req.user.id).select('+password_change_otp +password_change_otp_expires');
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if OTP exists
    if (!user.password_change_otp) {
        return next(new AppError('No password change request found. Please request OTP first.', 400));
    }

    // Check if OTP matches
    if (user.password_change_otp !== otp) {
        return next(new AppError('Invalid OTP', 400));
    }

    // Check if OTP has expired
    if (user.password_change_otp_expires < Date.now()) {
        return next(new AppError('OTP has expired. Please request a new one.', 400));
    }

    // Update password and clear OTP
    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.password_change_otp = undefined;
    user.password_change_otp_expires = undefined;
    await user.save({ validateBeforeSave: false });

    // Send success response with new token
    createSendToken(req, res, user, 200, req.user.role);
});

// Resend password change OTP
exports.resendPasswordChangeOTP = catchAsync(async (req, res, next) => {
    // Get user based on role
    let user;
    if (req.user.role === 'vendor') {
        user = await Vendor.findById(req.user.id);
    } else {
        user = await User.findById(req.user.id);
    }

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.password_change_otp = otp;
    user.password_change_otp_expires = otpExpires;
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
        await sendPasswordChangeOTPEmail(user.email, otp, user.name);
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        return next(new AppError('Failed to send verification email. Please try again.', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'New OTP has been sent to your email.'
    });
});

