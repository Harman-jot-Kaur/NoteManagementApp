"use strict";

const router = require("express").Router();
const {
  signup,
  login,
  signupValidation,
  loginValidation,
} = require("../controllers/authController");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;
