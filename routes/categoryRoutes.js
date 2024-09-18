const express = require("express")
const categoryController = require('../controllers/categoryController')
const authHandler = require('../middlewares/authMiddleware')
const uploads = require('../utils/multerConfig')
const categoryFileController = require('../controllers/categoryFileController')

const router = express.Router()


router.post('/:categoryId/files', uploads.categoryFileUpload.array('images', 5), categoryFileController.uploadFiles)
router.use(authHandler.adminRequired);

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