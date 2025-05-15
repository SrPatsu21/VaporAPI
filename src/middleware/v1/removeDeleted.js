const { Categories } = require('../../models/Category.js');
const { Products } = require('../../models/Product.js');
const { Tags } = require('../../models/Tag.js')
const { Titles } = require('../../models/Title.js');
const { Users } = require('../../models/User.js')

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

const pruneSoftDeleted = async () => {
    const results = {
        Tags: 0,
        Titles: 0,
        Categories: 0,
        Users: 0,
        Products: 0
    };

    const now = Date.now();

    // Tags
    const softDeletedTags = await Tags.find({ deleted: true });
    for (const tag of softDeletedTags) {
        const usedInTitles = await Titles.exists({ tags: tag._id, deleted: false });
        if (!usedInTitles)
        {
            const usedInProducts = await Products.exists({ tags: tag._id, deleted: false });
            if (!usedInProducts) {
                await Tags.findByIdAndDelete(tag._id);
                results.Tags++;
            }
        }
    }

    // Titles
    const softDeletedTitles = await Titles.find({ deleted: true });
    for (const title of softDeletedTitles) {
        const usedInProducts = await Products.exists({ title: title._id, deleted: false });
        if (!usedInProducts) {
            await Titles.findByIdAndDelete(title._id);
            results.Titles++;
        }
    }

    // Categories
    const softDeletedCategories = await Categories.find({ deleted: true });
    for (const category of softDeletedCategories) {
        const usedInTitles = await Titles.exists({ category: category._id, deleted: false });
        if (!usedInTitles) {
            await Categories.findByIdAndDelete(category._id);
            results.Categories++;
        }
    }

    // Users
    const softDeletedUsers = await Users.find({ deleted: true });
    for (const user of softDeletedUsers) {
        const ownsProducts = await Products.exists({ owner: user._id, deleted: false });
        const updatedAtTime = new Date(user.updatedAt).getTime();
        const isOld = (now - updatedAtTime) > 2*ONE_YEAR_MS;
        if (!ownsProducts && isOld) {
            await Users.findByIdAndDelete(user._id);
            results.Users++;
        }
    }

    // Products
    const softDeletedProducts = await Products.find({ deleted: true });
    for (const product of softDeletedProducts) {
        const updatedAtTime = new Date(product.updatedAt).getTime();
        const isOld = (now - updatedAtTime) > ONE_YEAR_MS;
        if (isOld) {
            await Products.findByIdAndDelete(product._id);
            results.Products++;
        }
    }

    return results;
};

module.exports = { pruneSoftDeleted };