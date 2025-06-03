const { Products } = require('../../models/Product.js');
const mongoose = require('mongoose');


const isOwner = async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this product' });
        }

        next();
    } catch (err) {
        next(err);
    }
}

/*
{
    "name": "Product Name",
    "description": "Product description",
    "imageURL": "https://...",
    "magnetLink": "magnet:?xt=urn:btih:5F4DCC",
    "othersUrl": ["https://..."],
    "title": "<Title ObjectId>",
    "tags": ["<Tag ObjectId>", ...],
    "owner": "<User ObjectId>",
    "version": "1.0.0"
}
*/
const createProduct = async (req, res, next) => {
    try {
        const { name, description, imageURL, magnetLink, othersUrl, title, tags, version } = req.body;
        const owner = req.user.userId;
        // Required fields validation
        if (!name || !title || !owner || !version || !magnetLink ) {
            return res.status(400).json({ error: 'name, description, and version are required.' });
        }

        const tagsArray = typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(tags) ? tags : [];

        const othersUrlArray = typeof othersUrl === 'string'
        ? othersUrl.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(othersUrl) ? othersUrl : [];

        const product = new Products({
            name,
            description,
            imageURL,
            magnetLink,
            othersUrl: othersUrlArray,
            title,
            tags: tagsArray,
            owner,
            version
        });

        await product.save();

        req.createdProduct = product;
        next();
    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Products.findById(id)
            .select('-magnetLink -othersUrl -deleted -__v -createdAt -updatedAt')
            .populate({
                path: 'title',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'tags',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        req.foundProduct = product;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
/*
{
    "name": "Product Name",
    "description": "Product description",
    "imageURL": "https://...",
    "magnetLink": "magnet:?xt=urn:btih:5F4DCC",
    "othersUrl": ["https://..."],
    "title": "<Title ObjectId>",
    "tags": ["<Tag ObjectId>", ...],
    "version": "1.0.0"
}
*/
const updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        let { name, description, imageURL, magnetLink, othersUrl, title, tags, version } = req.body;

        if (!name || !title || !version || !magnetLink ) {
            return res.status(400).json({ error: 'name, title, description, and version are required.' });
        }
        if(!description)
        {
            description = ""
        }
        if(!tags)
        {
            tags = []
        }else {
            tags = typeof tags === 'string'
            ? tags.split(',').map(t => t.trim()).filter(Boolean)
            : Array.isArray(tags) ? tags : [];
        }
        if(!othersUrl)
            {
                othersUrl = []
            }else {
                othersUrl = typeof othersUrl === 'string'
                ? othersUrl.split(',').map(t => t.trim()).filter(Boolean)
                : Array.isArray(othersUrl) ? othersUrl : [];
            }
        if(!imageURL){
            imageURL = ""
        }

        const update = { name,
                description,
                imageURL,
                magnetLink,
                othersUrl,
                title,
                tags,
                version
            }

        const updatedProduct = await Products.findByIdAndUpdate(id, update, {
            new: true,
        })
            .populate({
                path: 'title',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'tags',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            });


        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        req.updatedProduct = updatedProduct;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
/*
{
    "name": "Product Name",
    "description": "Product description",
    "imageURL": "https://...",
    "magnetLink": "magnet:?xt=urn:btih:5F4DCC",
    "othersUrl": ["https://..."],
    "title": "<Title ObjectId>",
    "tags": ["<Tag ObjectId>", ...],
    "version": "1.0.0"
}
*/
const patchProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = {};

        updates.name = req.body.name
        updates.description = req.body.description
        updates.imageURL = req.body.imageURL
        updates.title = req.body.title
        updates.tags = req.body.tags
        updates.version = req.body.version
        updates.magnetLink = req.body.magnetLink
        updates.othersUrl = req.body.othersUrl

        // Parse tags if needed
        if (updates.tags) {
            updates.tags = typeof updates.tags === 'string'
                ? updates.tags.split(',').map(t => t.trim()).filter(Boolean)
                : Array.isArray(updates.tags) ? updates.tags : [];
        }

        const updatedProduct = await Products.findByIdAndUpdate(id, updates, {
            new: true,
        })
            .populate({
                path: 'title',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'tags',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        req.updatedProduct = updatedProduct;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Search products.
 * Query params supported:
 *  - name
 *  - owner
 *  - title
 *  - tags
 *  - deleted (true/false)
 *  - limit
 *  - skip
 */
const searchProduct = async (req, res, next) => {
    try {
        const { name, owner, title, deleted, limit, skip, tags } = req.query;
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (owner) query.owner = owner;
        if (title) query.title = title;

        if (tags) {
            const tagIds = tags.split(',').map(id => id.trim()).filter(id => mongoose.isValidObjectId(id)).map(id => mongoose.Types.ObjectId.createFromHexString(id));
            query.tags = { $all: tagIds };
        }

        // Exclude deleted by default
        query.deleted = deleted === 'true' ? true : false;

        let limited = 100;
        if(limit){
            if (limit < 100) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const products = await Products.find(query)
            .limit(limited)
            .skip(skiped)
            .select('-magnetLink -othersUrl -deleted -__v -createdAt -updatedAt')
            .populate({
                path: 'title',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'tags',
                select: '-deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            });
        req.foundProducts = products;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedProd = await Products.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!deletedProd) return res.status(404).json({ message: 'Product not found' });

        req.deletedProduct = deletedProd;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
const restoreProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const restoredProd = await Products.findByIdAndUpdate(id, { deleted: false }, { new: true });
        if (!restoredProd) return res.status(404).json({ message: 'Product not found' });
        req.restoredProd = restoredProd;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    isOwner,
    createProduct,
    getProduct,
    updateProduct,
    patchProduct,
    searchProduct,
    deleteProduct,
    restoreProduct
};
