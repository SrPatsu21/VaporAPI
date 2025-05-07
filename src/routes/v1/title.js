const express = require('express');
const { authenticate, isAdmin } = require('./authController.js');
const {createTitle, getTitle, updateTitle,
    searchTitle, deleteTitle} = require('../../middleware/v1/title.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/title:
 *   post:
 *     summary: Create a new title
 *     tags: [Title]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titleSTR
 *             properties:
 *               titleSTR:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageURL:
 *                 type: string
 *     responses:
 *       201:
 *         description: Title successfully created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied, Admins only
 *       500:
 *         description: Server error
 */
router.post("", authenticate, isAdmin, createTitle, async (req, res) => {
    try {
        res.status(201).json(req.createdTitle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/title/{id}:
 *   get:
 *     summary: Get a title by ID
 *     tags: [Title]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Title found
 *       404:
 *         description: Title not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getTitle, async (req, res) => {
    try {
        res.status(200).json(req.foundTitle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/title/{id}:
 *   put:
 *     summary: Update a title
 *     tags: [Title]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titleSTR:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageURL:
 *                 type: string
 *     responses:
 *       200:
 *         description: Title successfully updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins only
 *       404:
 *         description: Title not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticate, isAdmin, updateTitle, async (req, res) => {
    try {
        res.status(200).json(req.updatedTitle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/title:
 *   get:
 *     summary: Search titles
 *     tags: [Title]
 *     parameters:
 *       - in: query
 *         name: titleSTR
 *         schema:
 *           type: string
 *         description: Filter by title string
 *       - in: query
 *         name: category
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
 *         description: List of titles
 *       500:
 *         description: Server error
 */
router.get("", searchTitle, async (req, res) => {
    try {
        res.status(200).json(req.foundTitles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/title/{id}:
 *   delete:
 *     summary: Delete a title
 *     tags: [Title]
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
 *         description: Title successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins only
 *       404:
 *         description: Title not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, isAdmin, deleteTitle, async (req, res) => {
    try {
        res.status(200).json(req.deletedTitle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;