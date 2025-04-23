const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Types } = require('mongoose');
const { ObjectId } = require('mongoose');
const { hashPassword } = require('../utils/passwordUtils');

const userSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required"
        },
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            description: "must be a string, at least 8 characters, and is required",
        },
        email: {
            type: "string",
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
            description: "must be a valid email and is required",
        },
        isAdmin: {
            type: Boolean,
            default: false, // Default is non-admin user
            description: "Indicates if the user is an admin",
        },
    },
    { timestamps: true },
    { collection: "Users" },
);

const Users = mongoose.model("Users", userSchema);

//* functions

const authorizeSelf = (req, res, next) => {
    const userId = req.user?.id; // ID from authenticated user
    const targetId = req.params.id; // ID from route param

    // if (!userId) {
    //     return res.status(401).json({ message: "Unauthorized: no user info found" });
    // }

    // if (userId !== targetId) {
    //     return res.status(403).json({ message: "Forbidden: you can only access your own data" });
    // }

    next();
};

/*
{
    "username": "johndoe",
    "email": "johndoe@example.com"
    "password": "securepassword"
}
*/
const createUser = async (req, res, next) => {
    try {
        const { username, email, password} = req.body;

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with hashed password
        const user = new Users({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        req.createdUser = user;
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
        const id = req.params.id;
        const updates = {}
        updates.username = req.body.username;
        updates.email = req.body.email;

        const test1 = new mongoose.Types.ObjectId('6807c6dc0fe1622d9a0581fe')
        const test2 = new Types.ObjectId("6807c6dc0fe1622d9a0581fe")
        // const test3 = new ObjectId("6807c6dc0fe1622d9a0581fe")

        console.log( test2 )
        console.log( await Users.findOne({ _id: test2 }))
        const updated = await Users.findOneAndUpdate(
            { _id: test2 },
            updates,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "User not found or no data"});

        req.updatedUser = updated;
        next();
    } catch (err) {
        next(err);
    }
};

const patchUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Users.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        Object.assign(user, req.body);
        await user.save();

        req.patchedUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await Users.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect old password" });

        user.password = newPassword;
        await user.save();

        req.passwordChanged = true;
        next();
    } catch (err) {
        next(err);
    }
};

const softDeleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Users.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        req.softDeletedUser = user;
        next();
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Users.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "User not found" });

        req.deletedUser = deleted;
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

const searchUser = async (req, res, next) => {
    try {
        const { email, username } = req.query;
        const query = { deletedAt: null };
        if (email) query.email = email;
        if (username) query.username = username;

        const users = await Users.find(query).select("-password");
        req.foundUsers = users;
        next();
    } catch (err) {
        next(err);
    }
};

//won't use
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find({}, "-password"); // Exclude password from results
        req.users = users; // Attach to request for later use
        next();
    } catch (err) {
        next(err); // Pass to error-handling middleware
    }
};

//* Export the model
module.exports = {
    Users: Users,
    createUser,
    updateUser,
    patchUser,
    changePassword,
    softDeleteUser,
    deleteUser,
    getUser,
    searchUser,
    getAllUsers,
    authorizeSelf,
}