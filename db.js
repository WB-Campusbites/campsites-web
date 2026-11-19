
require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);

let database;

async function connectDB() {
    await client.connect();

    database = client.db("campusbites");

    await database.command({ ping: 1 });

    console.log("CampusBites Database Connected!");
}

function getDB() {
    if (!database) {
        throw new Error("Database is not connected");
    }

    return database;
}

module.exports = { connectDB, getDB };
