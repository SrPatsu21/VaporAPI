const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
    userId: Number,  // Must be used as shard key!
    name: String,
    email: String,
    }
);

const Users = mongoose.model("Users", userSchema);

// Create a new user
const createUser = async (req, res, next) => {
    try {
        const newUser = new Users(req.body);
        await newUser.save();
        req.user = newUser;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find();
        req.users = users;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Export the model
module.exports = {
    Users: Users,
    getAllUsers: getAllUsers,
    createUser:createUser,
}