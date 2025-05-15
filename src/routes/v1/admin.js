const express = require('express');
const router = express.Router();
const { pruneSoftDeleted } = require('../../middleware/v1/admin');
const {authenticate, isAdmin} = require('./authController.js')

/**
 * @swagger
 * /api/v1/admin/prune-all:
 *   delete:
 *     summary: Permanently delete soft-deleted resources not referenced by active data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Removes soft-deleted Tags, Titles, Categories, Users, and Products that are:
 *       - Not referenced by active (non-deleted) documents.
 *       - For Users and Products: also deleted for over 1 year.
 *     responses:
 *       200:
 *         description: Prune operation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Tags:
 *                   type: integer
 *                   description: Number of Tags permanently deleted
 *                 Titles:
 *                   type: integer
 *                   description: Number of Titles permanently deleted
 *                 Categories:
 *                   type: integer
 *                   description: Number of Categories permanently deleted
 *                 Users:
 *                   type: integer
 *                   description: Number of Users permanently deleted
 *                 Products:
 *                   type: integer
 *                   description: Number of Products permanently deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/prune-all', authenticate, isAdmin, async (req, res, next) => {
    try {
        const result = await pruneSoftDeleted();
        res.status(200).json({ message: "Pruning completed", result });
    } catch (err) {
        next(err);
    }
});

module.exports = router;