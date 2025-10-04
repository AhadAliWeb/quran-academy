const express = require("express");
const { uploadMultipleImages, uploadImage, deleteImage, uploadPDF, deletePDF } = require("../controllers/uploadController.js");

const router = express.Router();

// Multer setup
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" }); // temporary local storage


// Route
router.post("/images", upload.array("images", 10), uploadMultipleImages);
router.post("/image", upload.single("image"), uploadImage);
router.post("/pdf", upload.single("pdf"), uploadPDF)
router.delete("/pdf/:public_id", deletePDF)

router.delete("/image/:public_id", deleteImage)

module.exports = router;
