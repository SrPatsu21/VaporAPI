const { Products } = require('../../models/Product.js');


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
            .populate('title')
            .populate('tags')
            .populate('owner');

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
            return res.status(400).json({ error: 'name, description, and version are required.' });
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

        const updatedProduct = await Titles.findByIdAndUpdate(id, update, {
            new: true,
        })
            .populate('title')
            .populate('tags')
            .populate('owner');


        if (!updated) {
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
            .populate('title')
            .populate('tags')
            .populate('owner');

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
 *  - name (exact match)
 *  - owner
 *  - title
 *  - minDownloads (Number)
 *  - maxDownloads (Number)
 *  - deleted (true/false)
 *  - limit
 *  - skip
 */
const searchProduct = async (req, res, next) => {
    try {
        const { name, owner, title, minDownloads, maxDownloads, deleted, limit, skip } = req.query;
        const query = {};

        if (name) query.name = name;
        if (owner) query.owner = owner;
        if (title) query.title = title;

        // Exclude deleted by default
        query.deleted = deleted === 'true' ? true : false;

        // Pagination
        let lim = 100;
        if (limit && Number(limit) > 0) lim = Math.min(Number(limit), 1000);
        const sk = skip ? Number(skip) : 0;

        const products = await Products.find(query)
            .limit(lim)
            .skip(sk)
            .select('-magnetLink -othersUrl -deleted -__v -createdAt -updatedAt')
            .populate('title')
            .populate('tags')
            .populate('owner');

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
