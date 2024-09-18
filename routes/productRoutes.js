const express = require("express")
const productController = require('../controllers/productController')
const authHandler = require("../middlewares/authMiddleware")
const router = express.Router()





router
  .route('/')
  .get(authHandler.protected, productController.getAllProduct)
  .post(authHandler.adminRequired,productController.createProduct)


  
router.use(authHandler.adminRequired);
router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)


module.exports = router
