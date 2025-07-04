const { Titles } = require('../../models/Title.js');

//! ADMIN ONLY
const createTitle = async (req, res, next) => {
    try {
        const { titleSTR: rawtitleSTR, category, tags, imageURL } = req.body;

        const titleSTR = rawtitleSTR.toUpperCase();

        const tagsArray = typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(tags) ? tags : [];

        const exist = await Titles.findOne({ titleSTR, category });

        if (exist) {
            return res.status(400).json({ error: 'Title with this name already exists' });
        }

        const newTitle = new Titles({
            titleSTR,
            category,
            tags: tagsArray,
            imageURL,
        });

        await newTitle.save();
        req.createdTitle = newTitle;
        next();
    } catch (error) {
        next(error);
    }
};

const getTitle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const title = await Titles.findById(id).populate('category tags');

        if (!title) return res.status(404).json({ error: 'Title not found' });

        req.foundTitle = title;
        next();
    } catch (error) {
        next(error);
    }
};

//! ADMIN ONLY
const updateTitle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titleSTR: rawtitleSTR, category, tags, imageURL } = req.body;

        const titleSTR = rawtitleSTR.toUpperCase();

        const exist = await Titles.findOne({ titleSTR, category });

        if (exist) {
            return res.status(400).json({ error: 'Title with this name already exists' });
        }

        const update = { titleSTR, category, tags, imageURL };

        const updatedTitle = await Titles.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!updatedTitle) return res.status(404).json({ error: 'Title not found' });

        req.updatedTitle = updatedTitle;
        next();
    } catch (error) {
        next(error);
    }
};

//TODO fix make the query better for tags
const searchTitle = async (req, res, next) => {
    try {
        const { titleSTR, category, deleted, limit, skip } = req.query;
        const query = {};

        if (titleSTR) query.titleSTR = new RegExp(titleSTR, 'i');
        if (category) query.category = category;
        query.deleted = false
        if (deleted) query.deleted = deleted;
        else query.deleted = false;

        let limited = 100;
        if(limit){
            if (limit < 100) limited = limit;
        }
        const sk = skip ? Number(skip) : 0;

        const foundTitles = await Titles.find(query)
            .populate({
                path: 'tags',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'category',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .limit(parseInt(limited))
            .skip(parseInt(sk))
            .select("-createdAt -updatedAt -__v");

        req.foundTitles = foundTitles;
        next();
    } catch (error) {
        next(error);
    }
};

//! ADMIN ONLY
const deleteTitle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Titles.findByIdAndUpdate(id, { deleted: true }, { new: true });

        if (!deleted) return res.status(404).json({ error: 'Title not found' });

        req.deletedTitle = deleted;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTitle,
    getTitle,
    updateTitle,
    searchTitle,
    deleteTitle,
};