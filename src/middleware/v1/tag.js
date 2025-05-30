const { Tags } = require('../../models/Tag.js')

//! ADMIN ONLY
const createTag = async (req, res, next) => {
    try {
        const { tagSTR: rawTagSTR } = req.body;

        const tagSTR = rawTagSTR.toLowerCase();

        const exist = await Tags.findOne({ tagSTR });

        if (exist) {
            return res.status(400).json({ error: 'Tag with this name already exists' });
        }

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
        const { tagSTR: rawTagSTR } = req.body;

        const tagSTR = rawTagSTR.toLowerCase();

        if (!tagSTR) {
            return res.status(400).json({
                error: "tagSTR is required."
            });
        }

        const exist = await Tags.findOne({ tagSTR });

        if (exist) {
            return res.status(400).json({ error: 'Tags with this name already exists' });
        }

        const id = req.params.id;

        const updates = {}
        updates.tagSTR = tagSTR;

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
        const { tagSTR , deleted, limit, skip } = req.query;
        const query = { };
        if (tagSTR) query.tagSTR = { $regex: tagSTR, $options: 'i' };;
        query.deleted = false
        if (deleted) query.deleted = deleted;

        let limited = 1000;
        if(limit){
            if (limit < 1000) limited = limit;
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
        const deleted = await Tags.findByIdAndUpdate(id, { deleted: true }, { new: true });
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