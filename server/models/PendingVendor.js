const mongoose = require('mongoose');

const pendingVendorSchema = new mongoose.Schema({
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
        enum: ['pan', 'license', 'passport', 'adhaar', 'business_reg_certificate', 'business_tax_id']
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
        required: [true, 'Password is required']
    },
    email_otp: {
        type: String,
        required: true,
    },
    email_otp_expires: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

// Auto-delete expired pending registrations after 15 minutes
pendingVendorSchema.index({ email_otp_expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PendingVendor', pendingVendorSchema);
