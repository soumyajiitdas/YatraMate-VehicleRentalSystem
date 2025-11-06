const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVehicles = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find();

    res.status(200).json({
        status: 'success',
        results: vehicles.length,
        data: {
            vehicles
        }
    });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vehicle
        }
    });
});

exports.createVehicle = catchAsync(async (req, res, next) => {
    const newVehicle = await Vehicle.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            vehicle: newVehicle
        }
    });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            vehicle
        }
    });
});

exports.deleteVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
