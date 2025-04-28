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
            unique: true,
            maxlength: 256,
            description: "must be a string and is required",
        },
    },
    {collection: "Categories", timestamps: true}
);

const Categories = mongoose.model('Categories', categorySchema);

// Export the model
module.exports = {
    Categories: Categories,
};