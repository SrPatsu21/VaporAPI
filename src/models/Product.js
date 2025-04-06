const mongoose = require('mongoose');
const { Schema } = mongoose;

const MAX_SIZE_MB = 2; // 2MB max file size
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const ALLOWED_FORMATS = ['jpeg', 'jpg', 'png']; // Allowed formats

const productSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
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
        timesDownloaded:
        {
            type: Number,
            default: 0,
            min: 0, // Enforces non-negative values
            description: "Tracks how many times the product has been downloaded",
        },
        title:{
            type: mongoose.Schema.Types.ObjectId, ref: 'Titles'
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        version:{
            type: "string",
            required: true,
            trim: true,
            maxlength: 40,
            description: "must be a string and is required",
        },
        active: {
            type: Boolean,
            default: true, // Default is active user
            description: "Indicates if the user account is active",
        }
    },
    {collection: "Products", timestamps: true}
)
productSchema.index({ _id: "hashed" });

const Products = mongoose.model('Products', productSchema);

// Export the model
module.exports = {
    Products: Products,

};