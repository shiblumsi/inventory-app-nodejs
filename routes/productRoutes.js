const express = require("express")
const productController = require('../controllers/productController')
const authHandler = require("../middlewares/authMiddleware")
const router = express.Router()
const uploads = require('../utils/multerConfig')



router
  .route('/')
  .get(authHandler.protected, productController.getAllProduct)
  .post(authHandler.adminRequired,uploads.productFileUpload.array('images', 10),productController.createProduct)


router.use(authHandler.adminRequired);

// Routes for handling files related to products
router.post('/:productId/files',uploads.productFileUpload.array('images', 10), productController.uploadFiles);
router.get('/:productId/files', productController.getIFilesByProduct);
router.delete('/file/:fileId', productController.deleteFiles);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)


module.exports = router
