// Authentication and Authorization middleware using JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect private routes - requires a valid JWT Bearer token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Authentication required. Please provide a valid token in Authorization header."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
        const user = await User.findById(decoded.id).select("-passwordHash");

        if (!user) {
            return res.status(401).json({
                message: "User associated with this token no longer exists."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
};

// Authorize admin-only access
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Access forbidden. Administrator role required for this action."
        });
    }
};

// Optional authentication - populates req.user if token is present, otherwise continues as guest
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");
        const user = await User.findById(decoded.id).select("-passwordHash");
        req.user = user || null;
    } catch (error) {
        req.user = null;
    }

    next();
};

module.exports = { protect, admin, optionalAuth };
