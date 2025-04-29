const mongoose = require('mongoose');
const { Schema } = mongoose;

const MAX_SIZE_MB = 2; // 2MB max file size
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const ALLOWED_FORMATS = ['jpeg', 'jpg', 'png']; // Allowed formats

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
    },
    { collection: "Titles", timestamps: true },
);

titleSchema.index({ _id: "hashed" });

const Titles = mongoose.model('Titles', titleSchema);

// Export the model
module.exports = {
    Titles: Titles,
};