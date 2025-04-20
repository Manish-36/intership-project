const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  addNewPlace,
  getPlaces,
  filterPlaces,
  viewPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placesController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post(
  "/",
  upload.array("photos", 100),
  isAuthenticated,
  isAuthorized,
  addNewPlace
);
router.get("/", isAuthenticated, getPlaces);
router.get("/filter", isAuthenticated, filterPlaces);
router.get("/:id", isAuthenticated, viewPlace);
router.put("/:id", isAuthenticated, isAuthorized, updatePlace);
router.delete("/:id", isAuthenticated, isAuthorized, deletePlace);

module.exports = router;
