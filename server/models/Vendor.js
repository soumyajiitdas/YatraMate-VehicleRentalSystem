const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    vendor_name: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    total_earnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
