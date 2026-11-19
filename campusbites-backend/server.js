// CampusBites Backend Server
// Main entry point for the Express REST API

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const outletRoutes = require("./routes/outletRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Import middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// CORS configuration - allow requests from the frontend origin
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({
    origin: [allowedOrigin, "http://127.0.0.1:3000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/api/health", (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(isDbConnected ? 200 : 503).json({
        status: isDbConnected ? "ok" : "degraded",
        uptime: process.uptime(),
        database: isDbConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Mount API routes
app.use("/api", authRoutes);       // POST /api/signup, POST /api/login, GET /api/auth/me
app.use("/api/outlets", outletRoutes); // GET, POST /api/outlets, GET, PUT, DELETE /api/outlets/:id
app.use("/api/foods", foodRoutes);     // GET, POST /api/foods, GET, PUT, DELETE /api/foods/:id
app.use("/api/orders", orderRoutes);   // POST, GET /api/orders, GET, PUT, DELETE /api/orders/:id
app.use("/api", contactRoutes);    // POST /api/contact, GET, PUT, DELETE /api/contacts

// Central error handling
app.use(notFound);
app.use(errorHandler);

// Start server
let server;
if (process.env.NODE_ENV !== "test") {
    server = app.listen(PORT, () => {
        console.log(`[Server] CampusBites API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
    });
}

module.exports = { app, server };
