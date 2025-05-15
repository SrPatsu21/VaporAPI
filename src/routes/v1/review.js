const express = require('express');
const { authenticate } = require('./authController.js');
const {
    isReviewOwner,
    isReviewOwnerOrAdmin,
    createReview,
    getReview,
    updateReview,
    searchReview,
    deleteReview,
    getLatestReviewsForProduct
} = require('../../middleware/v1/review.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - product
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               description:
 *                 type: string
 *               product:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Review successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, createReview, (req, res) => {
    try {
        res.status(201).json(req.createdReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/review:
 *   get:
 *     summary: Search reviews
 *     tags: [Review]
 *     parameters:
 *       - in: query
 *         name: score
 *         schema:
 *           type: number
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *       - in: query
 *         name: product
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
 *         description: List of reviews
 *       400:
 *         description: Bad request
 */
router.get('/', searchReview, (req, res) => {
    try {
        res.status(200).json(req.foundReviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/review/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */
router.get('/:id', getReview, (req, res) => {
    try {
        res.status(200).json(req.foundReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/review/{id}:
 *   put:
 *     summary: Update a review (Owner only)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticate, isReviewOwner, updateReview, (req, res) => {
    try {
        res.status(200).json(req.updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/review/{id}:
 *   delete:
 *     summary: Delete a review (Owner or Admin)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authenticate, isReviewOwnerOrAdmin, deleteReview, (req, res) => {
    try {
        res.status(200).json(req.deletedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/review/latest/{productId}:
 *   get:
 *     summary: Get the latest reviews for a specific product
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of recent reviews
 *       400:
 *         description: Bad request
 */
router.get('/latest/:productId', getLatestReviewsForProduct, (req, res) => {
    try {
        res.status(200).json(req.latestReviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;