const express = require("express");
const router = express.Router();
const { clearCollections, createAdminUser } = require("../../utils/seeder");

/**
 * @swagger
 * /api/debug/clear-collections:
 *   post:
 *     summary: Clear all data from collections (preserves collections and configurations)
 *     tags: [debug]
 *     responses:
 *       200:
 *         description: Successfully cleared data from all collections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All collections data cleared. Collections preserved.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error clearing collections data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       403:
 *         description: Forbidden (not authorized to access this route)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 */
router.post("/clear-collections", async (req, res) => {
    try {
        await clearCollections();
        res.status(200).json({ message: "All collections data cleared. Collections preserved." });
    } catch (err) {
        res.status(500).json({ message: "Error clearing collections data", error: err.message });
    }
});

/**
 * @swagger
 * /api/debug/create-admin:
 *   post:
 *     summary: Create the admin user if not already present
 *     tags: [debug]
 *     responses:
 *       200:
 *         description: Successfully created the admin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin user created successfully!
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       403:
 *         description: Forbidden (not authorized to access this route)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating admin user
 */
router.post("/create-admin", async (req, res) => {
    try {
        await createAdminUser();
        res.status(200).json({ message: "Admin and user created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error creating admin and user", error: err.message });
    }
});

module.exports = router;
