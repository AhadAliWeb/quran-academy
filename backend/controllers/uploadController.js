const streamifier = require("streamifier");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const asyncHandler = require("express-async-handler");


const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "my_uploads" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadPromises = req.files.map(file => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);

    res.json({
      urls: results.map(r => r.secure_url),
      details: results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads", // optional folder
    });

    // Clean up local file after upload
    fs.unlinkSync(req.file.path);

    res.status(StatusCodes.OK).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Upload failed", error: error.message });
  }
});


const deleteImage = asyncHandler(async (req, res) => {
  const { public_id } = req.params; // expect client to send public_id

  if (!public_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "public_id is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Image not found or already deleted" });
    }

    res.status(StatusCodes.OK).json({
      message: "Image deleted successfully",
      result,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Deletion failed", error: error.message });
  }
});


const uploadPDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No PDF file uploaded" });
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // for non-image files like pdf/docx/zip
      folder: "pdfs",       // optional folder in cloudinary
    });

    // Delete file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.status(StatusCodes.OK).json({
      message: "PDF uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "PDF upload failed", error: error.message });
  }
});


const deletePDF = asyncHandler(async (req, res) => {
  const { public_id } = req.params; // assume client sends public_id in route param

  if (!public_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "public_id is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw",
    });

    if (result.result !== "ok") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "PDF not found or already deleted" });
    }

    res.status(StatusCodes.OK).json({
      message: "PDF deleted successfully",
      result,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "PDF deletion failed", error: error.message });
  }
});


module.exports = { uploadMultipleImages, uploadImage, deleteImage, uploadPDF, deletePDF }