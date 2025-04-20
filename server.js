const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const Place = require("./models/placesModel");

//route handlers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const placesRoutes = require("./routes/placesRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);
app.use(cookieParser());

//connection with MongoDb
connectDB();

//route handlers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", async (req, res) => {
  try {
    const places = await Place.find({}).populate("owner");
    return res.status(200).json({
      success: true,
      data: places,
      message: "Places data fetched",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
