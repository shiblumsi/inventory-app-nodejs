const express = require("express");
const adminController = require('../controllers/admin/authController');

const router = express.Router();


router.post('/register', adminController.adminSignup)
router.post('/login', adminController.login)



module.exports = router