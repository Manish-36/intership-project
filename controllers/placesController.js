const Place = require("../models/placesModel");
const User = require("../models/userModel");

exports.addNewPlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Only admins can create a place!",
      });
    }

    const {
      tourType,
      additionalDetails,
      title,
      address,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    console.log(req.body);

    if (
      !title ||
      !additionalDetails ||
      !address ||
      !description ||
      !perks ||
      !extraInfo ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const photos = req.files?.map((file) => file.path);

    if (!photos) {
      return res.status(400).json({
        success: false,
        message: "Please add one photo",
      });
    }

    const place = await Place.create({
      tourType,
      additionalDetails,
      title,
      address,
      description,
      photos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      data: place,
      message: "New Place added!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPlaces = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const places = await Place.find({ owner: userId }).populate("owner");

    return res.status(200).json({
      success: true,
      data: places,
      message: "Places data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewPlace = async (req, res) => {
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
    const place = await Place.findById(id).populate("owner");
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add a new one.",
      });
    }
    return res.status(200).json({
      success: true,
      data: place,
      message: "Fetched place data!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterPlaces = async (req, res) => {
  try {
    const { tourType, budget } = req.query;

    if (!tourType) {
      return res.status(400).json({
        success: false,
        message: "Tour type is required",
      });
    }

    const filter = { tourType };

    if (budget) {
      filter.price = { $lte: budget }; // only include places where price <= budget
    }

    const places = await Place.find(filter).populate("owner");

    if (places.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No places found for this tour type and budget",
      });
    }

    res.status(200).json({
      success: true,
      data: places,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.updatePlace = async (req, res) => {
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
        message: "No Place found. Please add a new one.",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Only admins can update a place!",
      });
    }

    const {
      title,
      address,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;

    const photos = req.file?.path;

    place.title = title || place.title;
    place.address = address || place.address;
    place.description = description || place.description;
    place.photos = photos || place.photos;
    place.perks = perks || place.perks;
    place.extraInfo = extraInfo || place.extraInfo;
    place.checkIn = checkIn || place.checkIn;
    place.checkOut = checkOut || place.checkOut;
    place.maxGuests = maxGuests || place.maxGuests;

    await place.save();

    return res.status(200).json({
      success: true,
      data: place,
      message: "Place updated.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePlace = async (req, res) => {
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
        message: "No Place found. Please add a new one.",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Only admins can delete this place!",
      });
    }

    await place.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Place deleted.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
