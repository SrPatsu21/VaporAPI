const mongoose = require('mongoose');
const Titles = require('../../models/Title').Titles;
const Products = require('../../models/Product').Products;

const searchByQueryAll = async (req, res, next) => {
    try {
        const { query = '', skip = 0, limit = 20 } = req.query;
        const limitNum = Math.min(parseInt(limit), 100);
        const skipNum = parseInt(skip);
        const regex = new RegExp(query, 'i');

        //* Titles
        const titles = await Titles.aggregate([
            { $match: { deleted: false } },
            {
                $lookup: {
                    from: "Categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "Tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $match: {
                    $or: [
                        { titleSTR: regex },
                        { "category.categorySTR": regex },
                        { "tags.tagSTR": regex }
                    ]
                }
            },
            { $skip: skipNum },
            { $limit: limitNum }
        ]);

        req.foundTitles = titles;
        const titlesCount = titles.length;

        //* Products
        let products = [];
        if (titlesCount < limitNum) {
            const remainingLimit = limitNum - titlesCount;

            products = await Products.aggregate([
                { $match: { deleted: false } },
                {
                    $lookup: {
                        from: "Tags",
                        localField: "tags",
                        foreignField: "_id",
                        as: "tags"
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner"
                    }
                },
                { $unwind: "$owner" },
                {
                    $match: {
                        $or: [
                            { name: regex },
                            { "tags.tagSTR": regex },
                            { "owner.username": regex }
                        ]
                    }
                },
                {
                    $project: {
                        magnetLink: 0,
                        othersUrl: 0,
                        deleted: 0,
                        __v: 0,
                        createdAt: 0,
                        updatedAt: 0
                    }
                },
                { $skip: skipNum },
                { $limit: remainingLimit }
            ]);
        }

        req.foundProducts = products;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { searchByQueryAll };
