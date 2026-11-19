// Database Seeding Script for CampusBites
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Outlet = require("../models/Outlet");
const Food = require("../models/Food");
const User = require("../models/User");

const outletsData = [
    {
        name: "Burger Singh",
        description: "American, Fast Food burgers, fries, and cold beverages",
        cuisine: "American, Fast Food",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        rating: 4.4,
        menu: [
            { name: "Classic Burger", price: 149, category: "Burgers & Combos", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
            { name: "King Burger", price: 199, category: "Burgers & Combos", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
            { name: "Spicy Amritsari Burger", price: 189, category: "Burgers & Combos", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
            { name: "Paneer Burger", price: 169, category: "Burgers & Combos", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
            { name: "Crispy Fries", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80" },
            { name: "Malabar Fries", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80" },
            { name: "Cold Coffee", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" },
            { name: "Saffron Cold Coffee", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    {
        name: "Kathi Junction",
        description: "North Indian rolls, fresh wraps, and snacks",
        cuisine: "North Indian, Rolls",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80",
        rating: 4.2,
        menu: [
            { name: "Paneer Kathi Roll", price: 149, category: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80" },
            { name: "Veg Kathi Roll", price: 119, category: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80" },
            { name: "Aloo Tikki Roll", price: 99, category: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80" },
            { name: "Cold Coffee", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    {
        name: "Maggi Point",
        description: "Campus favorite freshly cooked Maggi noodles & quick bites",
        cuisine: "Maggi, Fast Food",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80",
        rating: 4.0,
        menu: [
            { name: "Classic Maggi", price: 60, category: "Maggi", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80" },
            { name: "Cheese Maggi", price: 90, category: "Maggi", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80" },
            { name: "Peri Peri Maggi", price: 80, category: "Maggi", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80" },
            { name: "Masala Maggi", price: 70, category: "Maggi", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    {
        name: "Greenox",
        description: "Fresh healthy bowls, wraps, salads, and freshly squeezed juices",
        cuisine: "Healthy, Bowls, Smoothies",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
        rating: 4.1,
        menu: [
            { name: "Veg Sandwich", price: 99, category: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" },
            { name: "Paneer Wrap", price: 149, category: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" },
            { name: "Healthy Salad", price: 129, category: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" },
            { name: "Fresh Juice", price: 89, category: "Beverages", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" }
        ]
    }
];

async function seedDatabase() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("[Seed Error] MONGO_URI is missing from .env file.");
            process.exit(1);
        }

        console.log("[Seed] Connecting to MongoDB Atlas...");
        await mongoose.connect(uri);
        console.log("[Seed] Connected successfully.");

        let totalOutlets = 0;
        let totalFoods = 0;

        for (const outletData of outletsData) {
            const { menu, ...outletInfo } = outletData;
            const outlet = await Outlet.findOneAndUpdate(
                { name: outletInfo.name },
                { $set: outletInfo },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            totalOutlets++;

            for (const item of menu) {
                await Food.findOneAndUpdate(
                    { name: item.name, outlet: outlet._id },
                    {
                        $set: {
                            description: item.name + " from " + outlet.name,
                            price: item.price,
                            category: item.category,
                            image: item.image,
                            outlet: outlet._id,
                            availability: true
                        }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                totalFoods++;
            }
        }

        const adminEmail = "admin@campusbites.com";
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash("Admin@123", salt);
            await User.create({
                name: "CampusBites Admin",
                email: adminEmail,
                phone: "9876543210",
                passwordHash,
                role: "admin"
            });
            console.log(`[Seed] Created dev administrator account: ${adminEmail}`);
        } else {
            console.log(`[Seed] Administrator account (${adminEmail}) already exists.`);
        }

        console.log(`[Seed Complete] Successfully seeded ${totalOutlets} Outlets and ${totalFoods} Food items.`);
        await mongoose.disconnect();
        console.log("[Seed] Disconnected.");
        process.exit(0);
    } catch (error) {
        console.error(`[Seed Error] Seeding failed: ${error.message}`);
        process.exit(1);
    }
}

seedDatabase();
