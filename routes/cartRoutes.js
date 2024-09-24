const express = require('express');
const authHandler = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authHandler.protected);

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);

// Routes for updating item quantity
router.patch('/increase', cartController.increaseQuantity);
router.patch('/decrease', cartController.decreaseQuantity);

// Routes for removing items
router.delete('/remove', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

router.put('/update', cartController.updateCartItem);

module.exports = router;
