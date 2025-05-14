const Category = require('../../models/Category.js');
const { Categories } = require('../../models/Category.js')

//! ADMIN ONLY
/*
{
    "categorySTR": "Game",
}
*/
const createCategory = async (req, res, next) => {
    try {
        const { categorySTR } = req.body;

        const exist = await Categories.findOne({ categorySTR });

        if (exist) {
            return res.status(400).json({ error: 'category already exists' });
        }

        await category.save();

        req.createdCategory = category;
        next();
    } catch (err) {
        next(err);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Categories.findById(id)
        if (!category) return res.status(404).json({ message: "Category not found" });

        req.foundCategory = category;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
/*
{
    "categorySTR": "Game",
}
*/
const updateCategory = async (req, res, next) => {
    try {
        const { categorySTR } = req.body;
        if (!categorySTR) {
            return res.status(400).json({
                error: "categorySTR is required."
            });
        }

        const exist = await Categories.findOne({ categorySTR });

        if (exist) {
            return res.status(400).json({ error: 'category already exists' });
        }

        const id = req.params.id;

        const updates = {}
        updates.categorySTR = categorySTR;

        const updated = await Categories.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Category not found"});

        req.updatedCategory = updated;
        next();
    } catch (err) {
        next(err);
    }
};

/*
{
    "categorySTR": "Game",
}
*/
const searchCategory = async (req, res, next) => {
    try {
        const { categorySTR, deleted, limit, skip } = req.query;
        const query = { };
        if (categorySTR) query.categorySTR = { $regex: categorySTR, $options: 'i' };;
        query.deleted = false
        if (deleted) query.deleted = deleted;
        let limited = 1000;
        if(limit){
            if (limit > 1000) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const categories = await Categories.find(query).limit(limited).skip(skiped).select("-createdAt -updatedAt -__v");
        req.foundCategories = categories;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleted = await Categories.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!deleted) return res.status(404).json({ message: "Category not found" });

        req.deletedCategory = deleted;
        next();
    } catch (err) {
        next(err);
    }
};

//* Export the model
module.exports = {
    createCategory,
    getCategory,
    searchCategory,
    updateCategory,
    deleteCategory,
}