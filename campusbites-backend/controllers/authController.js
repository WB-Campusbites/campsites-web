// Authentication controller: signup, login, and current user profile
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

// Helper to generate signed JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "default_jwt_secret_key",
        { expiresIn: "7d" }
    );
};

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        const errors = {};

        const cleanName = typeof name === "string" ? name.trim() : "";
        const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const cleanPhone = typeof phone === "string" ? phone.trim() : "";
        const cleanPassword = typeof password === "string" ? password : "";

        if (cleanName.length < 2 || cleanName.length > 50) {
            errors.name = "Name must be 2-50 characters.";
        }
        if (!EMAIL_RE.test(cleanEmail)) {
            errors.email = "Enter a valid email address.";
        }
        if (!PHONE_RE.test(cleanPhone)) {
            errors.phone = "Enter a valid 10-digit mobile number starting with 6-9.";
        }
        if (cleanPassword.length < 8 || !/[A-Za-z]/.test(cleanPassword) || !/\d/.test(cleanPassword)) {
            errors.password = "Password needs 8+ characters with at least one letter and one number.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors, message: "Validation error" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(409).json({
                errors: { email: "This email is already registered." },
                message: "Email conflict"
            });
        }

        // Hash password securely with bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(cleanPassword, salt);

        // Security rule: public signup always creates role 'customer', never 'admin'
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            passwordHash,
            role: "customer"
        });

        const token = generateToken(user._id, user.role);

        return res.status(201).json({
            message: "Account created.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & return token
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = {};

        const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const cleanPassword = typeof password === "string" ? password : "";

        if (!EMAIL_RE.test(cleanEmail)) {
            errors.email = "Enter a valid email address.";
        }
        if (!cleanPassword) {
            errors.password = "Enter your password.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors, message: "Validation error" });
        }

        const user = await User.findOne({ email: cleanEmail });
        if (!user || !(await user.comparePassword(cleanPassword))) {
            return res.status(401).json({
                errors: { password: "Incorrect email or password." },
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            message: "Logged in.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, getCurrentUser };
