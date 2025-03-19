const mongoose = require('mongoose');
require("dotenv").config();

// Function to connect to MongoDB (connect to Mongos Router)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

// Export the connectDB function
module.exports = connectDB;