const express = require("express");
const multer = require("multer");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");

const { isAuthenticated } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Register User
router.post("/register", upload.single("profilePic"), register);

//Login User
router.post("/login", login);

//Logout User
router.get("/logout", isAuthenticated, logout);

module.exports = router ;