// Food controller: CRUD operations for menu items
const Food = require("../models/Food");
const Outlet = require("../models/Outlet");

// @desc    Get all foods (supports filtering by outlet ID/name and category)
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res, next) => {
    try {
        const { outlet, category, search } = req.query;
        const filter = {};

        if (outlet) {
            if (outlet.match(/^[0-9a-fA-F]{24}$/)) {
                filter.outlet = outlet;
            } else {
                const foundOutlet = await Outlet.findOne({ name: new RegExp(`^${outlet}$`, "i") });
                if (foundOutlet) {
                    filter.outlet = foundOutlet._id;
                } else {
                    return res.status(200).json({ count: 0, foods: [] });
                }
            }
        }

        if (category) {
            filter.category = new RegExp(`^${category}$`, "i");
        }

        if (search) {
            filter.name = new RegExp(search, "i");
        }

        const foods = await Food.find(filter)
            .populate("outlet", "name cuisine image rating")
            .sort({ category: 1, name: 1 });

        return res.status(200).json({
            count: foods.length,
            foods
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id).populate("outlet", "name cuisine");
        if (!food) {
            return res.status(404).json({ message: "Food item not found." });
        }
        return res.status(200).json({ food });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = async (req, res, next) => {
    try {
        const { name, description, price, category, outlet, image, availability } = req.body;

        let outletId = outlet;
        if (typeof outlet === "string" && !outlet.match(/^[0-9a-fA-F]{24}$/)) {
            const foundOutlet = await Outlet.findOne({ name: new RegExp(`^${outlet}$`, "i") });
            if (!foundOutlet) {
                return res.status(400).json({ message: `Outlet '${outlet}' not found.` });
            }
            outletId = foundOutlet._id;
        } else {
            const foundOutlet = await Outlet.findById(outletId);
            if (!foundOutlet) {
                return res.status(400).json({ message: "Specified outlet does not exist." });
            }
        }

        const food = await Food.create({
            name,
            description,
            price: Number(price),
            category,
            outlet: outletId,
            image,
            availability: availability !== undefined ? Boolean(availability) : true
        });

        const populatedFood = await Food.findById(food._id).populate("outlet", "name cuisine");

        return res.status(201).json({
            message: "Food item created successfully.",
            food: populatedFood
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = async (req, res, next) => {
    try {
        const { name, description, price, category, outlet, image, availability } = req.body;

        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found." });
        }

        if (name !== undefined) food.name = name;
        if (description !== undefined) food.description = description;
        if (price !== undefined) food.price = Number(price);
        if (category !== undefined) food.category = category;
        if (image !== undefined) food.image = image;
        if (availability !== undefined) food.availability = Boolean(availability);

        if (outlet) {
            let outletId = outlet;
            if (typeof outlet === "string" && !outlet.match(/^[0-9a-fA-F]{24}$/)) {
                const foundOutlet = await Outlet.findOne({ name: new RegExp(`^${outlet}$`, "i") });
                if (!foundOutlet) {
                    return res.status(400).json({ message: `Outlet '${outlet}' not found.` });
                }
                outletId = foundOutlet._id;
            }
            food.outlet = outletId;
        }

        const updatedFood = await food.save();
        const populatedFood = await Food.findById(updatedFood._id).populate("outlet", "name cuisine");

        return res.status(200).json({
            message: "Food item updated successfully.",
            food: populatedFood
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found." });
        }

        await food.deleteOne();

        return res.status(200).json({
            message: "Food item deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};
