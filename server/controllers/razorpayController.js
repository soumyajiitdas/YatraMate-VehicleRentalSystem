const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const Package = require('../models/Package');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RZP_API_KEY,
    key_secret: process.env.RZP_KEY_SECRET
});

// Create order for advance payment (40% of estimated cost)
exports.createAdvancePaymentOrder = catchAsync(async (req, res, next) => {
    const { vehicle_id, estimated_cost } = req.body;
    
    if (!vehicle_id || !estimated_cost) {
        return next(new AppError('Vehicle ID and estimated cost are required', 400));
    }
    
    // Calculate 40% advance amount
    const advanceAmount = Math.round(estimated_cost * 0.40);
    
    // Amount in paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = advanceAmount * 100;
    
    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `adv_${Date.now()}_${vehicle_id.toString().slice(-6)}`,
        notes: {
            payment_type: 'advance',
            vehicle_id: vehicle_id,
            estimated_cost: estimated_cost,
            advance_amount: advanceAmount
        }
    };
    
    try {
        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            status: 'success',
            data: {
                order_id: order.id,
                amount: advanceAmount,
                amount_in_paise: amountInPaise,
                currency: order.currency,
                key_id: process.env.RZP_API_KEY
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return next(new AppError('Failed to create payment order', 500));
    }
});

// Verify advance payment and create booking
exports.verifyAdvancePayment = catchAsync(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        vehicle_id,
        start_location,
        requested_pickup_date,
        requested_pickup_time,
        estimated_cost,
        advance_amount
    } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RZP_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
        return next(new AppError('Invalid payment signature', 400));
    }
    
    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
        return next(new AppError('Vehicle not found', 404));
    }
    
    // Find appropriate package
    const packageData = await Package.findOne({
        cc_range_min: { $lte: vehicle.cc_engine },
        cc_range_max: { $gte: vehicle.cc_engine },
        vehicle_type: vehicle.type,
        is_active: true
    });
    
    if (!packageData) {
        return next(new AppError('No package found for this vehicle', 404));
    }
    
    // Create booking with advance payment details
    const newBooking = await Booking.create({
        user_id: req.user.id,
        vehicle_id,
        vendor_id: vehicle.vendor_id,
        package_id: packageData._id,
        start_location,
        requested_pickup_date,
        requested_pickup_time,
        estimated_cost,
        advance_payment: {
            amount: advance_amount,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: 'completed',
            paid_at: new Date()
        },
        status: 'booking_requested'
    });
    
    // Update vehicle status to booked
    vehicle.availability_status = 'booked';
    await vehicle.save();
    
    // Create payment record
    await Payment.create({
        booking_id: newBooking._id,
        user_id: req.user.id,
        amount: advance_amount,
        payment_method: 'razorpay',
        transaction_id: razorpay_payment_id,
        payment_status: 'success',
        payment_date: new Date()
    });
    
    const populatedBooking = await Booking.findById(newBooking._id)
        .populate('vehicle_id')
        .populate('package_id')
        .populate('user_id', 'name email phone');
    
    res.status(201).json({
        status: 'success',
        message: 'Payment successful! Your booking has been confirmed.',
        data: {
            booking: populatedBooking,
            payment: {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount: advance_amount
            }
        }
    });
});

// Create order for final payment (remaining amount at return)
exports.createFinalPaymentOrder = catchAsync(async (req, res, next) => {
    const { booking_id, final_amount, advance_paid } = req.body;
    
    if (!booking_id || final_amount === undefined) {
        return next(new AppError('Booking ID and final amount are required', 400));
    }
    
    const booking = await Booking.findById(booking_id);
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }
    
    // Calculate remaining amount
    const advancePaid = advance_paid || booking.advance_payment?.amount || 0;
    const remainingAmount = Math.max(0, Math.round(final_amount - advancePaid));
    
    if (remainingAmount <= 0) {
        return res.status(200).json({
            status: 'success',
            message: 'No remaining amount to pay',
            data: {
                remaining_amount: 0
            }
        });
    }
    
    // Amount in paise
    const amountInPaise = remainingAmount * 100;
    
    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `fin_${Date.now()}_${booking_id.toString().slice(-6)}`,
        notes: {
            payment_type: 'final',
            booking_id: booking_id,
            final_amount: final_amount,
            advance_paid: advancePaid,
            remaining_amount: remainingAmount
        }
    };
    
    try {
        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            status: 'success',
            data: {
                order_id: order.id,
                amount: remainingAmount,
                amount_in_paise: amountInPaise,
                currency: order.currency,
                key_id: process.env.RZP_API_KEY,
                advance_paid: advancePaid,
                final_amount: final_amount
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return next(new AppError('Failed to create payment order', 500));
    }
});

// Verify final payment
exports.verifyFinalPayment = catchAsync(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        booking_id,
        amount
    } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RZP_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
        return next(new AppError('Invalid payment signature', 400));
    }
    
    // Update booking with final payment details
    const booking = await Booking.findById(booking_id);
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }
    
    booking.final_payment = {
        amount: amount,
        method: 'online',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        paid_at: new Date()
    };
    
    await booking.save();
    
    // Create payment record
    await Payment.create({
        booking_id: booking._id,
        user_id: booking.user_id,
        amount: amount,
        payment_method: 'razorpay',
        transaction_id: razorpay_payment_id,
        payment_status: 'success',
        payment_date: new Date()
    });
    
    res.status(200).json({
        status: 'success',
        message: 'Final payment successful!',
        data: {
            booking_id: booking._id,
            payment: {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount: amount
            }
        }
    });
});

// Get Razorpay key for frontend
exports.getRazorpayKey = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            key_id: process.env.RZP_API_KEY
        }
    });
});
