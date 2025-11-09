const mongoose = require('mongoose');

const vehicleRequestSchema = new mongoose.Schema({
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
        required: true
    },
    engine_number: {
        type: String,
        required: true
    },
    chassis_number: {
        type: String,
        required: true
    },
    cc_engine: {
        type: Number,
        required: true
    },
    location: {
        type: String,
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
    vehicle_images: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    admin_notes: {
        type: String,
        default: ''
    },
    rejection_reason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('VehicleRequest', vehicleRequestSchema);
