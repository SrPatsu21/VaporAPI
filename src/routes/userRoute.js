// TODO add loggin middleware
const express = require('express');
const {createUser, patchUser, updateUser, changePassword, softDeleteUser, deleteUser, getUser, searchUser, getAllUsers, authorizeSelf} = require('../models/User')

const router = express.Router();

//* Create a new user
/*
curl -k -X POST https://localhost/user/ \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndoe",
        "email": "johndoe@example.com"
        "password": "Secure_password1"
        "passwordConfirm": "Secure_password1"
    }'
*/
router.post("/", createUser, async (req, res) => {
    try {
        res.status(201).json(req.createdUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* Get user
/*
curl -k -X GET https://localhost/user/68096a0e8e27d34465771f40 \
    -H "Content-Type: application/json"
*/
router.get("/:id", getUser, async (req, res) => {
    try {
        res.status(201).json(req.foundUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* Update user
//change the id!
/*
curl -k -X PUT https://localhost/user/68096a0e8e27d34465771f40 \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndo",
        "email": "johndo@example.br"
    }'
*/
router.put("/:id", authorizeSelf, updateUser, async (req, res) => {
    try {
        res.status(201).json(req.updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//* patch user
//change the id!
/*
curl -k -X PATCH https://localhost/user/68096a0e8e27d34465771f40 \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndo",
        "email": "johndo@example.com"
    }'
*/
router.patch("/:id", authorizeSelf, patchUser, async (req, res) => {
    try {
        res.status(201).json(req.patchedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* change password
//change the id!
/*
curl -k -X PATCH https://localhost/user/changepassword/68096a0e8e27d34465771f40 \
    -H "Content-Type: application/json" \
    -d '{
        "oldPassword": "Secure_password1",
        "newPassword": "Secure_password2",
        "newPasswordConfirm": "Secure_password2"
    }'
*/
router.patch("/changepassword/:id", authorizeSelf, changePassword, async (req, res) => {
    try {
        res.status(201).json("Password changed");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* soft delete user
//change the id!
/*
curl -k -X DELETE https://localhost/user/68096a0e8e27d34465771f40 \
    -H "Content-Type: application/json"
*/
router.delete("/:id", authorizeSelf, softDeleteUser, async (req, res) => {
    try {
        res.status(201).json("User deactivated: " + req.softDeletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;