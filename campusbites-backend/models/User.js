// User model schema and password hashing methods
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
            minlength: [2, "Name must be at least 2 characters."],
            maxlength: [50, "Name cannot exceed 50 characters."]
        },
        email: {
            type: String,
            required: [true, "Email address is required."],
            unique: true,
            trim: true,
            lowercase: true,
            match: [EMAIL_REGEX, "Please enter a valid email address."]
        },
        phone: {
            type: String,
            required: [true, "Mobile number is required."],
            trim: true,
            match: [PHONE_REGEX, "Enter a valid 10-digit Indian mobile number starting with 6-9."]
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required."]
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        }
    },
    {
        timestamps: true
    }
);

// Method to verify entered password against stored bcrypt hash
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Remove sensitive passwordHash when serialized to JSON
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
