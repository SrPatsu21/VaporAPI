const express = require("express");
const router = express.Router();

const userRoute = require("./user");
router.use("/user", userRoute);

const { login, refreshToken } = require("./authController");
router.use("/login", login);
router.use("/refreshToken", refreshToken)

module.exports = router