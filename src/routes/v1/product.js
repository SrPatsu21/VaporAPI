const express = require('express');
const { authenticate } = require('./authController.js');
const {
    isOwner,
    isOwnerOrAdmin,
    createProduct,
    getProduct,
    updateProduct,
    patchProduct,
    searchProduct,
    deleteProduct,
    restoreProduct,
    permanentDeleteProduct
} = require('../../middleware/v1/product.js');

const router = express.Router();

/**
 * @swagger
 * /api/v1/product:
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               magnetLink:
 *                 type: string
 *               othersUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               version:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
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
 *         description: Unauthorized
 */
router.post("/", authenticate, createProduct, (req, res) => {
    try {
        res.status(201).json(req.createdProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product:
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
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tag ObjectIds (e.g., id1,id2,id3)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: uuid
 *                     description: Must be an ObjectId and is required
 *                   name:
 *                     type: string
 *                     description: Must be a string and is required
 *                   description:
 *                     type: string
 *                     description: Must be a string
 *                   imageURL:
 *                     type: string
 *                     maxLength: 512
 *                     description: Must be a string
 *                   magnetLink:
 *                     type: string
 *                     description: Must be a string and a magnet link
 *                   othersUrl:
 *                     type: array
 *                     description: A list of related URLs for the product
 *                     items:
 *                       type: string
 *                   title:
 *                     type: string
 *                     format: uuid
 *                     description: ObjectId reference to a Title
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of ObjectId references to Tags
 *                   owner:
 *                     type: string
 *                     format: uuid
 *                     description: ObjectId reference to the product owner
 *                   version:
 *                     type: string
 *                     maxLength: 40
 *                     description: Must be a string and is required
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get("", searchProduct, (req, res) => {
    try {
        res.status(200).json(req.foundProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProduct, (req, res) => {
    try {
        res.status(200).json(req.foundProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product/{id}:
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               magnetLink:
 *                 type: string
 *               othersUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               version:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
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
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.put("/:id", authenticate, isOwner, updateProduct, (req, res) => {
    try {
        res.status(200).json(req.updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product/{id}:
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               magnetLink:
 *                 type: string
 *               othersUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               version:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.patch("/:id", authenticate, isOwner, patchProduct, (req, res) => {
    try {
        res.status(200).json(req.updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product/{id}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authenticate, isOwner, deleteProduct, (req, res) => {
    try {
        res.status(200).json(req.deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/product/{id}/restore:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   format: uuid
 *                   description: Must be an ObjectId and is required
 *                 name:
 *                   type: string
 *                   description: Must be a string and is required
 *                 description:
 *                   type: string
 *                   description: Must be a string
 *                 imageURL:
 *                   type: string
 *                   maxLength: 512
 *                   description: Must be a string
 *                 magnetLink:
 *                   type: string
 *                   description: Must be a string and a magnet link
 *                 othersUrl:
 *                   type: array
 *                   description: A list of related URLs for the product
 *                   items:
 *                     type: string
 *                 title:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to a Title
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of ObjectId references to Tags
 *                 owner:
 *                   type: string
 *                   format: uuid
 *                   description: ObjectId reference to the product owner
 *                 version:
 *                   type: string
 *                   maxLength: 40
 *                   description: Must be a string and is required
 *                 deleted:
 *                   type: boolean
 *                   description: Indicates if the product is deleted
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.patch("/:id/restore", authenticate, isOwner, restoreProduct, (req, res) => {
    try {
        res.status(200).json(req.restoredProd);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/products/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ObjectId of the product to permanently delete
 *     responses:
 *       200:
 *         description: Product permanently deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product permanently deleted
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     imageURL:
 *                       type: string
 *                     magnetLink:
 *                       type: string
 *                     othersUrl:
 *                       type: array
 *                       items:
 *                         type: string
 *                     title:
 *                       type: string
 *                       format: uuid
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     owner:
 *                       type: string
 *                       format: uuid
 *                     version:
 *                       type: string
 *                     deleted:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: number
 *       400:
 *         description: Invalid input or server error
 *       403:
 *         description: Forbidden - only the owner or admin can delete
 *       404:
 *         description: Product not found
 */
router.delete('/products/:id/permanent', authenticate, isOwnerOrAdmin, permanentDeleteProduct, (req, res) => {
    try {
        res.status(200).json({ message: 'Product permanently deleted', data: req.permanentlyDeletedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
