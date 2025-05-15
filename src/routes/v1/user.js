const express = require('express');
const {authenticate, isAdmin} = require('./authController.js')
const {createUser, patchUser, updateUser, changePassword,
        softDeleteUser, restoreUser, getUser,
        searchUser, authorizeSelf, adminControler} = require('../../middleware/v1/user.js')

const router = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       description: User information for creation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - passwordConfirm
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 deleted:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
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
 */
router.post("", createUser, async (req, res) => {
    try {
        res.status(201).json(req.createdUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       201:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 deleted:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       400:
 *         description: User not found
 *       404:
 *         description: User not found
 */
router.get("/:id", getUser, async (req, res) => {
    try {
        res.status(201).json(req.foundUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update user completely (replace) (Self only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: New user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 deleted:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
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
 *         description: Forbidden (Invalid or expired token)
 *       404:
 *         description: User not found
 */
router.put("/:id", authenticate, authorizeSelf, updateUser, async (req, res) => {
    try {
        res.status(201).json(req.updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/v1/user/profile/{id}:
 *   patch:
 *     summary: Update user partially (Self only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User partially updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 deleted:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
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
 *         description: Forbidden (Invalid or expired token)
 *       404:
 *         description: User not found
 */
router.patch("/profile/:id", authenticate, authorizeSelf, patchUser, async (req, res) => {
    try {
        res.status(201).json(req.patchedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user/changepassword/{id}:
 *   patch:
 *     summary: Change user password (Self only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: Password change data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - newPasswordConfirm
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password of the user
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *               newPasswordConfirm:
 *                 type: string
 *                 description: Confirmation of the new password
 *     responses:
 *       201:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request (Validation failed)
 *       401:
 *         description: Unauthorized (Old password incorrect)
 *       404:
 *         description: User not found
 */
router.patch("/changepassword/:id", authenticate, authorizeSelf, changePassword, async (req, res) => {
    try {
        res.status(201).json({message: "Password changed"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user/softdelete/{id}:
 *   patch:
 *     summary: Soft delete (deactivate) a user (Self only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to deactivate
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deactivated
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     deleted:
 *                       type: boolean
 *                     isAdmin:
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
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Invalid or expired token)
 *       404:
 *         description: User not found
 */
router.patch("/softdelete/:id", authenticate, authorizeSelf, softDeleteUser, async (req, res) => {
    try {
        res.status(201).json("User deactivated while you have this token you can still acess: " + req.softDeletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//? ADMIN ONLY?
//? how use?
/**
 * @swagger
 * /api/v1/user/restoreuser/{id}:
 *   patch:
 *     summary: Restore (reactivate) a soft-deleted user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to restore
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     isAdmin:
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
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Admins only)
 *       404:
 *         description: User not found
 */
router.patch("/restoreuser/:id", authenticate, isAdmin, restoreUser, async (req, res) => {
    try {
        res.status(201).json("User activated: " + req.restoreUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Search users (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: isAdmin
 *         schema:
 *           type: boolean
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
 *       201:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   deleted:
 *                     type: boolean
 *                   isAdmin:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: number
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Invalid or expired token)
 *       400:
 *         description: Bad request
 */
router.get("", authenticate, isAdmin, searchUser, async (req, res) => {
    try {
        res.status(201).json(req.foundUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/user/admin/{id}:
 *   patch:
 *     summary: Set user as admin or not (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: Admin status data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAdmin
 *             properties:
 *               isAdmin:
 *                 type: boolean
 *                 description: Set to true to make user admin, false to revoke
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deactivated
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     deleted:
 *                       type: boolean
 *                     isAdmin:
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
 *         description: Bad request (Invalid input)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       403:
 *         description: Forbidden (Invalid or expired token)
 *       404:
 *         description: User not found
 */
router.patch("/admin/:id", authenticate, isAdmin, adminControler, async (req, res) => {
    try {
        res.status(201).json(req.patched);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;