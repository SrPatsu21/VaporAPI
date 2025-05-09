const mongoose = require('mongoose');
const { Schema } = mongoose;

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
            trim: true,
            description: "must be a string",
        },
        imageURL: {
            type: "string",
            trim: true,
            maxlength: 512,
            description: "must be a string",
        },
        magnetLink:{
            type: String,
            required: true,
            trim: true,
            description: "must be a string and a magnect link"
        },
        othersUrl:[{
            type: String,
            trim: true,
            maxlength: 512,
            description: "A list of related URLs for the product"
        }],
        title:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Titles',
            required: true,
            description: "must be a ObjectId and is required"
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tags',
            description: "must be a ObjectId"
        }],
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            description: "must be a ObjectId and is required"
        },
        version:{
            type: "string",
            required: true,
            trim: true,
            maxlength: 40,
            description: "must be a string and is required",
        },
        deleted: {
            type: Boolean,
            default: false,
            description: "Indicates if the product is deleted",
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