const mongoose = require('mongoose');
const { Schema } = mongoose;

const titleSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required",
        },
        titleSTR: {
            type: "string",
            required: true,
            trim: true,
            maxlength: 256,
            description: "must be a string and is required",
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categories'
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tags'
        }],
        imageURL: {
            type: "string",
            trim: true,
            maxlength: 128,
            description: "must be a string and is required",
        },
        deleted: {
            type: Boolean,
            default: false, // Default is non-deleted user
            description: "Indicates if the user was deactivat",
        },
    },
    { collection: "Titles", timestamps: true },
);

titleSchema.index({ _id: "hashed" });

const Titles = mongoose.model('Titles', titleSchema);

// Export the model
module.exports = {
    Titles: Titles,
};