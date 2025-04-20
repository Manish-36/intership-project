const Booking = require("../models/bookingModel");
const Place = require("../models/placesModel");
const User = require("../models/userModel");

exports.addNewBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add one.",
      });
    }

    // Get data from body
    const { name, email, checkIn, checkOut, maxGuests } = req.body;

    // Basic validation
    if (!name || !email || !checkIn || !checkOut || !maxGuests) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required details.",
      });
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in.",
      });
    }

    // Calculate total price
    const totalPrice = place.price * nights * maxGuests;

    // Create booking
    const booking = await Booking.create({
      owner: userId,
      placeId: place._id,
      name,
      email,
      checkIn,
      checkOut,
      maxGuests,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: " + err.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    const booking = await Booking.find({ owner: userId })
      .populate("owner")
      .populate("placeId");
    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("owner")
      .populate("placeId");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No Booking found.",
      });
    }

    //check whether the user is authorized to delete this booking
    if (booking.owner._id.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to delete this booking.",
      });
    }

    await booking.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
