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
        name: {
            type: "string",
            required: true,
            trim: true,
            description: "must be a string and is required",
        },
        description: {
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
        timesDownloaded:
        {
            type: Number,
            default: 0,
            min: 0, // Enforces non-negative values
            description: "Tracks how many times the product has been downloaded",
        },
        category:{
            type: mongoose.Schema.Types.ObjectId, ref: 'titels'
        },
        version:{
            type: mongoose.Schema.Types.ObjectId, ref: 'versions'
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