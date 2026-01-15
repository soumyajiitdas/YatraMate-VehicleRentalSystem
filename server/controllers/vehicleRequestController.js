const VehicleRequest = require('../models/VehicleRequest');
const Vehicle = require('../models/Vehicle');
const Vendor = require('../models/Vendor');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendVehicleApprovalEmail } = require('../utils/email');

// Create a new vehicle request
exports.createVehicleRequest = catchAsync(async (req, res, next) => {
    // Extract vendor_id from authenticated user
    const vehicleRequestData = {
        ...req.body,
        vendor_id: req.user.id
    };

    const newRequest = await VehicleRequest.create(vehicleRequestData);

    res.status(201).json({
        status: 'success',
        data: {
            vehicleRequest: newRequest
        }
    });
});

// Get all vehicle requests
exports.getAllVehicleRequests = catchAsync(async (req, res, next) => {
    const requests = await VehicleRequest.find().populate('vendor_id');

    res.status(200).json({
        status: 'success',
        results: requests.length,
        data: {
            requests
        }
    });
});

// Get vehicle request by ID
exports.getVehicleRequest = catchAsync(async (req, res, next) => {
    const request = await VehicleRequest.findById(req.params.id).populate('vendor_id');

    if (!request) {
        return next(new AppError('No vehicle request found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            request
        }
    });
});

// Get vehicle requests by vendor
exports.getVehicleRequestsByVendor = catchAsync(async (req, res, next) => {
    const requests = await VehicleRequest.find({ vendor_id: req.params.vendorId });

    res.status(200).json({
        status: 'success',
        results: requests.length,
        data: {
            requests
        }
    });
});

// Approve vehicle request
exports.approveVehicleRequest = catchAsync(async (req, res, next) => {
    const request = await VehicleRequest.findById(req.params.id).populate('vendor_id');

    if (!request) {
        return next(new AppError('No vehicle request found with that ID', 404));
    }

    if (request.status !== 'pending') {
        return next(new AppError('This request has already been processed', 400));
    }

    // Create the vehicle
    const vehicleData = {
        vendor_id: request.vendor_id,
        name: request.name,
        model_name: request.model_name,
        type: request.type,
        brand: request.brand,
        registration_number: request.registration_number,
        engine_number: request.engine_number,
        chassis_number: request.chassis_number,
        cc_engine: request.cc_engine,
        location: request.location,
        rc_document: request.rc_document,
        insurance_document: request.insurance_document,
        images: request.vehicle_images,
        availability_status: 'available'
    };

    const newVehicle = await Vehicle.create(vehicleData);

    // Update request status
    request.status = 'approved';
    request.admin_notes = req.body.admin_notes || '';
    await request.save();

    // Send vehicle approval email to vendor
    try {
        const vendor = request.vendor_id;
        if (vendor && vendor.email) {
            await sendVehicleApprovalEmail(vendor.email, {
                vendorName: vendor.name,
                vehicleName: request.name,
                vehicleBrand: request.brand,
                vehicleModel: request.model_name,
                registrationNumber: request.registration_number,
                vehicleType: request.type
            });
        }
    } catch (emailError) {
        console.error('Failed to send vehicle approval email:', emailError);
        // Continue even if email fails - vehicle is still approved
    }

    res.status(200).json({
        status: 'success',
        data: {
            vehicle: newVehicle,
            request
        }
    });
});

// Reject vehicle request
exports.rejectVehicleRequest = catchAsync(async (req, res, next) => {
    const request = await VehicleRequest.findById(req.params.id);

    if (!request) {
        return next(new AppError('No vehicle request found with that ID', 404));
    }

    if (request.status !== 'pending') {
        return next(new AppError('This request has already been processed', 400));
    }

    request.status = 'rejected';
    request.rejection_reason = req.body.rejection_reason || 'No reason provided';
    request.admin_notes = req.body.admin_notes || '';
    await request.save();

    res.status(200).json({
        status: 'success',
        data: {
            request
        }
    });
});

// Delete vehicle request
exports.deleteVehicleRequest = catchAsync(async (req, res, next) => {
    const request = await VehicleRequest.findByIdAndDelete(req.params.id);

    if (!request) {
        return next(new AppError('No vehicle request found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
