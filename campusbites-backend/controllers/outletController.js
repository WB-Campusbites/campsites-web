// Outlet controller: CRUD operations for campus food outlets
const Outlet = require("../models/Outlet");

// @desc    Get all outlets
// @route   GET /api/outlets
// @access  Public
const getOutlets = async (req, res, next) => {
    try {
        const outlets = await Outlet.find().sort({ name: 1 });
        return res.status(200).json({
            count: outlets.length,
            outlets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single outlet by ID
// @route   GET /api/outlets/:id
// @access  Public
const getOutletById = async (req, res, next) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ message: "Outlet not found." });
        }
        return res.status(200).json({ outlet });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new outlet
// @route   POST /api/outlets
// @access  Private/Admin
const createOutlet = async (req, res, next) => {
    try {
        const { name, description, cuisine, image, rating, availability } = req.body;

        const outlet = await Outlet.create({
            name,
            description,
            cuisine,
            image,
            rating: rating !== undefined ? Number(rating) : 4.0,
            availability: availability !== undefined ? Boolean(availability) : true
        });

        return res.status(201).json({
            message: "Outlet created successfully.",
            outlet
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update an outlet
// @route   PUT /api/outlets/:id
// @access  Private/Admin
const updateOutlet = async (req, res, next) => {
    try {
        const { name, description, cuisine, image, rating, availability } = req.body;

        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ message: "Outlet not found." });
        }

        if (name !== undefined) outlet.name = name;
        if (description !== undefined) outlet.description = description;
        if (cuisine !== undefined) outlet.cuisine = cuisine;
        if (image !== undefined) outlet.image = image;
        if (rating !== undefined) outlet.rating = Number(rating);
        if (availability !== undefined) outlet.availability = Boolean(availability);

        const updatedOutlet = await outlet.save();

        return res.status(200).json({
            message: "Outlet updated successfully.",
            outlet: updatedOutlet
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an outlet
// @route   DELETE /api/outlets/:id
// @access  Private/Admin
const deleteOutlet = async (req, res, next) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ message: "Outlet not found." });
        }

        await outlet.deleteOne();

        return res.status(200).json({
            message: "Outlet deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOutlets,
    getOutletById,
    createOutlet,
    updateOutlet,
    deleteOutlet
};
