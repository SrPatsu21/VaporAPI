const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema  = new Schema(
    {
        _id: {
            type: "objectId",
            auto: true,
            // unique: true, // no need, MongoDB automatically ensures that
            description: "must be an ObjectId and is required",
        },
        tagSTR: {
            type: "string",
            required: true,
            trim: true,
            maxlength: 40,
            description: "must be a string and is required",
        },
    }
);

const Tags = mongoose.model('Tags', tagSchema);

// Export the model
module.exports = {
    Tags: Tags,
};