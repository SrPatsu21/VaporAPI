const express = require("express");
const router = express.Router();
const { searchByQueryAll } = require("../../middleware/v1/otherSearchs");

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

module.exports = router;
