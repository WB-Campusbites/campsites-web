// Order routes
const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");
const { protect, admin, optionalAuth } = require("../middleware/authMiddleware");

// Place order (supports guest and authenticated users)
router.post("/", optionalAuth, createOrder);

// List orders (requires authentication: customer sees theirs, admin sees all)
router.get("/", protect, getOrders);

// Read single order
router.get("/:id", optionalAuth, getOrderById);

// Update order (admin can update status, customer can cancel their own order)
router.put("/:id", protect, updateOrder);

// Delete order (admin only)
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
