const { Reviews } = require('../../models/Review.js');

const isReviewOwner = async (req, res, next) => {
    try {
        const review = await Reviews.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this review' });
        }

        next();
    } catch (err) {
        next(err);
    }
};

const isReviewOwnerOrAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            const review = await Reviews.findById(req.params.id);
            if (!review) return res.status(404).json({ message: 'Review not found' });

            if (review.owner.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Forbidden: You are not the owner of this review' });
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};

/*
{
    "score": "number",
    "description": "string",
    "product": "<Products ObjectId>"
}
 */
const createReview = async (req, res, next) => {
    try {
        const { score, description, product } = req.body;
        const owner = req.user.userId;

        if (score === undefined || !product) {
            return res.status(400).json({ error: 'score and product are required.' });
        }

        if (score < 0 || score > 10) {
            return res.status(400).json({ error: 'score must be between 0 and 10.' });
        }

        const exist = await Reviews.findOne({ owner, product });

        if (exist) {
            return res.status(400).json({ error: 'You already Reviwed this Product' });
        }

        const review = new Reviews({ score, description, product, owner });
        await review.save();

        req.createdReview = review;
        next();
    } catch (err) {
        next(err);
    }
};

const getReview = async (req, res, next) => {
    try {
        const review = await Reviews.findById(req.params.id)
            .select('-__v ')
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'product',
                select: '-description -magnetLink -othersUrl -title -tags -owner -version -deleted -__v -createdAt -updatedAt'
            });

        if (!review) return res.status(404).json({ message: 'Review not found' });

        req.foundReview = review;
        next();
    } catch (err) {
        next(err);
    }
};

//!Owner only
/*
{
    "score": "number",
    "description": "string",
}
 */
const updateReview = async (req, res, next) => {
    try {
        const { score, description } = req.body;

        if (score !== undefined && (score < 0 || score > 10)) {
            return res.status(400).json({ error: 'score must be between 0 and 10.' });
        }

        const update = {};
        if (score !== undefined) update.score = score;
        if (description !== undefined) update.description = description;

        const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, update, { new: true });

        if (!updatedReview) return res.status(404).json({ message: 'Review not found' });

        req.updatedReview = updatedReview;
        next();
    } catch (err) {
        next(err);
    }
};

const searchReview = async (req, res, next) => {
    try {
        const { score, owner, product, limit, skip } = req.query;
        const query = { };

        if (score) query.score = score;
        if (owner) query.owner = owner;
        if (product) query.product = product;

        let limited = 100;
        if(limit){
            if (limit < 100) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const foundReviews = await Reviews.find(query)
            .limit(limited)
            .skip(skiped)
            .select('-__v ')
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'product',
                select: '-description -magnetLink -othersUrl -title -tags -owner -version -deleted -__v -createdAt -updatedAt'
            });

        req.foundReviews = foundReviews;
        next();
    } catch (err) {
        next(err);
    }
};

//!Owner only or Admin
const deleteReview = async (req, res, next) => {
    try {
        const deletedReview = await Reviews.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: 'Review not found' });

        req.deletedReview = deletedReview;
        next();
    } catch (err) {
        next(err);
    }
};

const getLatestReviewsForProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required in the route params.' });
        }

        const reviews = await Reviews.find({ product: productId })
            .sort({ createdAt: -1 })  // Most recent first
            .limit(25)
            .select(' -__v ')
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -deleted -__v -createdAt -updatedAt'
            })
            .populate({
                path: 'product',
                select: '-description -magnetLink -othersUrl -title -tags -owner -version -deleted -__v -createdAt -updatedAt'
            });

        req.latestReviews = reviews;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    isReviewOwner,
    isReviewOwnerOrAdmin,
    createReview,
    getReview,
    updateReview,
    searchReview,
    deleteReview,
    getLatestReviewsForProduct,
};
