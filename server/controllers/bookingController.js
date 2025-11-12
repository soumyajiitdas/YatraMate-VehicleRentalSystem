const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Package = require('../models/Package');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Customer creates a booking request (no payment yet)
exports.createBookingRequest = catchAsync(async (req, res, next) => {
    const { vehicle_id, start_location, end_location, requested_pickup_date, requested_pickup_time } = req.body;
    
    // Get vehicle to find package
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
        return next(new AppError('Vehicle not found', 404));
    }
    
    // Find appropriate package based on vehicle CC
    const packageData = await Package.findOne({
        cc_range_min: { $lte: vehicle.cc_engine },
        cc_range_max: { $gte: vehicle.cc_engine },
        vehicle_type: vehicle.type,
        is_active: true
    });
    
    if (!packageData) {
        return next(new AppError('No package found for this vehicle', 404));
    }
    
    // Create booking request - extract user_id from authenticated user
    const newBooking = await Booking.create({
        user_id: req.user.id,
        vehicle_id,
        vendor_id: vehicle.vendor_id,
        package_id: packageData._id,
        start_location,
        end_location,
        requested_pickup_date,
        requested_pickup_time,
        status: 'booking_requested'
    });
    
    // Update vehicle status to booked
    vehicle.availability_status = 'booked';
    await vehicle.save();
    
    const populatedBooking = await Booking.findById(newBooking._id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone');

    res.status(201).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});

// Get all booking requests for office staff
exports.getOfficeStaffRequests = catchAsync(async (req, res, next) => {
    const { status } = req.query;
    
    const filter = status ? { status } : {};
    
    const bookings = await Booking.find(filter)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone')
        .populate('pickup_details.staff_id', 'name')
        .populate('return_details.staff_id', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

// Office staff confirms vehicle pickup
exports.confirmPickup = catchAsync(async (req, res, next) => {
    const { bookingId } = req.params;
    const {
        staff_id,
        actual_pickup_date,
        actual_pickup_time,
        odometer_reading_start,
        vehicle_plate_number,
        id_proof_type,
        pickup_notes
    } = req.body;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }
    
    if (booking.status !== 'booking_requested') {
        return next(new AppError('Booking is not in requested state', 400));
    }
    
    // Update pickup details
    booking.pickup_details = {
        staff_id,
        actual_pickup_date: actual_pickup_date || new Date(),
        actual_pickup_time,
        odometer_reading_start,
        vehicle_plate_number,
        id_proof_type,
        pickup_notes
    };
    
    booking.status = 'picked_up';
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone')
        .populate('pickup_details.staff_id', 'name');

    res.status(200).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});

// Office staff confirms vehicle return and calculates final cost
exports.confirmReturn = catchAsync(async (req, res, next) => {
    const { bookingId } = req.params;
    const {
        staff_id,
        actual_return_date,
        actual_return_time,
        odometer_reading_end,
        vehicle_plate_number,
        engine_number,
        chassis_number,
        vehicle_condition,
        damage_cost,
        damage_description,
        return_notes
    } = req.body;
    
    const booking = await Booking.findById(bookingId)
        .populate('vehicle_id')
        .populate('package_id');
    
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }
    
    if (booking.status !== 'picked_up') {
        return next(new AppError('Booking is not in picked up state', 400));
    }
    
    // Verify vehicle details
    const vehicle = booking.vehicle_id;
    if (vehicle.registration_number !== vehicle_plate_number) {
        return next(new AppError('Vehicle plate number does not match', 400));
    }
    if (vehicle.engine_number !== engine_number) {
        return next(new AppError('Engine number does not match', 400));
    }
    if (vehicle.chassis_number !== chassis_number) {
        return next(new AppError('Chassis number does not match', 400));
    }
    
    // Calculate distance traveled
    const distance_traveled = odometer_reading_end - booking.pickup_details.odometer_reading_start;
    
    // Calculate duration in hours
    const pickupDateTime = new Date(`${booking.pickup_details.actual_pickup_date} ${booking.pickup_details.actual_pickup_time}`);
    const returnDateTime = new Date(`${actual_return_date} ${actual_return_time}`);
    const duration_hours = Math.ceil((returnDateTime - pickupDateTime) / (1000 * 60 * 60));
    
    // Calculate costs
    const packageData = booking.package_id;
    const cost_per_distance = distance_traveled * packageData.price_per_km;
    const cost_per_time = duration_hours * packageData.price_per_hour;
    
    // Final cost is the maximum of distance cost and time cost, plus damage cost
    const max_cost = Math.max(cost_per_distance, cost_per_time);
    const final_cost = max_cost + (damage_cost || 0);
    
    // Update return details
    booking.return_details = {
        staff_id,
        actual_return_date: actual_return_date || new Date(),
        actual_return_time,
        odometer_reading_end,
        vehicle_plate_number,
        engine_number,
        chassis_number,
        vehicle_condition,
        damage_cost: damage_cost || 0,
        damage_description,
        return_notes
    };
    
    booking.distance_traveled_km = distance_traveled;
    booking.duration_hours = duration_hours;
    booking.cost_per_distance = cost_per_distance;
    booking.cost_per_time = cost_per_time;
    booking.damage_cost = damage_cost || 0;
    booking.final_cost = final_cost;
    booking.status = 'returned';
    
    await booking.save();
    
    // Update vehicle status back to available
    vehicle.availability_status = 'available';
    await vehicle.save();
    
    const populatedBooking = await Booking.findById(booking._id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone')
        .populate('pickup_details.staff_id', 'name')
        .populate('return_details.staff_id', 'name');

    res.status(200).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});

// Get user's bookings
exports.getUserBookings = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    
    const bookings = await Booking.find({ user_id: userId })
        .populate('vehicle_id')
        .populate('package_id')
        .populate('pickup_details.staff_id', 'name')
        .populate('return_details.staff_id', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

// Get single booking details
exports.getBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone')
        .populate('pickup_details.staff_id', 'name')
        .populate('return_details.staff_id', 'name');

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            booking
        }
    });
});

// Get all bookings (admin)
exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find()
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone');

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});

// Cancel booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }
    
    if (booking.status !== 'booking_requested') {
        return next(new AppError('Can only cancel bookings in requested state', 400));
    }

    booking.status = 'cancelled';
    await booking.save();
    
    // Update vehicle status back to available
    const vehicle = await Vehicle.findById(booking.vehicle_id);
    if (vehicle) {
        vehicle.availability_status = 'available';
        await vehicle.save();
    }

    res.status(200).json({
        status: 'success',
        data: {
            booking
        }
    });
});
