// TODO add loggin middleware
const express = require('express');
const {authenticate, isAdmin} = require('./authController.js')
const {createUser, patchUser, updateUser, changePassword, softDeleteUser, restoreUser, deleteUser, getUser, searchUser, authorizeSelf} = require('../../middleware/v1/User.js')

const router = express.Router();

//* Create a new user
/*
curl -k -X POST https://localhost/user/ \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndoe",
        "email": "johndoe@example.com",
        "password": "Secure_password1",
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
curl -k -X GET https://localhost/user/USER_ID \
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
//change the id and token!
/*
curl -k -X PUT https://localhost/user/USER_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer TOKEN_HERE" \
    -d '{
        "username": "johndo",
        "email": "johndo@example.br"
    }'
*/
router.put("/:id", authenticate, authorizeSelf, updateUser, async (req, res) => {
    try {
        res.status(201).json(req.updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//* patch user
//change the id and TOKEN!
/*
curl -k -X PATCH https://localhost/user/USER_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer TOKEN_HERE" \
    -d '{
        "username": "johndo",
        "email": "johndo@example.com"
    }'
*/
router.patch("/:id", authenticate, authorizeSelf, patchUser, async (req, res) => {
    try {
        res.status(201).json(req.patchedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* change password
//change the id and TOKEN!
/*
curl -k -X PATCH https://localhost/user/changepassword/USER_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer TOKEN_HERE" \
    -d '{
        "oldPassword": "Secure_password1",
        "newPassword": "Secure_password2",
        "newPasswordConfirm": "Secure_password2"
    }'
*/
router.patch("/changepassword/:id", authenticate, authorizeSelf, changePassword, async (req, res) => {
    try {
        res.status(201).json("Password changed");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* soft delete user
//change the id and TOKEN!
/*
curl -k -X DELETE https://localhost/user/USER_ID \
    -H "Authorization: Bearer TOKEN_HERE" \
    -H "Content-Type: application/json"
*/
router.delete("/:id", authenticate, authorizeSelf, softDeleteUser, async (req, res) => {
    try {
        res.status(201).json("User deactivated: " + req.softDeletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//? ADMIN ONLY?
//? how use?
//change the id and TOKEN!
/*
curl -k -X PATCH https://localhost/user/USER_ID \
    -H "Authorization: Bearer TOKEN_HERE" \
    -H "Content-Type: application/json"
*/
router.patch("/restoreuser/:id", authenticate, isAdmin, restoreUser, async (req, res) => {
    try {
        res.status(201).json("User activated: " + req.restoreUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;