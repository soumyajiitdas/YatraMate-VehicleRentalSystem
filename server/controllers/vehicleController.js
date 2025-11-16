const Vehicle = require('../models/Vehicle');
const Package = require('../models/Package');
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

// Get grouped vehicles by brand and model
exports.getGroupedVehicles = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find();

    // Group vehicles by brand + model_name
    const groupedMap = new Map();

    for (const vehicle of vehicles) {
        const key = `${vehicle.brand}_${vehicle.model_name}`;
        
        if (!groupedMap.has(key)) {
            // Get the appropriate package for this vehicle
            const vehiclePackage = await Package.findOne({
                vehicle_type: vehicle.type,
                cc_range_min: { $lte: vehicle.cc_engine },
                cc_range_max: { $gte: vehicle.cc_engine },
                is_active: true
            });

            const vehicleData = {
                _id: vehicle._id,
                name: vehicle.name,
                model_name: vehicle.model_name,
                type: vehicle.type,
                brand: vehicle.brand,
                images: vehicle.images,
                location: vehicle.location,
                description: vehicle.description,
                cc_engine: vehicle.cc_engine,
                is_featured: vehicle.is_featured,
                price_per_hour: vehiclePackage ? vehiclePackage.price_per_hour : 0,
                price_per_day: vehiclePackage ? vehiclePackage.price_per_hour * 24 : 0,
                price_per_km: vehiclePackage ? vehiclePackage.price_per_km : 0,
                // Count how many vehicles of this model are available
                total_count: 1,
                available_count: vehicle.availability_status === 'available' ? 1 : 0,
                availability_status: vehicle.availability_status === 'available' ? 'available' : 'not_available'
            };
            groupedMap.set(key, vehicleData);
        } else {
            const existing = groupedMap.get(key);
            existing.total_count++;
            if (vehicle.availability_status === 'available') {
                existing.available_count++;
                existing.availability_status = 'available'; // If at least one is available
            }
        }
    }

    const groupedVehicles = Array.from(groupedMap.values());

    res.status(200).json({
        status: 'success',
        results: groupedVehicles.length,
        data: {
            vehicles: groupedVehicles
        }
    });
});

// Get featured vehicles (max 4)
exports.getFeaturedVehicles = catchAsync(async (req, res, next) => {
    const featuredVehicles = await Vehicle.find({ is_featured: true });

    // Group featured vehicles as well
    const groupedMap = new Map();

    for (const vehicle of featuredVehicles) {
        const key = `${vehicle.brand}_${vehicle.model_name}`;
        
        if (!groupedMap.has(key)) {
            // Get the appropriate package for this vehicle
            const vehiclePackage = await Package.findOne({
                vehicle_type: vehicle.type,
                cc_range_min: { $lte: vehicle.cc_engine },
                cc_range_max: { $gte: vehicle.cc_engine },
                is_active: true
            });

            const vehicleData = {
                _id: vehicle._id,
                name: vehicle.name,
                model_name: vehicle.model_name,
                type: vehicle.type,
                brand: vehicle.brand,
                images: vehicle.images,
                location: vehicle.location,
                description: vehicle.description,
                cc_engine: vehicle.cc_engine,
                is_featured: true,
                price_per_hour: vehiclePackage ? vehiclePackage.price_per_hour : 0,
                price_per_day: vehiclePackage ? vehiclePackage.price_per_hour * 24 : 0,
                price_per_km: vehiclePackage ? vehiclePackage.price_per_km : 0,
                total_count: 1,
                available_count: vehicle.availability_status === 'available' ? 1 : 0,
                availability_status: vehicle.availability_status === 'available' ? 'available' : 'not_available'
            };
            groupedMap.set(key, vehicleData);
        } else {
            const existing = groupedMap.get(key);
            existing.total_count++;
            if (vehicle.availability_status === 'available') {
                existing.available_count++;
                existing.availability_status = 'available';
            }
        }
    }

    const groupedFeatured = Array.from(groupedMap.values()).slice(0, 4);

    res.status(200).json({
        status: 'success',
        results: groupedFeatured.length,
        data: {
            vehicles: groupedFeatured
        }
    });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    // Find the appropriate package for this vehicle
    const vehiclePackage = await Package.findOne({
        vehicle_type: vehicle.type,
        cc_range_min: { $lte: vehicle.cc_engine },
        cc_range_max: { $gte: vehicle.cc_engine },
        is_active: true
    });

    // Check how many vehicles of the same brand and model are available
    const sameModelVehicles = await Vehicle.find({
        brand: vehicle.brand,
        model_name: vehicle.model_name
    });

    const availableCount = sameModelVehicles.filter(v => v.availability_status === 'available').length;
    const isAnyAvailable = availableCount > 0;

    const vehicleData = {
        ...vehicle.toObject(),
        price_per_hour: vehiclePackage ? vehiclePackage.price_per_hour : 0,
        price_per_day: vehiclePackage ? vehiclePackage.price_per_hour * 24 : 0,
        price_per_km: vehiclePackage ? vehiclePackage.price_per_km : 0,
        available_count: availableCount,
        is_available_for_booking: isAnyAvailable
    };

    // Remove sensitive data
    delete vehicleData.registration_number;
    delete vehicleData.engine_number;
    delete vehicleData.chassis_number;

    res.status(200).json({
        status: 'success',
        data: {
            vehicle: vehicleData
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

// Get vehicles by vendor ID
exports.getVehiclesByVendor = catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find({ vendor_id: req.params.vendorId });

    res.status(200).json({
        status: 'success',
        results: vehicles.length,
        data: {
            vehicles
        }
    });
});

// Toggle feature status for a vehicle
exports.toggleFeatureVehicle = catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(new AppError('No vehicle found with that ID', 404));
    }

    // If trying to feature the vehicle, check the limit
    if (!vehicle.is_featured) {
        const featuredCount = await Vehicle.countDocuments({ is_featured: true });
        
        if (featuredCount >= 4) {
            return next(new AppError('Maximum 4 vehicles can be featured at a time', 400));
        }
    }

    // Toggle the feature status
    vehicle.is_featured = !vehicle.is_featured;
    await vehicle.save();

    res.status(200).json({
        status: 'success',
        data: {
            vehicle
        }
    });
});