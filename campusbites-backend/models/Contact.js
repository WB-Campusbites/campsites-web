// Contact model schema for customer inquiries and feedback
const mongoose = require("mongoose");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const contactSchema = new mongoose.Schema(
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
            trim: true,
            lowercase: true,
            match: [EMAIL_REGEX, "Please enter a valid email address."]
        },
        subject: {
            type: String,
            required: [true, "Subject is required."],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Message is required."],
            trim: true,
            minlength: [10, "Message must be at least 10 characters."],
            maxlength: [500, "Message cannot exceed 500 characters."]
        },
        status: {
            type: String,
            enum: ["New", "In Progress", "Resolved"],
            default: "New"
        }
    },
    {
        timestamps: true
    }
);

contactSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
