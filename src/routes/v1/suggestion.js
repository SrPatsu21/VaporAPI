const express = require('express');
const { authenticate } = require('./authController.js');
const {
    isOwner,
    isOwnerOrAdmin,
    createSuggestion,
    getSuggestion,
    updateSuggestion,
    searchSuggestion,
    deleteSuggestion,
} = require('../../middleware/v1/suggestion.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/suggestion:
 *   post:
 *     summary: Create a new suggestion
 *     tags: [Suggestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refersto:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Suggestion successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, createSuggestion, (req, res) => {
    try {
        res.status(201).json(req.createdSuggestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/suggestion:
 *   get:
 *     summary: Search suggestions
 *     tags: [Suggestion]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: owner
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
 *         description: List of suggestions
 *       400:
 *         description: Bad request
 */
router.get('/', searchSuggestion, (req, res) => {
    try {
        res.status(200).json(req.foundSuggestions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/suggestion/{id}:
 *   get:
 *     summary: Get a suggestion by ID
 *     tags: [Suggestion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion found
 *       400:
 *         description: Bad request
 */
router.get('/:id', getSuggestion, (req, res) => {
    try {
        res.status(200).json(req.foundSuggestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/suggestion/{id}:
 *   put:
 *     summary: Update a suggestion (Owner)
 *     tags: [Suggestion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refersto:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestion updated
 *       400:
 *         description: Bad request
 */
router.put('/:id', authenticate, isOwner, updateSuggestion, (req, res) => {
    try {
        res.status(200).json(req.updatedSuggestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/suggestion/{id}:
 *   delete:
 *     summary: Delete a suggestion (Owner or admin)
 *     tags: [Suggestion]
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
 *         description: Suggestion deleted
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authenticate, isOwnerOrAdmin, deleteSuggestion, (req, res) => {
    try {
        res.status(200).json(req.deletedSuggestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;