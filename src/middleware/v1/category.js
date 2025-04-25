const { Category } = require('../../models/Category.js')

//! ADMIN ONLY
/*
{
    "categorySTR": "Game",
}
*/
const createCategory = async (req, res, next) => {
    try {
        const { categorySTR } = req.body;

        // Create user with hashed password
        const category = new Category({
            categorySTR
        });

        await category.save();

        req.createdCategory = category;
        next();
    } catch (err) {
        next(err);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const id = req.params;
        const category = await Category.findById(id);
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
        if (!req.body.categorySTR) {
            return res.status(400).json({
                error: "categorySTR is required."
            });
        }

        const id = req.params.id;

        const updates = req.body.categorySTR;

        const updated = await Users.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Category not found or no data"});

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
        const { categorySTR, limit, skip } = req.query;
        const query = { };
        if (categorySTR) query.categorySTR = categorySTR;
        let limited = 100;
        if(limit){
            if (limit > 100) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const categories = await Category.find(query).limit(limited).skip(skiped);
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
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "User not found" });

        req.deletedUser = deleted;
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