// Outlet model schema
const mongoose = require("mongoose");

const outletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Outlet name is required."],
            unique: true,
            trim: true,
            minlength: [2, "Outlet name must be at least 2 characters."],
            maxlength: [80, "Outlet name cannot exceed 80 characters."]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        cuisine: {
            type: String,
            required: [true, "Cuisine is required."],
            trim: true
        },
        image: {
            type: String,
            trim: true,
            default: ""
        },
        rating: {
            type: Number,
            default: 4.0,
            min: [0, "Rating cannot be less than 0."],
            max: [5, "Rating cannot exceed 5.0."]
        },
        availability: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

outletSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Outlet = mongoose.model("Outlet", outletSchema);

module.exports = Outlet;
