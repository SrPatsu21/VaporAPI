const express = require("express");
const router = express.Router();
const { searchByQueryAll, searchByTitleAndCategory } = require("../../middleware/v1/otherSearchs");

/**
 * @swagger
 * /api/v1/othersearch/searchbyqueryall:
 *   get:
 *     summary: Search Titles and complete with Products
 *     tags: [OtherSearch]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search string to match titleSTR, categorySTR, tagSTR, product name or owner username
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Titles and Products that match the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titles:
 *                   type: array
 *                   items:
 *                     type: object
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get("/searchbyqueryall", searchByQueryAll, (req, res) => {
    try {
        res.status(200).json({
            titles: req.foundTitles || [],
            products: req.foundProducts || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/othersearch/searchbytitleandcategory:
 *   get:
 *     summary: Search Titles and fallback to Products by name, category, title, and tags
 *     tags: [OtherSearch]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Title name or Product name to search
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Category ID to filter Titles
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Exact Title to filter Products
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated tag IDs to filter results
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Max number of results
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Matching Titles and/or Products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titles:
 *                   type: array
 *                   items:
 *                     type: object
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get("/searchbytitleandcategory", searchByTitleAndCategory, (req, res) => {
    try {
        res.status(200).json({
            titles: req.foundTitles || [],
            products: req.foundProducts || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
