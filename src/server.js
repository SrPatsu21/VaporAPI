const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// MongoDB Connection String (connect to Mongos Router)
const mongoURI = process.env.MONGO_URI || "";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB sharded cluster"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
    userId: Number,  // Must be used as shard key!
    name: String,
    email: String,
});

const User = mongoose.model("User", UserSchema);

// Create a new user
app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
