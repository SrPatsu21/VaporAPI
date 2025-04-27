const mongoose = require("mongoose");
const { Users } = require("../models/User.js");
const { hashPassword } = require('./passwordUtils.js');
require("dotenv").config();

const createAdminUser = async () => {
    const adminExists = await Users.findOne({ username: "admin" });
    if (adminExists) {
        console.log("Admin user already exists!");
        return;
    }

    const adminUser = new Users({
        username: "admin",
        email: "admin@example.com",
        password: hashPassword("@Dmin123"),
        isAdmin: true,
    });

    await adminUser.save();
    console.log("Admin user created!");
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