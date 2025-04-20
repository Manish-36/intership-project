const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middleware/auth");
const { getUserProfile } = require("../controllers/userController");

router.get("/profile", isAuthenticated, getUserProfile);

module.exports = router;
