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
    
    // Generate unique Bill ID in format: BILL-YYYYMMDD-XXXXX
    const generateBillId = async () => {
        const today = new Date();
        const dateStr = today.getFullYear() + 
                       String(today.getMonth() + 1).padStart(2, '0') + 
                       String(today.getDate()).padStart(2, '0');
        
        // Find the count of bills created today
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        
        const todayBillsCount = await Booking.countDocuments({
            bill_id: { $regex: `^BILL-${dateStr}-` },
            createdAt: { $gte: todayStart, $lt: todayEnd }
        });
        
        const sequenceNumber = String(todayBillsCount + 1).padStart(5, '0');
        return `BILL-${dateStr}-${sequenceNumber}`;
    };
    
    const billId = await generateBillId();
    
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
    
    booking.bill_id = billId;
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
        return_notes,
        amount_paid
    } = req.body;
    
    // Validate amount_paid is provided
    if (!amount_paid || amount_paid <= 0) {
        return next(new AppError('Amount paid is required and must be greater than 0', 400));
    }
    
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
    
    // Helper function to parse time string (handles both 12-hour AM/PM and 24-hour formats)
    const parseTimeString = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return null;
        
        const str = timeStr.trim().toUpperCase();
        
        // Handle 12-hour format with AM/PM
        const ampmMatch = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (ampmMatch) {
            let hours = parseInt(ampmMatch[1], 10);
            const minutes = parseInt(ampmMatch[2], 10);
            const modifier = ampmMatch[3];
            
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            
            return { hours, minutes };
        }
        
        // Handle 24-hour format (HH:MM or HH:MM:SS)
        const hhmmMatch = str.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
        if (hhmmMatch) {
            return {
                hours: parseInt(hhmmMatch[1], 10),
                minutes: parseInt(hhmmMatch[2], 10)
            };
        }
        
        return null;
    };
    
    // Calculate duration in hours - properly handle dates and times
    let pickupDateTime;
    
    // Get pickup date - could be from actual_pickup_date or requested_pickup_date
    const rawPickupDate = booking.pickup_details.actual_pickup_date || booking.requested_pickup_date;
    const rawPickupTime = booking.pickup_details.actual_pickup_time || booking.requested_pickup_time;
    
    // Create pickup DateTime
    if (rawPickupDate) {
        // Convert to Date object if it's not already
        const dateObj = new Date(rawPickupDate);
        
        // Extract just the date components (year, month, day) and create a new date at midnight
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        pickupDateTime = new Date(year, month, day, 0, 0, 0, 0);
        
        // Parse and set the time component from the time string
        const pickupTimeParts = parseTimeString(rawPickupTime);
        if (pickupTimeParts) {
            pickupDateTime.setHours(pickupTimeParts.hours, pickupTimeParts.minutes, 0, 0);
        } else {
            // If no time string or can't parse, try to use the time from the date object
            pickupDateTime.setHours(dateObj.getHours(), dateObj.getMinutes(), 0, 0);
        }
        
        console.log('Pickup DateTime:', {
            rawPickupDate,
            rawPickupTime,
            parsedDateTime: pickupDateTime.toISOString(),
            parsedLocal: pickupDateTime.toString()
        });
    } else {
        return next(new AppError('Pickup date not found', 400));
    }
    
    // Create return DateTime
    let returnDateTime;
    if (actual_return_date && actual_return_time) {
        // Combine date and time properly using ISO format
        returnDateTime = new Date(`${actual_return_date}T${actual_return_time}:00`);
    } else if (actual_return_date) {
        returnDateTime = new Date(actual_return_date);
    } else {
        returnDateTime = new Date();
    }
    
    console.log('Return DateTime:', {
        actual_return_date,
        actual_return_time,
        parsedDateTime: returnDateTime.toISOString(),
        parsedLocal: returnDateTime.toString()
    });
    
    // Validate dates
    if (isNaN(pickupDateTime.getTime())) {
        return next(new AppError('Invalid pickup date/time', 400));
    }
    if (isNaN(returnDateTime.getTime())) {
        return next(new AppError('Invalid return date/time', 400));
    }
    
    // Calculate duration in hours
    const msDiff = returnDateTime.getTime() - pickupDateTime.getTime();
    const duration_hours = Math.ceil(msDiff / (1000 * 60 * 60));
    
    // Ensure duration is positive
    if (duration_hours < 0) {
        return next(new AppError('Return time cannot be before pickup time', 400));
    }
    
    // Calculate costs
    const packageData = booking.package_id;
    const cost_per_distance = distance_traveled * packageData.price_per_km;
    const cost_per_time = duration_hours * packageData.price_per_hour;
    
    // Final cost is the maximum of distance cost and time cost, plus damage cost
    const max_cost = Math.max(cost_per_distance, cost_per_time);
    const final_cost = max_cost + (parseFloat(damage_cost) || 0);
    
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
        damage_cost: parseFloat(damage_cost) || 0,
        damage_description,
        return_notes,
        amount_paid: parseFloat(amount_paid)
    };
    
    booking.distance_traveled_km = distance_traveled;
    booking.duration_hours = duration_hours;
    booking.cost_per_distance = cost_per_distance;
    booking.cost_per_time = cost_per_time;
    booking.damage_cost = parseFloat(damage_cost) || 0;
    booking.final_cost = final_cost;
    booking.status = 'returned';
    
    await booking.save();
    
    // Update vehicle status back to available and update stats
    vehicle.availability_status = 'available';
    vehicle.total_bookings = (vehicle.total_bookings || 0) + 1;
    vehicle.total_distance_travelled = (vehicle.total_distance_travelled || 0) + distance_traveled;
    vehicle.total_hours_booked = (vehicle.total_hours_booked || 0) + duration_hours;
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

// Reject booking (Office staff)
exports.rejectBooking = catchAsync(async (req, res, next) => {
    const { bookingId } = req.params;
    const { rejection_reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404));
    }
    
    if (booking.status !== 'booking_requested') {
        return next(new AppError('Can only reject bookings in requested state', 400));
    }

    if (!rejection_reason || rejection_reason.trim() === '') {
        return next(new AppError('Rejection reason is required', 400));
    }

    booking.status = 'cancelled';
    booking.rejection_reason = rejection_reason;
    await booking.save();
    
    // Update vehicle status back to available
    const vehicle = await Vehicle.findById(booking.vehicle_id);
    if (vehicle) {
        vehicle.availability_status = 'available';
        await vehicle.save();
    }

    const populatedBooking = await Booking.findById(booking._id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone');

    res.status(200).json({
        status: 'success',
        data: {
            booking: populatedBooking
        }
    });
});
