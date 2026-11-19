// Order model schema supporting both Personal and Group orders
const mongoose = require("mongoose");

const PHONE_REGEX = /^[6-9]\d{9}$/;

const orderItemSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            default: null
        },
        item: {
            type: String,
            required: [true, "Item name is required."],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required."],
            min: [1, "Quantity must be at least 1."],
            max: [50, "Quantity cannot exceed 50."],
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be a whole number."
            }
        },
        price: {
            type: Number,
            required: [true, "Item unit price is required."],
            min: [0, "Price cannot be negative."],
            max: [10000, "Price cannot exceed ₹10,000."]
        },
        isCustom: {
            type: Boolean,
            default: false
        },
        member: {
            type: String,
            trim: true,
            default: null
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: [true, "Order ID is required."],
            unique: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        mode: {
            type: String,
            enum: ["separate", "group"],
            required: true,
            default: "separate"
        },
        groupCode: {
            type: String,
            trim: true,
            default: null
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required."],
            trim: true,
            minlength: [2, "Customer name must be at least 2 characters."],
            maxlength: [50, "Customer name cannot exceed 50 characters."]
        },
        phone: {
            type: String,
            required: [true, "Mobile number is required."],
            trim: true,
            match: [PHONE_REGEX, "Enter a valid 10-digit mobile number starting with 6-9."]
        },
        hostel: {
            type: String,
            required: [true, "Hostel/Room/Delivery location is required."],
            trim: true,
            minlength: [2, "Location must be at least 2 characters."],
            maxlength: [80, "Location cannot exceed 80 characters."]
        },
        paymentMode: {
            type: String,
            enum: ["cash", "upi", "card"],
            required: [true, "Payment mode is required."]
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [200, "Notes cannot exceed 200 characters."],
            default: ""
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return Array.isArray(items) && items.length > 0;
                },
                message: "Order must contain at least one item."
            }
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        delivery: {
            type: Number,
            required: true,
            default: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["Placed", "Preparing", "Ready", "Completed", "Cancelled"],
            default: "Placed"
        }
    },
    {
        timestamps: true
    }
);

orderSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
