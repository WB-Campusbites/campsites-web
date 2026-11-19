// Food routes
const express = require("express");
const router = express.Router();
const {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
} = require("../controllers/foodController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public reading, Admin-protected modification
router.route("/")
    .get(getFoods)
    .post(protect, admin, createFood);

router.route("/:id")
    .get(getFoodById)
    .put(protect, admin, updateFood)
    .delete(protect, admin, deleteFood);

module.exports = router;
