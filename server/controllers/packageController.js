const Package = require('../models/Package');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new package
exports.createPackage = catchAsync(async (req, res, next) => {
    const packageData = await Package.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            package: packageData
        }
    });
});

// Get all packages
exports.getAllPackages = catchAsync(async (req, res, next) => {
    const packages = await Package.find().sort({ cc_range_min: 1 });
    
    res.status(200).json({
        status: 'success',
        results: packages.length,
        data: {
            packages
        }
    });
});

// Get package by ID
exports.getPackageById = catchAsync(async (req, res, next) => {
    const packageData = await Package.findById(req.params.id);
    
    if (!packageData) {
        return next(new AppError('No package found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            package: packageData
        }
    });
});

// Get package for a specific vehicle CC
exports.getPackageForVehicle = catchAsync(async (req, res, next) => {
    // Support both parameter formats for backward compatibility
    const cc_engine = req.query.cc_engine || req.query.cc;
    const vehicle_type = req.query.vehicle_type || req.query.type;
    
    if (!cc_engine || !vehicle_type) {
        return next(new AppError('Please provide cc_engine (or cc) and vehicle_type (or type)', 400));
    }
    
    const packageData = await Package.findOne({
        cc_range_min: { $lte: parseInt(cc_engine) },
        cc_range_max: { $gte: parseInt(cc_engine) },
        vehicle_type: vehicle_type,
        is_active: true
    });
    
    if (!packageData) {
        return res.status(200).json({
            status: 'success',
            data: {
                package: null
            }
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            package: packageData
        }
    });
});

// Update package
exports.updatePackage = catchAsync(async (req, res, next) => {
    const packageData = await Package.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    
    if (!packageData) {
        return next(new AppError('No package found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            package: packageData
        }
    });
});

// Delete package (soft delete)
exports.deletePackage = catchAsync(async (req, res, next) => {
    const packageData = await Package.findByIdAndUpdate(
        req.params.id,
        { is_active: false },
        { new: true }
    );
    
    if (!packageData) {
        return next(new AppError('No package found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            package: packageData
        }
    });
});
