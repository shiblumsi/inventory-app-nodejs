const express = require("express")
const productController = require('../controllers/productController')
const authHandler = require("../middlewares/authMiddleware")
const router = express.Router()





router
  .route('/')
  .get(authHandler.protected, productController.getAllProduct)
  .post(authHandler.protected,authHandler.restrictTo('admin'),productController.createProduct)


  
router.use(authHandler.protected, authHandler.restrictTo('admin'));
router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)


module.exports = router
