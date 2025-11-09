const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    model_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['car', 'bike'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    registration_number: {
        type: String,
        required: true,
        unique: true
    },
    engine_number: {
        type: String,
        required: true,
        unique: true
    },
    chassis_number: {
        type: String,
        required: true,
        unique: true
    },
    cc_engine: {
        type: Number,
        required: true
    },
    rc_document: {
        type: String,
        required: true
    },
    insurance_document: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    availability_status: {
        type: String,
        enum: ['available', 'booked', 'maintenance'],
        default: 'available'
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    total_distance_travelled: {
        type: Number,
        default: 0
    },
    total_hours_booked: {
        type: Number,
        default: 0
    },
    total_bookings: {
        type: Number,
        default: 0
    },
    is_featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);