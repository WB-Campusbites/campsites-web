// Contact routes
const express = require("express");
const router = express.Router();
const {
    submitContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public contact submission
router.post("/contact", submitContact);

// Admin-only contact management
router.get("/contacts", protect, admin, getContacts);
router.route("/contacts/:id")
    .get(protect, admin, getContactById)
    .put(protect, admin, updateContact)
    .delete(protect, admin, deleteContact);

module.exports = router;
