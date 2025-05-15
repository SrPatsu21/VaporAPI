const express = require('express');
const {
    upload,
    createImage,
    getImage,
    getImageFullInfo,
    searchImage,
    deleteImage
} = require('../../middleware/v1/image.js');
const { authenticate, isAdmin } = require('./authController.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/image:
 *   post:
 *     summary: Upload a new image (Admin only)
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - filename
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               filename:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 contentType:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('', authenticate, isAdmin, upload.single('file'), createImage, (req, res) => {
    try {
        res.status(201).json(req.createdImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/image/{id}:
 *   get:
 *     summary: Get image file by ID
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Returns image file
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get('/:id', getImage, (req, res) => {
    try {
        res.set('Content-Type', req.foundImage.contentType);
        res.send(req.foundImage.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/image/fulldate/{id}:
 *   get:
 *     summary: Get full image info by ID (admin only)
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Full image document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 filename:
 *                   type: string
 *                   description: Name of the image file
 *                 contentType:
 *                   type: string
 *                   description: MIME type of the image
 *                 base64:
 *                   type: string
 *                   description: Base64 encoded image data
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation timestamp
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Image not found
 */
router.get('/fulldate/:id', authenticate, isAdmin, getImageFullInfo, (req, res) => {
    try {
        res.status(200).json(req.foundImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/image:
 *   get:
 *     summary: Search images (admin only)
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: uuid
 *                     description: Must be an ObjectId and is required
 *                   filename:
 *                     type: string
 *                     description: Name of the image file
 *                   contentType:
 *                     type: string
 *                     description: MIME type of the image
 *                   base64:
 *                     type: string
 *                     description: Base64 encoded image data
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Creation timestamp
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('', authenticate, isAdmin, searchImage, (req, res) => {
    try {
        res.status(200).json(req.foundImages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/image/{id}:
 *   delete:
 *     summary: Delete an image by ID (admin only)
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 filename:
 *                   type: string
 *                   description: Name of the image file
 *                 contentType:
 *                   type: string
 *                   description: MIME type of the image
 *                 base64:
 *                   type: string
 *                   description: Base64 encoded image data
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation timestamp
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Image not found
 */
router.delete('/:id', authenticate, isAdmin, deleteImage, (req, res) => {
    try {
        res.status(200).json(req.deletedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
