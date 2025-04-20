const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { isAuthenticated } = require("../middleware/auth");

router.post("/:id/new", isAuthenticated, createReview);

router.get("/:id", isAuthenticated, getReviews);

router.delete("/:id/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
