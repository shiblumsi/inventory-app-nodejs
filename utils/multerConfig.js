const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directory exists
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // Create the directory recursively
  }
};

// Set storage with dynamic folder for images or PDFs
const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine if the file is an image or a PDF
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      // Choose subfolder based on the file type
      const subFolder = /pdf/.test(file.mimetype) ? 'pdf' : 'image';
      const folderPath = `uploads/${folder}/${subFolder}/`;

      // Ensure the folder exists
      createFolderIfNotExists(folderPath);

      // Store the file in the appropriate subfolder
      cb(null, folderPath);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed.'));
  }
};

// Multer upload for product, category images, and PDFs
const productFileUpload = multer({
  storage: storage('product'),
  fileFilter
});

const categoryFileUpload = multer({
  storage: storage('category'),
  fileFilter
});



module.exports = {
  productFileUpload,
  categoryFileUpload
};
