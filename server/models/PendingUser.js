const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },

        password_hash: {
            type: String,
            required: [true, "Password is required"],
        },

        phone: {
            type: String,
            trim: true,
            match: [/^\+?[0-9]{10,15}$/, "Please provide a valid phone number"],
        },

        address: {
            type: String,
            trim: true,
            default: "",
        },

        email_otp: {
            type: String,
            required: true,
        },

        email_otp_expires: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Auto-delete expired pending registrations after 15 minutes
pendingUserSchema.index({ email_otp_expires: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
module.exports = PendingUser;
