const express = require("express")
const categoryController = require('../controllers/categoryController')
const authHandler = require('../middlewares/authMiddleware')
const uploads = require('../utils/multerConfig')

const router = express.Router()


router.use(authHandler.adminRequired);


router.post('/:categoryId/files', uploads.categoryFileUpload.array('images', 5), categoryController.uploadFiles)
router.get('/:categoryId/files', categoryController.getIFilesByCategory);
router.delete('/file/:fileId', categoryController.deleteFiles);


router
  .route('/')
  .get(categoryController.getAllCategory)
  .post(uploads.categoryFileUpload.array('images', 5),categoryController.createCategory)

router
  .route('/:id')
  .get(categoryController.getSingleCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)


module.exports = router