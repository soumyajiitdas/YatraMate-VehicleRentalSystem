const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cc_range_min: {
        type: Number,
        required: true
    },
    cc_range_max: {
        type: Number,
        required: true
    },
    price_per_hour: {
        type: Number,
        required: true
    },
    price_per_km: {
        type: Number,
        required: true
    },
    vehicle_type: {
        type: String,
        enum: ['car', 'bike'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for efficient querying
packageSchema.index({ cc_range_min: 1, cc_range_max: 1, vehicle_type: 1 });

module.exports = mongoose.model('Package', packageSchema);
