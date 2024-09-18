const express = require('express')
const adminOrderController = require('../controllers/admin/adminOrderController')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')


router.use(authMiddleware.adminRequired)

router.get('/orders', adminOrderController.getAllOrders)
router.patch('/order/:orderId', adminOrderController.updateOrder)
router.get('/order/sales-report', adminOrderController.getSalesReports)
router.get('/user/:userId/orders', adminOrderController.getCustomerOrders)
router.get('/reports/revenue', adminOrderController.getMonthlyRevenue);

module.exports = router