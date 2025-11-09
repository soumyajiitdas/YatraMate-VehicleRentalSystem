const Vendor = require('../models/Vendor');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVendors = catchAsync(async (req, res, next) => {
    const vendors = await Vendor.find();

    res.status(200).json({
        status: 'success',
        results: vendors.length,
        data: {
            vendors
        }
    });
});

exports.getVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return next(new AppError('No vendor found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vendor
        }
    });
});

exports.createVendor = catchAsync(async (req, res, next) => {
    const newVendor = await Vendor.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            vendor: newVendor
        }
    });
});

exports.updateVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!vendor) {
        return next(new AppError('No vendor found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vendor
        }
    });
});

exports.deleteVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
        return next(new AppError('No vendor found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Get vendor by email (for login)
exports.getVendorByEmail = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findOne({ email: req.params.email });

    if (!vendor) {
        return next(new AppError('No vendor found with that email', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vendor
        }
    });
});

// Verify vendor
exports.verifyVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        { is_verified: true },
        { new: true, runValidators: true }
    );

    if (!vendor) {
        return next(new AppError('No vendor found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vendor
        }
    });
});