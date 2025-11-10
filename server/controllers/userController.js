const User = require('../models/User');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    // This route is for admin to create office staff
    const { name, email, password, phone, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
    }

    // Hash password if provided
    let password_hash;
    if (password) {
        password_hash = await bcrypt.hash(password, 12);
    } else {
        return next(new AppError('Password is required', 400));
    }

    // Create user with specified role (admin can create office_staff)
    const newUser = await User.create({
        name,
        email,
        password_hash,
        phone,
        address,
        role: role || 'user'
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password_hash;

    res.status(201).json({
        status: 'success',
        data: {
            user: userResponse
        }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
