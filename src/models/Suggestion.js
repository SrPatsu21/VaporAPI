const mongoose = require('mongoose');
const { Schema } = mongoose;

const suggestionSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required",
        },
        refersto: {
            type: String,
            enum: {
                values: ['title', 'tag', 'category'],
                message: '{VALUE} is not valid, (title, tag, category).'
            },
            required: true
        },
        name: {
            type: "string",
            trim: true,
            required: true,
            description: "must be a string and is required",
        },
        description: {
            type: "string",
            trim: true,
            required: true,
            description: "must be a string",
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            description: "must be a ObjectId and is required"
        },
    },
    {collection: "Suggestions", timestamps: true}
)
suggestionSchema.index({ _id: "hashed" });

const Suggestions = mongoose.model('Suggestions', suggestionSchema);

// Export the model
module.exports = {
    Suggestions: Suggestions,
};