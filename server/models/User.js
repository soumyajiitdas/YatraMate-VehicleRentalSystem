const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

        profile_image: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin", "vendor", "office_staff"],
            default: "user",
        },

        date_joined: {
            type: Date,
            default: Date.now,
        },

        is_active: {
            type: Boolean,
            default: true,
        },

        is_verified: {
            type: Boolean,
            default: false,
        },

        email_otp: {
            type: String,
            select: false,
        },

        email_otp_expires: {
            type: Date,
            select: false,
        },

        password_reset_token: {
            type: String,
            select: false,
        },

        password_reset_expires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// virtual ID field to align with the naming user_id
userSchema.virtual("user_id").get(function () {
    return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
