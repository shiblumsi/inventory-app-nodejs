const express = require('express');
const ticketController = require('../controllers/ticketController');
const authHandler = require('../middlewares/authMiddleware');

router = express.Router();

router.post('/create', authHandler.protected, ticketController.createTicket);
router.get('/get', authHandler.protected, ticketController.getAllTickets);
router.get('/get/:id', authHandler.protected, ticketController.getTicketById);
router.put('/update/:id', authHandler.protected, ticketController.updateTicket);

router.post('/message', authHandler.protected, ticketController.createMessage);
router.get('/messages/:ticketId', authHandler.protected, ticketController.getMessagesByTicketId);


module.exports = router;
