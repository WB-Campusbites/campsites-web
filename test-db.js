
require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

async function connectDB() {
    if (!uri) {
        console.log("MONGODB_URI missing in .env");
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await client.db("campusbites").command({ ping: 1 });

        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.log("Connection Failed:", error.message);
    } finally {
        await client.close();
    }
}

connectDB();
