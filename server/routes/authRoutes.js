const express = require("express");
const router = express.Router();
const { register, loginUser, getUserProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Routes
router.post("/register", register);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);

module.exports = router;