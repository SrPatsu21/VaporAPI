const express = require('express');
const {authenticate, isAdmin} = require('./authController.js')
const {createCategory, getCategory, updateCategory,
    searchCategory, deleteCategory } = require('../../middleware/v1/category.js')

const router = express.Router();

//! ADMIN ONLY
//* Create a new category
//change the token!
/*
curl -k -X POST https://localhost/api/v1/category/ \
    -H "Authorization: Bearer TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{
        "categorySTR": "Game",
    }
*/
router.post("/", createCategory, async (req, res) => {
    try {
        res.status(201).json(req.createdCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* Get category
/*
curl -k -X GET https://localhost/api/v1/category/CATEGORY_ID \
    -H "Content-Type: application/json"
*/
router.get("/:id", getCategory, async (req, res) => {
    try {
        res.status(201).json(req.foundCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//! ADMIN ONLY
//* Update category
//change the id and token!
/*
curl -k -X PUT https://localhost/api/v1/category/CATEGORY_ID \
    -H "Authorization: Bearer TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -d '{
        "categorySTR": "Game",
    }'
*/
router.put("/:id", updateCategory, async (req, res) => {
    try {
        res.status(201).json(req.updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//* search category
/*
curl -k -X GET "https://localhost/api/v1/category/?categorySTR=Game&limit=1&skip=1" \
    -H "Content-Type: application/json"
*/
router.get("/", searchCategory, async (req, res) => {
    try {
        res.status(201).json(req.foundCategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//! ADMIN ONLY
//* delete user
//change the id and TOKEN!
/*
curl -k -X DELETE https://localhost/api/v1/category/CATEGORY_ID \
    -H "Authorization: Bearer TOKEN_HERE" \
    -H "Content-Type: application/json"
*/
router.delete("/:id", deleteCategory, async (req, res) => {
    try {
        res.status(201).json(req.deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;