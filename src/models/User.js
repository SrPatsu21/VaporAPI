const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, auto: true }, // Shard key
        name: { type: String, required: true },
        email: { type: String, required: true}, // Ensure email uniqueness
    },
    { collection: "Users" },
    { timestamps: true },
);
// Use `userId` as the shard key for even distribution
userSchema.index({ userId: "hashed" });

const Users = mongoose.model("Users", userSchema);

// Create a new user
const createUser = async (req, res, next) => {
    try {
        const newUser = new Users(req.body);
        await newUser.save();
        req.newUser = newUser;
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