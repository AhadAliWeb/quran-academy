const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");

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


module.exports = { uploadMultipleImages }