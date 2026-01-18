const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    package_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    
    // Initial booking request details
    start_location: {
        type: String,
        required: true
    },
    requested_pickup_date: {
        type: Date,
        required: true
    },
    requested_pickup_time: {
        type: String,
        required: true
    },
    
    // Estimated cost at booking time
    estimated_cost: {
        type: Number,
        default: 0
    },
    
    // Advance payment details (40% of estimated cost)
    advance_payment: {
        amount: {
            type: Number,
            default: 0
        },
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paid_at: Date
    },
    
    // Final payment details (remaining amount at return)
    final_payment: {
        amount: {
            type: Number,
            default: 0
        },
        method: {
            type: String,
            enum: ['cash', 'online'],
            default: 'cash'
        },
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        paid_at: Date
    },
    
    // Bill ID generated on pickup confirmation
    bill_id: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Pickup details (filled by office staff)
    pickup_details: {
        staff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        actual_pickup_date: Date,
        actual_pickup_time: String,
        odometer_reading_start: Number,
        vehicle_plate_number: String,
        id_proof_type: {
            type: String,
            enum: ['voter_card', 'pan_card', 'aadhar_card', 'driving_license', 'passport']
        },
        id_number: {
            type: String,
            required: false
        },
        pickup_notes: String
    },
    
    // Return details (filled by office staff)
    return_details: {
        staff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        actual_return_date: Date,
        actual_return_time: String,
        odometer_reading_end: Number,
        vehicle_plate_number: String,
        engine_number: String,
        chassis_number: String,
        vehicle_condition: {
            type: String,
            enum: ['perfect', 'damaged']
        },
        damage_cost: {
            type: Number,
            default: 0
        },
        damage_description: String,
        return_notes: String,
        amount_paid: {
            type: Number,
            required: false
        }
    },
    
    // Cost calculation
    distance_traveled_km: Number,
    duration_hours: Number,
    cost_per_distance: Number,
    cost_per_time: Number,
    damage_cost: {
        type: Number,
        default: 0
    },
    final_cost: Number,
    
    // Status tracking
    status: {
        type: String,
        enum: ['booking_requested', 'picked_up', 'returned', 'cancelled'],
        default: 'booking_requested'
    },
    payment_status: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    rejection_reason: {
        type: String
    },
    
    // Cancellation tracking
    cancellation_reason: {
        type: String
    },
    cancelled_by: {
        type: String,
        enum: ['customer', 'staff'],
        default: null
    },
    cancelled_at: {
        type: Date
    },
    
    // Refund tracking
    refund_status: {
        type: String,
        enum: ['not_applicable', 'pending', 'processing', 'completed'],
        default: 'not_applicable'
    },
    refund_amount: {
        type: Number,
        default: 0
    },
    refund_marked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    refund_marked_at: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
