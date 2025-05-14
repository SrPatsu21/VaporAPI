const express = require("express");
const router = express.Router();

//* routes

const { login, refreshToken } = require("./authController");
router.use("/login", login);
router.use("/refreshToken", refreshToken)

const userRoute = require("./user");
router.use("/user", userRoute);

const categoryRoute = require("./category")
router.use("/category", categoryRoute)

const tagRoute = require("./tag")
router.use("/tag", tagRoute)

const titleRoute = require("./title")
router.use("/title", titleRoute)

const productRoute = require("./product")
router.use("/product", productRoute)

const imageRoute = require("./image")
router.use("/image", imageRoute)

const SuggestionRoute = require("./suggestion")
router.use("/suggestion", SuggestionRoute)

module.exports = router