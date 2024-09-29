const { prisma } = require('../DB/db.config');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {sendEmail} = require('../service/sendEmail')

exports.createTicket = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  console.log(req.user);

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      user: { connect: { id: req.user.id } },
      status: 'OPEN',
    },
  });
  if (!ticket) {
    return next(new AppError('creation failed', 500));
  }

  return res.status(201).json({
    status: 'success',
    data: ticket,
  });
});

exports.getTicketById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select:{
          name:true,
          email:true
        }
      },
      messages: {
        select:{
          senderType:true,
          message:true
        }
      } 
    },
  });

  if (!ticket) {
    return next(new AppError(`No ticket found with ID ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: ticket,
  });
});

exports.getAllTickets = catchAsync(async (req, res, next) => {
  const tickets = await prisma.ticket.findMany({
    include: {
      user: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: tickets,
  });
});

exports.updateTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });

  if (!ticket) {
    return next(new AppError(`No ticket found with ID ${id}`, 404));
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: parseInt(id) },
    data: {
      status,
    },
    include: {
      user: true,
    },
  });
  const message = `solved your problem!!!`;
  if(status === 'RESOLVED'){
    try {
        await sendEmail({
          email: ticket.user.email,
          subject: 'problem solved',
          message,
        });
    
        return res.status(200).json({
          status: 'success',
          message: 'message sent to user email!',
          data:updatedTicket
        });
      } catch (error) {
        console.log('qqqqqq', error);
    
        return next(
          new AppError(
            'There was an error sending the email. Try again later!',
            500
          )
        );
      }
  }
  return res.status(200).json({
    status: 'success',
    data:updatedTicket
  });
});



exports.createMessage = catchAsync(async (req, res, next) => {
  const { ticketId, message } = req.body;
  const senderType = req.user.isAdmin ? 'ADMIN' : 'USER'; // Check if the user is an admin
  
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(ticketId) },
  });
  
  if (!ticket) {
    return next(new AppError(`No ticket found with ID ${ticketId}`, 404));
  }

  const ticketMessage = await prisma.ticketMessage.create({
    data: {
      ticketId: parseInt(ticketId),
      senderType,
      message,
    },
  });

  res.status(201).json({
    status: 'success',
    data: ticketMessage,
  });
});

exports.getMessagesByTicketId = catchAsync(async (req, res, next) => {
  const { ticketId } = req.params;

  const messages = await prisma.ticketMessage.findMany({
    where: { ticketId: parseInt(ticketId) },
    orderBy: { createdAt: 'asc' },
  });

  if (!messages.length) {
    return next(new AppError(`No messages found for ticket ID ${ticketId}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: messages,
  });
});
