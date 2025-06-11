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

const searchByTitleAndCategory = async (req, res, next) => {
    try {
        const { name, category, title, tags, limit = 10, skip = 0 } = req.query;
        const limitNum = Math.min(parseInt(limit), 100);
        const skipNum = parseInt(skip);

        // Validações de ObjectId
        if (title && !mongoose.isValidObjectId(title)) {
            return res.status(400).json({ error: "Parâmetro 'title' inválido." });
        }

        if (category && !mongoose.isValidObjectId(category)) {
            return res.status(400).json({ error: "Parâmetro 'category' inválido." });
        }

        const tagsArray = tags
            ? tags
                .split(',')
                .map(id => id.trim())
                .filter(id => mongoose.isValidObjectId(id))
                .map(id => new mongoose.Types.ObjectId(id))
            : [];

        if (!title) {
            const queryTitle = { deleted: false };

            if (name) {
                queryTitle.titleSTR = { $regex: name, $options: 'i' };
            }

            if (category) {
                queryTitle.category = new mongoose.Types.ObjectId(category);
            }

            const aggregationPipeline = [
                { $match: queryTitle },
                {
                    $addFields: {
                        matchedTagsCount: {
                            $size: {
                                $ifNull: [
                                    { $setIntersection: ["$tags", tagsArray] },
                                    [],
                                ],
                            },
                        },
                    },
                },
                {
                    $sort: {
                        matchedTagsCount: -1,
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        titleSTR: 1,
                        imageURL: 1,
                    },
                },
                { $skip: skipNum },
                { $limit: limitNum },
            ];

            const foundTitles = await Titles.aggregate(aggregationPipeline);
            req.foundTitles = foundTitles;

            const titlesCount = foundTitles.length;

            if (titlesCount < limitNum) {
                const remainingLimit = limitNum - titlesCount;

                const queryProduct = { deleted: false };

                if (name) {
                    queryProduct.name = { $regex: name, $options: 'i' };
                }

                if (tagsArray.length > 0) {
                    queryProduct.tags = { $all: tagsArray };
                }

                const products = await Products.find(queryProduct)
                    .limit(remainingLimit)
                    .skip(Math.max(0, skipNum - titlesCount))
                    .select('_id name imageURL');

                req.foundProducts = products;
            }
        } else {
            const query = { deleted: false };

            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }

            if (title) {
                query.title = new mongoose.Types.ObjectId(title);
            }

            if (tagsArray.length > 0) {
                query.tags = { $all: tagsArray };
            }

            const products = await Products.find(query)
                .limit(limitNum)
                .skip(skipNum)
                .select('_id name imageURL');

            req.foundProducts = products;
        }

        next();
    } catch (error) {
        console.error("Error in searchByTitleAndCategory:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    searchByQueryAll,
    searchByTitleAndCategory
};
