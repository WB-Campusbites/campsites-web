// Authentication routes
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoints
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Private endpoint
router.get("/auth/me", protect, getCurrentUser);

module.exports = router;
