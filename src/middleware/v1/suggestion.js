const { Suggestions } = require('../../models/Suggestion.js');


const isOwner = async (req, res, next) => {
    try {
        const suggestion = await Suggestions.findById(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        if (suggestion.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this suggestion' });
        }

        next();
    } catch (err) {
        next(err);
    }
}

const isOwnerOrAdmin = async (req, res, next) => {
    try {
        if(!req.params.isAdmin){
            const suggestion = await Suggestions.findById(req.params.id);
            if (!suggestion) {
                return res.status(404).json({ message: 'Suggestion not found' });
            }
            if (suggestion.owner.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Forbidden: You are not the owner of this suggestion' });
            }
        }

        next();
    } catch (err) {
        next(err);
    }
}

/*
{
    "refersto": "enum ['title', 'tag', 'category']"
    "name": "Name",
    "description": "description",
    "owner": "<User ObjectId>"
}
*/
const createSuggestion = async (req, res, next) => {
    try {
        const { refersto, name, description } = req.body;
        const owner = req.user.userId;
        // Required fields validation
        if (!name || !description || !owner || !refersto ) {
            return res.status(400).json({ error: 'refersto, name, description and owner are required.' });
        }

        if (refersto && !['title', 'tag', 'category'].includes(refersto)) {
            res.status(400).json({ error: 'refersto must be one of: (title, tag, category)' });
        }

        const exist = await Suggestions.findOne({ name, refersto });

        if (exist) {
            return res.status(400).json({ error: 'Suggestion with this name already exists' });
        }

        const suggestion = new Suggestions({
            name,
            description,
            owner,
            refersto
        });

        await suggestion.save();

        req.createdSuggestion = suggestion;
        next();
    } catch (err) {
        next(err);
    }
};

const getSuggestion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const suggestion = await Suggestions.findById(id)
            .select('-__v -createdAt -updatedAt')
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -__v -createdAt -updatedAt'
            });

        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }

        req.foundSuggestion = suggestion;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
/*
{
    "refersto": "enum ['title', 'tag', 'category']"
    "name": "Name",
    "description": "description",
}
*/
const updateSuggestion = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { refersto, name, description } = req.body;
        const owner = req.user.userId;

        if (!name || !description || !owner || !refersto ) {
            return res.status(400).json({ error: 'refersto, name, description and owner are required.' });
        }

        if (refersto && !['title', 'tag', 'category'].includes(refersto)) {
            res.status(400).json({ error: 'refersto must be one of: (title, tag, category)' });
        }

        const exist = await Suggestions.findOne({ name, refersto });

        if (exist) {
            return res.status(400).json({ error: 'Suggestion with this name already exists' });
        }

        const update = { name,
                name,
                description,
                owner,
                refersto
            }

        const updatedSuggestion = await Suggestions.findByIdAndUpdate(id, update, {
            new: true,
        })

        if (!updatedSuggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }

        req.updatedSuggestion = updatedSuggestion;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Query params supported:
 *  - name
 *  - owner
 *  - limit
 *  - skip
 */
const searchSuggestion = async (req, res, next) => {
    try {
        const { name, owner, limit, skip } = req.query;
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (owner) query.owner = owner;

        let limited = 1000;
        if(limit){
            if (limit < 1000) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const suggestions = await Suggestions.find(query)
            .limit(limited)
            .skip(skiped)
            .select('-__v -createdAt -updatedAt')
            .populate({
                path: 'owner',
                select: '-email -isAdmin -password -__v -createdAt -updatedAt'
            });
        req.foundSuggestions = suggestions;
        next();
    } catch (err) {
        next(err);
    }
};

//! OWNER ONLY
const deleteSuggestion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedSuggestion = await Suggestions.findByIdAndDelete(id);
        if (!deletedSuggestion) return res.status(404).json({ message: 'Suggestion not found' });

        req.deletedSuggestion = deletedSuggestion;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    isOwner,
    isOwnerOrAdmin,
    createSuggestion,
    getSuggestion,
    updateSuggestion,
    searchSuggestion,
    deleteSuggestion,
};
