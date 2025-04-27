const mongoose = require("mongoose");
const { Users } = require("../models/User.js");
const { hashPassword } = require('./passwordUtils.js');
require("dotenv").config();

const createAdminUser = async () => {
    const adminExists = await Users.findOne({ username: "admin" });
    if (adminExists) {
        console.log("admin already exists!");
        return;
    }
    const user1Exists = await Users.findOne({ username: "user1" });
    if (user1Exists) {
        console.log("user1 already exists!");
        return;
    }

    const adminUser = new Users({
        username: "admin",
        email: "admin@example.com",
        password: await hashPassword("@Admin123"),
        isAdmin: true,
    });
    const normalUser = new Users({
        username: "user1",
        email: "user1@example.com",
        password: await hashPassword("@User123"),
    });

    await adminUser.save();
    await normalUser.save();
    console.log("Admin and user created!");
};

const clearCollections = async () => {
    try {
        // Get all collections in the database
        const collections = await mongoose.connection.db.collections();

        // Iterate through each collection and delete its data
        for (let collection of collections) {
            // Skip the collections you want to keep (if any)
            if (collection.collectionName === 'system.indexes') {
                continue;
            }

            console.log(`Clearing data from collection: ${collection.collectionName}`);
            await collection.deleteMany({});
        }

        console.log("All collection data cleared, collections preserved.");
    } catch (err) {
        console.error("Error clearing collections: ", err);
    }
};

module.exports = {
    createAdminUser,
    clearCollections,
}