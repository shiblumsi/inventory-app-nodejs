const express = require("express")
const categoryController = require('../controllers/categoryController')
const authHandler = require('../middlewares/authMiddleware')

const router = express.Router()


router.use(authHandler.protected, authHandler.restrictTo('admin'));

router
  .route('/')
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory)

router
  .route('/:id')
  .get(categoryController.getSingleCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)


module.exports = router