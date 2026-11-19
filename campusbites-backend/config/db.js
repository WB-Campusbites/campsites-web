// Database connection module using Mongoose
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI environment variable is not defined in .env");
        }

        const conn = await mongoose.connect(uri);

        // Safely log host without exposing credentials or full connection string
        console.log(`[Database] MongoDB Atlas connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
        // Exit process with failure so server does not falsely report healthy startup
        process.exit(1);
    }
};

module.exports = connectDB;
