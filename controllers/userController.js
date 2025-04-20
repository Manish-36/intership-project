const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }
    const bookings = await Booking.find({ owner: userId });
    return res.status(200).json({
      success: true,
      data: user,
      bookings,
      message: "User profile data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
