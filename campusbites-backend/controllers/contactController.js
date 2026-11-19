// Contact controller: Customer inquiries and feedback CRUD operations
const Contact = require("../models/Contact");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value) {
    return typeof value === "string" ? value.trim() : "";
}

// @desc    Submit a contact/feedback message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
    try {
        const name = clean(req.body.name);
        const email = clean(req.body.email).toLowerCase();
        const subject = clean(req.body.subject);
        const message = clean(req.body.message);
        const errors = {};

        if (name.length < 2 || name.length > 50) {
            errors.name = "Name must be 2-50 characters.";
        }
        if (!EMAIL_RE.test(email)) {
            errors.email = "Enter a valid email address.";
        }
        if (!subject) {
            errors.subject = "Please choose a subject.";
        }
        if (message.length < 10 || message.length > 500) {
            errors.message = "Message must be 10-500 characters.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors, message: "Validation failed." });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        return res.status(201).json({
            message: "Thanks! We received your message.",
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        return res.status(200).json({
            count: contacts.length,
            contacts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single contact message by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }
        return res.status(200).json({ contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateContact = async (req, res, next) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        if (status) {
            const allowed = ["New", "In Progress", "Resolved"];
            if (!allowed.includes(status)) {
                return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });
            }
            contact.status = status;
        }

        const updatedContact = await contact.save();
        return res.status(200).json({
            message: "Contact message updated successfully.",
            contact: updatedContact
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        await contact.deleteOne();
        return res.status(200).json({
            message: "Contact message deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};
