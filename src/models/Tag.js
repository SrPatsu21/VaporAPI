const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema  = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required",
        },
        tagSTR: {
            type: "string",
            required: true,
            trim: true,
            maxlength: 48,
            description: "must be a string and is required",
        },
        deleted: {
            type: Boolean,
            default: false, // Default is non-deleted user
            description: "Indicates if the user was deactivat",
        },
    },
    { collection: "Tags", timestamps: true },
);

tagSchema.index({ _id: "hashed" });

const Tags = mongoose.model('Tags', tagSchema);

// Export the model
module.exports = {
    Tags: Tags,
};