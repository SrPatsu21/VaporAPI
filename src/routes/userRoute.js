const express = require('express');
const {createUser, getAllUsers} = require('../models/User')

const router = express.Router();

// Create a new user
router.post("/", createUser, async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get("/all", getAllUsers, async (req, res) => {
    try {
        res.json(req.usera);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;