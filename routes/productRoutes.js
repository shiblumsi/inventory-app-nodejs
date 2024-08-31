const express = require("express")
const productController = require('../controllers/productController')

const router = express.Router()


router
  .route('/')
  .get(productController.getAllProduct)
  .post(productController.createProduct)

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)


module.exports = router