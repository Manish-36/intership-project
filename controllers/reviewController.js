const User = require("../models/userModel");
const Place = require("../models/placesModel");
const Review = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admins cannot review places.",
      });
    }

    const { id } = req.params;

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    const { body, rating } = req.body;
    if (!body || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const addReview = await Review.create({
      body,
      rating,
      placeId: place._id,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      data: addReview,
      message: "New Review created!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Login Again.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found.",
      });
    }

    const review = await Review.find({ placeId: id })
      .populate("createdBy")
      .populate("placeId");

    return res.status(200).json({
      success: true,
      data: review,
      messsage: "Review data fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    const { id, reviewId } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found.",
      });
    }

    const review = await Review.findById(reviewId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Review found.",
      });
    }

    //check if the user is authorized to delete this place
    if (review.createdBy._id.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to delete this review",
      });
    }

    await review.deleteOne({ _id: reviewId });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
