const multer = require('multer');
const path = require('path');

// Specify the storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the folder where the files should be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Ensure unique file name
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Multer upload middleware
const upload = multer({ storage });

module.exports = upload;