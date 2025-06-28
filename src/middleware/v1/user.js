const { Users } = require('../../models/User.js')
const { hashPassword, comparePasswords, isSafePassword } = require('../../utils/passwordUtils.js');

const authorizeSelf = (req, res, next) => {
    const userId = req.user?.userId; // ID from authenticated user
    const targetId = req.params.id; // ID from route param

    if (!userId) return res.status(401).json({ message: "Unauthorized: no user info found" });

    if (userId !== targetId) return res.status(403).json({ message: "Forbidden: you can only access your own data" });

    next();
};


const getSelfUser = async (req, res, next) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user info found" });
        }

        const user = await Users.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.selfUser = user;
        next();
    } catch (err) {
        next(err);
    }
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

        const exist = await Users.findOne({ username });

        if (exist) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        if(password != passwordConfirm) return res.status(400).json({ message: 'The new password and confirmation do not match' });

        if(!isSafePassword(password)) return res.status(400).json({ message: 'The new password need: minimum 8 characters; at least one lowercase, uppercase, digit and special char (not allowed:($, .))' });

        // Validate email format
        const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailValidator.test(email)) {
            return res.status(400).json({ message: `Email (${email}) is not a valid email!` });
        }

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
        const id = req.params.id;
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
        const { username, email} = req.body;
        if (!username || !email) {
            return res.status(400).json({
                error: "Username and email are required."
            });
        }

        const exist = await Users.findOne({ username });

        if (exist && exist._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailValidator.test(email)) {
            return res.status(400).json({ message: `${email} is not a valid email!` });
        }

        const id = req.params.id;
        const updates = {}
        updates.username = username;
        updates.email = email;

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

        if(updates.username){
            const exist = await Users.findOne({ username });

            if (exist && exist._id.toString() !== req.user._id.toString()) {
                return res.status(400).json({ error: 'User with this username already exists' });
            }
        }

        if (updates.email){
            const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailValidator.test(updates.email)) {
                return res.status(400).json({ message: `${updates.email} is not a valid email!` });
            }
        }


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
        if (email) query.email = { $regex: email, $options: 'i' };
        if (username) query.username = { $regex: username, $options: 'i' };
        if (isAdmin) query.isAdmin = isAdmin;
        if (deleted) query.deleted = deleted;

        let limited = 100;
        if(limit){
            if (limit < 100) limited = limit;
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

const adminControler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const isAdmin = req.body.isAdmin;
        if (typeof isAdmin !== 'boolean') return res.status(400).json({ message: `isAdmin (${isAdmin}) must be a boolean` });
        const user = await Users.findByIdAndUpdate(id, { isAdmin: isAdmin }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        // remove password field
        user.password = undefined;

        req.patched = user;
        next();
    } catch (err) {
        next(err);
    }
};

//* Export the model
module.exports = {
    getSelfUser,
    createUser,
    updateUser,
    patchUser,
    changePassword,
    softDeleteUser,
    restoreUser,
    getUser,
    searchUser,
    authorizeSelf,
    adminControler,
}