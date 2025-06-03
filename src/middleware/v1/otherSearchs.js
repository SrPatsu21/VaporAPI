const mongoose = require('mongoose');
const Titles = require('../../models/Title').Titles;
const Products = require('../../models/Product').Products;
const Users = require('../../models/User').Users;
const Tags = require('../../models/Tag').Tags;
const Categories = require('../../models/Category').Categories;

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
            }
        ])
        .populate({
            path: 'category',
            match: { deleted: false },
            select: 'categorySTR'
        })
        .populate({
            path: 'tags',
            match: { deleted: false },
            select: 'tagSTR'
        })
        .skip(skipNum)
        .limit(limitNum)
        .lean();

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
                }
            ])
            .populate({
                path: 'tags',
                match: { deleted: false },
                select: 'tagSTR'
            })
            .populate({
                path: 'owner',
                match: { deleted: false },
                select: 'username'
            })
            .skip(skipNum)
            .limit(remainingLimit)
            .select('-magnetLink -othersUrl -deleted -__v -createdAt -updatedAt')
            .lean();
        }

        req.foundProducts = products;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { searchByQueryAll };