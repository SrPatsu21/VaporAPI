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
    const { name, category, title, tags, limit, skip } = req.query;
    const limitNum = Math.min(parseInt(limit), 100);
    const skipNum = parseInt(skip);
    const tagsArray = tags ? tags.split(',').map(id => id.trim()).filter(id => mongoose.isValidObjectId(id)).map(id => mongoose.Types.ObjectId.createFromHexString(id)) : [];

    if(!title){
        const queryTitle = {
            deleted: false,
        };
        if (name) {
            queryTitle.titleSTR = { $regex: name, $options: 'i' };
        }
        if (category) {
            queryTitle.category = category;
        }

        const aggregationPipeline = [
            { $match: query },
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
                }
            },
            { $skip: skipNum },
            { $limit: limitNum },
        ];
        const foundTitles = await Titles.aggregate(aggregationPipeline);

        req.foundTitles = foundTitles
        const titlesCount = titles.length;

        if (titlesCount < limitNum) {
            const queryProduct = {
                deleted: false,
            };
            if (name) {
                queryProduct.name = { $regex: name, $options: 'i' };
            }
            if(tagsArray){
                query.tags = { $all: tagsArray };
            }
            const remainingLimit = limitNum - titlesCount;
            const products = await Products.find(query)
                        .limit(remainingLimit)
                        .skip(Math.max(0, skipNum - remainingLimit))
                        .select('_id name imageURL')
            req.foundProducts = products;
        }
    }else{
        const query = {
            deleted: false,
        };

        if (name) query.name = { $regex: name, $options: 'i' };
        if (title) query.title = title;
        if (tags) {
            const tagIds = tags.split(',').map(id => id.trim()).filter(id => mongoose.isValidObjectId(id)).map(id => mongoose.Types.ObjectId.createFromHexString(id));
            query.tags = { $all: tagIds };
        }

        const products = await Products.find(query)
            .limit(limitNum)
            .skip(skipNum)
            .select('_id name imageURL')

        req.foundProducts = products;
    }
}

module.exports = { searchByQueryAll };
