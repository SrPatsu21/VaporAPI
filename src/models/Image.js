const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
        },
        filename: {
            type: String,
            trim: true,
            maxlength: 128,
            required: true
        },
        contentType:
        {
            type: String,
            required: true
        },
        data:
        {
            type: Buffer,
            required: true
        },
        createdAt:
        {
            type: Date,
            default: Date.now,
            require: true,
        }
    },
    {collection: "Images"}
)
imageSchema.index({ _id: "hashed" });

const Images = mongoose.model('Images', imageSchema);

// Export the model
module.exports = {
    Images: Images,
};