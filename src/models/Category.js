const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required",
        },
        categorySTR: {
            type: "string",
            required: true,
            trim: true,
            maxlength: 256,
            description: "must be a string and is required",
        },
        deleted: {
            type: Boolean,
            default: false, // Default is non-deleted user
            description: "Indicates if the user was deactivat",
        },
    },
    {collection: "Categories", timestamps: true}
);

categorySchema.index({ _id: "hashed" });

const Categories = mongoose.model('Categories', categorySchema);

// Export the model
module.exports = {
    Categories: Categories,
};