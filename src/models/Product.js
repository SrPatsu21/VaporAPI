const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
    {
        _id: {
            type: "objectId",
            auto: true,
            // unique: true, // no need, MongoDB automatically ensures that
            description: "must be an ObjectId and is required",
        },
        titel: {
            type: "string",
            required: true,
            trim: true,
            description: "must be a string and is required",
        },
        img_id: {
            type: "string",
            required: true,
            default: "0",
            trim: true,
            description: "must be a string and is required",
        },
        category: {
            type: "string",
            required: true,
            trim: true,
            description: "must be a string and is required",
        },
        version:
        {
            type: "string",
            trim: true,
            description: "must be a string and is required",
        },
        tags:
        {
            type: [String], // Array of strings
            default: [], // Optional; defaults to an empty array if not provided
        },
        timesDownloaded:
        {
            type: Number,
            default: 0,
            min: 0, // Enforces non-negative values
            description: "Tracks how many times the product has been downloaded",
        },
        active: {
            type: Boolean,
            default: true, // Default is active user
            description: "Indicates if the user account is active",
        }
    },
    {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
)

const Products = mongoose.model('Products', productSchema);

// Export the model
module.exports = {
    Products: Products,

};