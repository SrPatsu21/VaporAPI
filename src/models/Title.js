const mongoose = require('mongoose');
const { Schema } = mongoose;

const titelSchema = new Schema(
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

const Titels = mongoose.model('Titels', titelSchema);

// Export the model
module.exports = {
    Titels: Titels,
};