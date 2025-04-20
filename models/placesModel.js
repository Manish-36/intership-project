const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const packageSchema = new Schema({
  name: String,
  costPerNight: Number,
  maxGuests: Number,
});

const placeSchema = new Schema(
  {
    tourType: {
      type: String,
      enum: ["Kashmir Tours", "Manali Tours", "Ladakh Tours"],
    },
    additionalDetails: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photos: [String],
    description: {
      type: String,
    },
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packages: [packageSchema],
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
