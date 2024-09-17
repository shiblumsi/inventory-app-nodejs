// routes/productRoutes.js
const express = require('express');
const productFileController = require('../controllers/productFileController');
const uploads = require('../utils/multerConfig')
const router = express.Router();


// Routes for handling images related to products
router.post('/:productId/files',uploads.productFileUpload.array('images', 10), productFileController.uploadFiles);
// router.get('/:productId/images', imageController.getImagesByProduct);
// router.delete('/images/:imageId', imageController.deleteImage);

module.exports = router;
