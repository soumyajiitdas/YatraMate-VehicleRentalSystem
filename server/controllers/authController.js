const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Generate JWT token
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Send token response
const createSendToken = (user, statusCode, res, role = null) => {
    const userRole = role || user.role;
    const token = signToken(user._id, userRole);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    const userObj = user.toObject();
    delete userObj.password_hash;

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

// Register new user (customer)
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
        name,
        email,
        password_hash: hashedPassword,
        phone,
        address,
        role: 'user'
    });

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res, userRole);
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

    createSendToken(user, 200, res, req.user.role);
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
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
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