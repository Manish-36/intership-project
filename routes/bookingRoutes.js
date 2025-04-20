const express = require("express");
const router = express.Router();

const {
  addNewBooking,
  getBooking,
  viewBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const { isAuthenticated } = require("../middleware/auth");

router.post("/:id", isAuthenticated, addNewBooking);
router.get("/", isAuthenticated, getBooking);
router.get("/:id", isAuthenticated, viewBooking);
router.delete("/:id", isAuthenticated, deleteBooking);

module.exports = router ;
