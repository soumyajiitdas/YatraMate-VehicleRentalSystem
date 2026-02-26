const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Protect routes - verify JWT token
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token from cookie or Authorization header
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access', 401));
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired. Please log in again', 401));
        }
        return next(new AppError('Token verification failed', 401));
    }

    // Check if user still exists
    let currentUser;
    if (decoded.role === 'vendor') {
        currentUser = await Vendor.findById(decoded.id);
    } else {
        currentUser = await User.findById(decoded.id);
    }

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // Check if user is active
    if (decoded.role !== 'vendor' && !currentUser.is_active) {
        return next(new AppError('Your account has been deactivated', 401));
    }

    // Check if vendor is verified
    if (decoded.role === 'vendor' && !currentUser.is_verified) {
        return next(new AppError('Your vendor account is pending verification', 401));
    }

    // Grant access to protected route
    req.user = {
        id: decoded.id,
        role: decoded.role
    };
    next();
});

// Restrict access to specific roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
