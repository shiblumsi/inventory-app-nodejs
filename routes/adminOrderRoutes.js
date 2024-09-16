const express = require('express')
const adminOrderController = require('../controllers/adminOrderController')
const router = express.Router()



router.get('/orders', adminOrderController.getAllOrders)
router.patch('/order/:orderId', adminOrderController.updateOrder)
router.get('/order/sales-report', adminOrderController.getSalesReports)
router.get('/user/:userId/orders', adminOrderController.getCustomerOrders)
router.get('/reports/revenue', adminOrderController.getMonthlyRevenue);

module.exports = router