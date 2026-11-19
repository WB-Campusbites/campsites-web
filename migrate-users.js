
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

async function migrateUsers() {
    const filePath = path.join(__dirname, "data", "users.json");

    if (!fs.existsSync(filePath)) {
        console.log("users.json file not found!");
        return;
    }

    const users = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    if (!Array.isArray(users)) {
        throw new Error("Invalid users.json format");
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        const db = client.db("campusbites");
        const collection = db.collection("users");

        await collection.createIndex(
            { email: 1 },
            { unique: true }
        );

        let added = 0;

        for (const user of users) {
            if (!user.email || !user.passwordHash) {
                continue;
            }

            const email = user.email.trim().toLowerCase();

            const result = await collection.updateOne(
                { email: email },
                {
                    $setOnInsert: {
                        ...user,
                        email: email
                    }
                },
                { upsert: true }
            );

            added += result.upsertedCount;
        }

        console.log("Users migrated successfully!");
        console.log("New users copied:", added);

    } finally {
        await client.close();
    }
}

migrateUsers().catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
});
