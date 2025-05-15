const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            auto: true,
            description: "must be an ObjectId and is required",
        },
        score: {
            type: Number,
            min: 0,
            max: 10,
            required: true,
            description: "Score must be a number between 0 and 10",
        },
        description: {
            type: "string",
            trim: true,
            description: "must be a string",
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
            description: "must be a ObjectId and is required"
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            description: "must be a ObjectId and is required"
        },
    },
    {collection: "Reviews", timestamps: true}
)
ReviewSchema.index({ _id: "hashed" });

const Reviews = mongoose.model('Reviews', ReviewSchema);

// Export the model
module.exports = {
    Reviews,
};