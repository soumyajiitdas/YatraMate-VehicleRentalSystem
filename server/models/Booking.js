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
    pickup_location: {
        type: String,
        required: true
    },
    dropoff_location: {
        type: String,
        required: true
    },
    pickup_datetime: {
        type: Date,
        required: true
    },
    dropoff_datetime: {
        type: Date,
        required: true
    },
    duration_hours: {
        type: Number,
        required: true
    },
    total_cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    payment_status: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
