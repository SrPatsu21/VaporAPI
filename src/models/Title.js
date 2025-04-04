const mongoose = require('mongoose');
const { Schema } = mongoose;

const titleSchema = new Schema(
    {
        _id: {
            type: "objectId",
            auto: true,
            // unique: true, // no need, MongoDB automatically ensures that
            description: "must be an ObjectId and is required",
        },
        titleSTR: {
            type: "string",
            required: true,
            trim: true,
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
    }
);

const Titles = mongoose.model('Titles', titleSchema);

// Export the model
module.exports = {
    Titles: Titles,
};