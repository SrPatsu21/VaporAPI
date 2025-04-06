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
            unique: true
        },
        password: {
            type: String,
            required: true,
            description: "must be a string, at least 8 characters, and is required",
        },
        email: {
            type: "string",
            required: true,
            unique: true,
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
    { collection: "Users" },
    { timestamps: true },
);

// Use `userId` as the shard key for even distribution
userSchema.index({ userId: "hashed" });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Users = mongoose.model("Users", userSchema);

// Export the model
module.exports = {
    Users: Users,
}