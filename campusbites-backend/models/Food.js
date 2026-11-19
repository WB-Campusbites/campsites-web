// Food model schema referencing Outlet
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Food item name is required."],
            trim: true,
            minlength: [2, "Item name must be at least 2 characters."],
            maxlength: [100, "Item name cannot exceed 100 characters."]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        price: {
            type: Number,
            required: [true, "Price is required."],
            min: [0, "Price cannot be negative."],
            max: [10000, "Price cannot exceed ₹10,000."]
        },
        category: {
            type: String,
            required: [true, "Category is required."],
            trim: true
        },
        outlet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Outlet",
            required: [true, "Associated outlet is required."]
        },
        image: {
            type: String,
            trim: true,
            default: ""
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

// Compound index to avoid duplicate items per outlet
foodSchema.index({ name: 1, outlet: 1 }, { unique: true });

foodSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
