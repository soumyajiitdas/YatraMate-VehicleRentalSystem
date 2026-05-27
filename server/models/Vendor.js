const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    is_organization: {
        type: Boolean,
        default: false
    },
    company_name: {
        type: String,
        trim: true
    },
    contact_number: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    id_type: {
        type: String,
        required: [true, 'ID type is required'],
        enum: ['pan_card', 'driving_license', 'passport', 'adhaar_card', 'business_reg_certificate', 'business_tax_id']
    },
    document_url: {
        type: String,
        required: [true, 'Document upload is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    password_hash: {
        type: String,
        required: [function() { return this.authProvider !== 'google'; }, 'Password is required']
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'both'],
        default: 'local'
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    email_otp: {
        type: String,
        select: false
    },
    email_otp_expires: {
        type: Date,
        select: false
    },
    password_change_otp: {
        type: String,
        select: false
    },
    password_change_otp_expires: {
        type: Date,
        select: false
    },
    total_earnings: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'vendor'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);