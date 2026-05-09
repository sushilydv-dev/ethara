const express = require("express");
const { signup, login } = require("../controllers/auth.controller");

const router = express.Router();

// Keep these for your current frontend (it calls /signup and /login)
router.post("/signup", signup);
router.post("/login", login);

// Also provide a cleaner API prefix for later if you want
router.post("/api/auth/signup", signup);
router.post("/api/auth/login", login);

module.exports = router;

