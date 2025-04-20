const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Login Again.",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated. Login Again.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isAuthorized = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Login Again.",
      });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "User cannot access this route. This route is for admins only.",
      });
    }

    next();
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
