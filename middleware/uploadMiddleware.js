const multer = require("multer");
const path = require("path");

// Set up storage destination and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images"); // Folder tempat menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Penamaan file
  },
});

// Filter to accept image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

// Limit file size to 5MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
