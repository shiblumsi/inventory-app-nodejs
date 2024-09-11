const express = require("express")
const authController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware")

router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.post('/update-password', authMiddleware.protected, authController.updatePassword)

module.exports = router