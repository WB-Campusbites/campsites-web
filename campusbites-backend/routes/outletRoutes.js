// Outlet routes
const express = require("express");
const router = express.Router();
const {
    getOutlets,
    getOutletById,
    createOutlet,
    updateOutlet,
    deleteOutlet
} = require("../controllers/outletController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public reading, Admin-protected modification
router.route("/")
    .get(getOutlets)
    .post(protect, admin, createOutlet);

router.route("/:id")
    .get(getOutletById)
    .put(protect, admin, updateOutlet)
    .delete(protect, admin, deleteOutlet);

module.exports = router;
