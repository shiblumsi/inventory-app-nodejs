const express = require('express');
const orderController = require('../controllers/orderController');
const authHandler = require('../middlewares/authMiddleware');
const router = express.Router();

//router.use(authHandler.protected)
router.post('/success', orderController.paymentSuccess);
router.post('/fail', orderController.paymentFail);
router.post('/cancel', orderController.paymentCancel);

module.exports = router;
