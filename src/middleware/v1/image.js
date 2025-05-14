const { Images } = require('../../models/Image.js')
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, gif) are allowed'));
        }
    }
});

//! ADMIN ONLY
/*
{
    "filename": "name"
}
*/
const createImage = async (req, res, next) => {
    try {
        const { file } = req;
        const { filename } = req.body;

        if (!file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required in the request body' });
        }

        const newImage = new Images({
            filename,
            contentType: file.mimetype,
            data: file.buffer
        });

        await newImage.save();

        req.createdImage ={
            _id: newImage._id,
            filename: newImage.filename,
            contentType: newImage.contentType,
            createdAt: newImage.createdAt
        };
        next();
    } catch (err) {
        next(err);
    }
};

const getImage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const image = await Images.findById(id).select('-filename -createdAt -_id');
        if (!image) return res.status(404).json({ message: "Image not found" });

        req.foundImage = image;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const getImageFullInfo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const image = await Images.findById(id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        const imageResult = {
            _id: image._id,
            filename: image.filename,
            contentType: image.contentType,
            base64: image.data.toString('base64'),
            createdAt: image.createdAt,
        }

        req.foundImage = imageResult;
        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const searchImage = async (req, res, next) => {
    try {
        const { filename, limit, skip } = req.query;
        const query = { };
        if (filename) query.filename = { $regex: filename, $options: 'i' };;
        let limited = 25;
        if(limit){
            if (limit > 25) limited = limit;
        }
        let skiped = 0;
        if(skip) skiped = skip;

        const images = await Images.find(query).limit(limited).skip(skiped);

        const imageResults = images.map(img => ({
            _id: img._id,
            filename: img.filename,
            contentType: img.contentType,
            base64: img.data.toString('base64'),
            createdAt: img.createdAt,
        }));

        req.foundImages = imageResults;

        next();
    } catch (err) {
        next(err);
    }
};

//! ADMIN ONLY
const deleteImage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleted = await Images.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Category not found" });

        const imageResult = {
            _id: deleted._id,
            filename: deleted.filename,
            contentType: deleted.contentType,
            base64: deleted.data.toString('base64'),
            createdAt: deleted.createdAt,
        }

        req.deletedImage = imageResult;
        next();
    } catch (err) {
        next(err);
    }
};

//* Export the model
module.exports = {
    upload,
    createImage,
    getImage,
    getImageFullInfo,
    searchImage,
    deleteImage,
}