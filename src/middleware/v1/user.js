const { Users } = require('../../models/User.js')
const { hashPassword, comparePasswords, isSafePassword } = require('../../utils/passwordUtils.js');

const authorizeSelf = (req, res, next) => {
    const userId = req.user?.userId; // ID from authenticated user
    const targetId = req.params.id; // ID from route param

    if (!userId) return res.status(401).json({ message: "Unauthorized: no user info found" });

    if (userId !== targetId) return res.status(403).json({ message: "Forbidden: you can only access your own data" });

    next();
};

// TODO block ban email
// TODO avoid nosql injection
/*
{
    "username": "johndoe",
    "email": "johndoe@example.com"
    "password": "Secure_password1"
    "passwordConfirm": "Secure_password1"
}
*/
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, passwordConfirm} = req.body;

        if(password != passwordConfirm) return res.status(400).json({ message: 'The new password and confirmation do not match' });

        if(!isSafePassword(password)) return res.status(400).json({ message: 'The new password need: minimum 8 characters; at least one lowercase, uppercase, digit and special char (not allowed:($, .))' });


        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with hashed password
        const user = new Users({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // remove password field
        user.password = undefined;

        req.createdUser = user;
        next();
    } catch (err) {
        next(err);
    }
};


const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Users.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.foundUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

/*
{
    "username": "johndo",
    "email": "johndo@example.com",
}
*/
const updateUser = async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.email) {
            return res.status(400).json({
                error: "Username and email are required."
            });
        }

        const id = req.params.id;
        const updates = {}
        updates.username = req.body.username;
        updates.email = req.body.email;

        const updated = await Users.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "User not found or no data"});

        // remove password field
        updated.password = undefined;

        req.updatedUser = updated;
        next();
    } catch (err) {
        next(err);
    }
};

/*
{
    "username": "johndo",
    "email": "johndo@example.com",
}
*/
const patchUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = {}
        updates.username = req.body.username;
        updates.email = req.body.email;

        const patched = await Users.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!patched) return res.status(404).json({ message: "User not found or no data"});

        // remove password field
        patched.password = undefined;

        req.patchedUser = patched;
        next();
    } catch (err) {
        next(err);
    }
};

/*
{
    "oldPassword": "Secure_password1",
    "newPassword": "Secure_password2",
    "newPasswordConfirm": "Secure_password2"
}
*/
const changePassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword, newPasswordConfirm } = req.body;

        if(newPassword != newPasswordConfirm) return res.status(400).json({ message: 'The new password and confirmation do not match' });

        if(!isSafePassword(newPassword)) return res.status(400).json({ message: 'The new password need: minimum 8 characters; at least one lowercase, uppercase, digit and special char (not allowed:($, .))' });

        const user = await Users.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await comparePasswords(oldPassword, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect old password" });

        user.password = await hashPassword(newPassword);
        await user.save();

        next();
    } catch (err) {
        next(err);
    }
};

const softDeleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await Users.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        // remove password field
        user.password = undefined;

        req.softDeletedUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

//? ADMIN ONLY?
//? how use?
const restoreUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await Users.findByIdAndUpdate(id, { deleted: false }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        // remove password field
        user.password = undefined;

        req.restoreUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
/*
{
    "username": "johndo",
    "email": "johndo@example.com",
    "isAdmin": false,
    "deleted": false,
    "limit": 1,
    "skip": 1
}
*/
const searchUser = async (req, res, next) => {
    try {
        const { email, username, isAdmin, deleted, limit, skip} = req.query;
        const query = { deleted: false };
        if (email) query.email = email;
        if (username) query.username = username;
        if (isAdmin) query.isAdmin = isAdmin;
        if (deleted) query.deleted = deleted;
        let limited = 1000;
        if(limit){
            if (limit > 1000) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const users = await Users.find(query).select("-password").limit(limited).skip(skiped);
        req.foundUsers = users;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
// TODO resolve dependencies
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleted = await Users.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "User not found" });

        // remove password field
        deleted.password = undefined;

        req.deletedUser = deleted;
        next();
    } catch (err) {
        next(err);
    }
};

//* Export the model
module.exports = {
    createUser,
    updateUser,
    patchUser,
    changePassword,
    softDeleteUser,
    restoreUser,
    deleteUser,
    getUser,
    searchUser,
    authorizeSelf,
}