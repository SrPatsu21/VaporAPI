const express = require('express');
const { authenticate } = require('./authController.js');
const {
    isOwner,
    createProduct,
    getProduct,
    updateProduct,
    patchProduct,
    searchProduct,
    deleteProduct,
    restoreProduct,
        } = require('../../middleware/v1/product.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product successfully created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createProduct, (req, res) => {
    res.status(201).json(req.createdProduct);
});

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Search products
 *     tags: [Product]
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
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: minDownloads
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxDownloads
 *         schema:
 *           type: integer
 *       - in: query
 *         name: deleted
 *         schema:
 *           type: boolean
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
 *         description: List of products
 *       500:
 *         description: Server error
 */
router.get("/", searchProduct, (req, res) => {
    res.status(200).json(req.foundProducts);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProduct, (req, res) => {
    res.status(200).json(req.foundProduct);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Product]
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.put("/:id", authenticate, isOwner, updateProduct, (req, res) => {
    res.status(200).json(req.updatedProduct);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Partially update a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.patch("/:id", authenticate, isOwner, patchProduct, (req, res) => {
    res.status(200).json(req.updatedProduct);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Product]
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
 *         description: Product successfully deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authenticate, isOwner, deleteProduct, (req, res) => {
    res.status(200).json(req.deletedProduct);
});

/**
 * @swagger
 * /api/v1/products/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted product
 *     tags: [Product]
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
 *         description: Product restored successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.patch("/:id/restore", authenticate, isOwner, restoreProduct, (req, res) => {
    res.status(200).json(req.restoredProd);
});

module.exports = router;
