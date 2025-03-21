const express = require('express');
const {createUser, getAllUsers} = require('../models/User')

const router = express.Router();

// Create a new user
/*
curl -k -X POST https://localhost/user/ \
    -H "Content-Type: application/json" \
    -d '{
        "name": "John Doe",
        "email": "johndoe@example.com",
        "password": "securepassword"
        }'
*/
router.post("/", createUser, async (req, res) => {
    try {
        res.status(201).json(req.newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
router.get("/all", getAllUsers, async (req, res) => {
    try {
        res.json(req.users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;