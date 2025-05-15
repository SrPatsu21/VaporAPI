const express = require('express');
const {authenticate, isAdmin} = require('./authController.js')
const { createTag, getTag, searchTag,
    updateTag, deleteTag } = require('../../middleware/v1/tag.js')

const router = express.Router();

/**
 * @swagger
 * /api/v1/tag:
 *   post:
 *     summary: Create a new tag (Admin only)
 *     tags: [Tag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tagSTR
 *             properties:
 *               tagSTR:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 tagSTR:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied, Admins only
 *       500:
 *         description: Server error
 */
router.post("", authenticate, isAdmin, createTag, async (req, res) => {
    try {
        res.status(201).json(req.createdTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/tag/{id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [Tag]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 tagSTR:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getTag, async (req, res) => {
    try {
        res.status(201).json(req.foundTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/tag/{id}:
 *   put:
 *     summary: Update an existing tag (Admin only)
 *     tags: [Tag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tagSTR
 *             properties:
 *               tagSTR:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 tagSTR:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: tagSTR is required
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied, Admins only
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */

router.put("/:id", authenticate, isAdmin, updateTag, async (req, res) => {
    try {
        res.status(201).json(req.updatedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/tag:
 *   get:
 *     summary: Search for tags
 *     tags: [Tag]
 *     parameters:
 *       - in: query
 *         name: tagSTR
 *         schema:
 *           type: string
 *         description: Filter by tag string
 *       - in: query
 *         name: deleted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   tagSTR:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("", searchTag, async (req, res) => {
    try {
        res.status(201).json(req.foundTags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/tag/{id}:
 *   delete:
 *     summary: Soft Delete a tag (Admin only)
 *     tags: [Tag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 tagSTR:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied, Admins only
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, isAdmin, deleteTag, async (req, res) => {
    try {
        res.status(201).json(req.deletedTag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;