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

// Get vendor earnings with filters
exports.getVendorEarnings = catchAsync(async (req, res, next) => {
    const Booking = require('../models/Booking');
    const vendorId = req.user.id; // Get vendor ID from authenticated user
    const { filter } = req.query; // day, week, month, year
    
    // Build date filter
    let dateFilter = {};
    if (filter) {
        const now = new Date();
        let startDate;
        
        switch (filter) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                const dayOfWeek = now.getDay();
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = null;
        }
        
        if (startDate) {
            dateFilter = { 'return_details.actual_return_date': { $gte: startDate } };
        }
    }
    
    // Query bookings
    const earnings = await Booking.find({
        vendor_id: vendorId,
        status: 'returned',
        payment_status: 'paid',
        ...dateFilter
    })
        .populate('vehicle_id', 'name model_name brand registration_number')
        .sort({ 'return_details.actual_return_date': -1 });
    
    // Calculate total earnings
    const totalEarnings = earnings.reduce((sum, booking) => sum + (booking.final_cost || 0), 0);
    
    res.status(200).json({
        status: 'success',
        results: earnings.length,
        data: {
            earnings,
            totalEarnings
        }
    });
});