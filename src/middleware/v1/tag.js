const { Tags } = require('../../models/Tag.js')

//! ADMIN ONLY
const createTag = async (req, res, next) => {
    try {
        const { tagSTR } = req.body;

        const tag = new Tags({
            tagSTR
        });

        await tag.save();

        req.createdTag = tag;
        next();
    } catch (err) {
        next(err);
    }
};

const getTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tag = await Tags.findById(id)
        if (!tag) return res.status(404).json({ message: "Tag not found" });

        req.foundTag = tag;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const updateTag = async (req, res, next) => {
    try {
        if (!req.body.tagSTR) {
            return res.status(400).json({
                error: "tagSTR is required."
            });
        }

        const id = req.params.id;

        const updates = {}
        updates.tagSTR = req.body.tagSTR;

        const updated = await Tags.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Tag not found"});

        req.updatedTag = updated;
        next();
    } catch (err) {
        next(err);
    }
};

const searchTag = async (req, res, next) => {
    try {
        const { tagSTR , limit, skip } = req.query;
        const query = { };
        if (tagSTR) query.tagSTR = tagSTR;
        let limited = 100;
        if(limit){
            if (limit > 100) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const tags = await Tags.find(query).limit(limited).skip(skiped).select("-createdAt -updatedAt -__v");
        req.foundTags = tags;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const deleteTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleted = await Tags.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Tag not found" });

        req.deletedTag = deleted;
        next();
    } catch (err) {
        next(err);
    }
};

//* Export the model
module.exports = {
    createTag,
    getTag,
    searchTag,
    updateTag,
    deleteTag,
}