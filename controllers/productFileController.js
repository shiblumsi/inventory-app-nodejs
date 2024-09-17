// controllers/imageController.js
const multer = require('../utils/multerConfig');
const { prisma } = require('../DB/db.config');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Upload images
exports.uploadFiles = catchAsync(async (req, res, next) => {
  // console.log('Uploaded files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }


    const filePaths = req.files.map((file) => file.path);
    const productId = req.params.productId;

    const files = await prisma.productImage.createMany({
      data: imagePaths.map((path) => ({
        url: path,
        productId: parseInt(productId),
      })),
    });

    return res.status(201).json({
      status: 'success',
      files,
      file_path:filePaths
    });
  })
;

// // Delete image
// exports.deleteImage = catchAsync(async (req, res, next) => {
//   const { imageId } = req.params;

//   const image = await prisma.productImage.findUnique({
//     where: { id: parseInt(imageId) },
//   });

//   if (!image) {
//     return next(new AppError('Image not found', 404));
//   }

//   // Delete image from file system
//   await unlinkFile(image.url);

//   // Delete image from the database
//   await prisma.image.delete({
//     where: { id: parseInt(imageId) },
//   });

//   return res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// // Retrieve images by product
// exports.getImagesByProduct = catchAsync(async (req, res, next) => {
//   const { productId } = req.params;

//   const images = await prisma.image.findMany({
//     where: { productId: parseInt(productId) },
//   });

//   if (!images || images.length === 0) {
//     return next(new AppError('No images found for this product', 404));
//   }

//   return res.status(200).json({
//     status: 'success',
//     data: images,
//   });
// });
