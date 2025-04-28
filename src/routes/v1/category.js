const express = require('express');
const {authenticate, isAdmin} = require('./authController.js')
const {createCategory, getCategory, updateCategory,
    searchCategory, deleteCategory } = require('../../middleware/v1/category.js')

const router = express.Router();

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categorySTR
 *             properties:
 *               categorySTR:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 categorySTR:
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
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Admins only)
 */
router.post("", authenticate, isAdmin, createCategory, async (req, res) => {
    try {
        res.status(201).json(req.createdCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 categorySTR:
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
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategory, async (req, res) => {
    try {
        res.status(201).json(req.foundCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categorySTR
 *             properties:
 *               categorySTR:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 categorySTR:
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
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Admins only)
 *       404:
 *         description: Category not found
 */
router.put("/:id", authenticate, isAdmin, updateCategory, async (req, res) => {
    try {
        res.status(201).json(req.updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Search categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: categorySTR
 *         required: false
 *         description: Filter by category string
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit number of results (default 100, max 100)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         required: false
 *         description: Number of results to skip
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   categorySTR:
 *                     type: string
 *       400:
 *         description: Bad request
 */
router.get("", searchCategory, async (req, res) => {
    try {
        res.status(201).json(req.foundCategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Category deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 categorySTR:
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
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Admins only)
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authenticate, isAdmin, deleteCategory, async (req, res) => {
    try {
        res.status(201).json(req.deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;