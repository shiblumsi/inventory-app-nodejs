const express = require('express');
const orderController = require('../controllers/orderController');
const authHandler = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authHandler.protected);
router.post('/place-order', orderController.createOrder);

module.exports = router;
