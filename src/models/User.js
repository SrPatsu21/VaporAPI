const mongoose = require("mongoose");
const { Schema } = mongoose;

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
        },
        password: {
            type: String,
            required: true,
            description: "must be a string, at least 8 characters, , and is required",
        },
        email: {
            type: "string",
            required: true,
            trim: true,
            description: "must be a valid email and is required",
        },
        deleted: {
            type: Boolean,
            default: false, // Default is non-deleted user
            description: "Indicates if the user was deactivat",
        },
        isAdmin: {
            type: Boolean,
            default: false, // Default is non-admin user
            description: "Indicates if the user is an admin",
        },
    },
    { timestamps: true, collection: "Users" },
);

userSchema.index({ _id: "hashed" });

const Users = mongoose.model("Users", userSchema);

//* Export the model
module.exports = {
    Users,
}