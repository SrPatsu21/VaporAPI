const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
router.use("/user", userRoute);

const { login } = require("./authController");
router.use("/login", login);

module.exports = router