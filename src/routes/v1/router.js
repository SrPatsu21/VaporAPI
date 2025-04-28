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

module.exports = router