const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        _id: {
            type: "objectId",
            auto: true,
            // unique: true, // no need, MongoDB automatically ensures that
            description: "must be an ObjectId and is required",
        },
        str: {
            type: "string",
            required: true,
            trim: true,
            description: "must be a string and is required",
        },
    }
);

const Categories = mongoose.model('Categories', categorySchema);

// Export the model
module.exports = {
    Categories: Categories,
};




const versionSchema = new Schema(
    {
        _id: {
            type: "objectId",
            auto: true,
            // unique: true, // no need, MongoDB automatically ensures that
            description: "must be an ObjectId and is required",
        },
        str: {
            type: "string",
            required: true,
            trim: true,
            maxlength: 40,
            description: "must be a string and is required",
        },
    }
);