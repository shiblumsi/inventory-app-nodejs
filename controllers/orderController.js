const SSLCommerzPayment = require('sslcommerz-lts');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { prisma } = require('../DB/db.config');

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox
const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
let tran_id = '';

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const addressId = 1;
  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { cartItems: { include: { product: true } } },
  });

  if (!cart || cart.cartItems.length === 0) {
    return next(new AppError('Your cart is empty', 400));
  }

  let totalAmount = 0;
  cart.cartItems.forEach((item) => {
    totalAmount += item.product.price * item.quantity;
  });

  const transactionId = `tx_${Date.now()}`;
  const data = {
    total_amount: totalAmount,
    currency: 'BDT',
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `${process.env.SSL_SUCCESS_URL}`,
    fail_url: `${process.env.SSL_FAIL_URL}`,
    cancel_url: `${process.env.SSL_CANCEL_URL}`,
    ipn_url: 'http://localhost:8000/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'shiblu',
    cus_email: 'shiblu@example.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01772115060',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  console.log(data);
  tran_id = data.tran_id;

  sslcz
    .init(data)
    .then(async (apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      console.log('Redirecting to: ', GatewayPageURL);
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount: totalAmount,
          paymentMethod: 'SSLCommerz',
          status: 'Pending',
          transactionId,
        },
      });

      const order = await prisma.order.create({
        data: {
          userId,
          addressId,
          paymentId: payment.id,
          totalAmount,
          status: 'Pending',
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      //delete cartItems after order
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return res.status(200).json({
        status: 'success',
        paymentUrl: GatewayPageURL,
      });
    })
    .catch((err) => {
      console.error('Error:', err);
      return next(new AppError('Payment initialization error', 500));
    });
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  const data = {
    val_id: req.body.val_id,
  };
  const paymentVerification = await sslcz.validate(data);
  console.log(paymentVerification);

  if (paymentVerification.status === 'VALID') {
    await prisma.payment.update({
      where: { transactionId: tran_id },
      data: { status: 'Completed' },
    });

    await prisma.order.updateMany({
      where: { payment: { transactionId: tran_id } },
      data: { status: 'Confirmed' },
    });

    const orders = await prisma.order.findMany({
      where: { payment: { transactionId: tran_id } },
      include: { orderItems: true }, // Include the orderItems relation
    });

    // Update the product stock based on the ordered quantity
    for (const order of orders) {
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // Decrease stock by the quantity in the order
            },
          },
        });
      }
    }
    return res.status(200).json({
      status: 'success',
      message: 'Payment successful and order confirmed',
    });
  } else {
    return next(new AppError('Payment verification failed', 500));
  }
});

exports.paymentFail = catchAsync(async (req, res, next) => {
  //const { tran_id } = req.body;

  // Update payment status to 'Failed'
  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: { status: 'Failed' },
  });

  // Update order status to 'Failed'
  await prisma.order.updateMany({
    where: { payment: { transactionId: tran_id } },
    data: { status: 'Failed' },
  });

  return res.status(400).json({
    status: 'fail',
    message: 'Payment failed',
  });
});

exports.paymentCancel = catchAsync(async (req, res, next) => {
  //const { tran_id } = req.body;

  // Update payment status to 'Canceled'
  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: { status: 'Canceled' },
  });

  // Update order status to 'Canceled'
  await prisma.order.updateMany({
    where: { payment: { transactionId: tran_id } },
    data: { status: 'Canceled' },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Payment canceled',
  });
});
