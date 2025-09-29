const express = require("express");
const multer = require("multer");
const { uploadMultipleImages } = require("../controllers/uploadController.js");

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route
router.post("/image", upload.array("images", 10), uploadMultipleImages);

module.exports = router;
