const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { prisma } = require('../DB/db.config');
const { promisify } = require('util');

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please log in to get access...😎'));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if the user is an admin or regular user based on the token's role
  console.log(decoded)
  if (decoded.role === 'ADMIN') {
    req.user = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });
    req.user.isAdmin = true;  // Add this flag to distinguish
  } else {
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    req.user.isAdmin = false; // Add this flag to distinguish
  }


  next();
});

// exports.restrictTo = (...roles)=>{
//     return (req, res, next)=>{
//         if(!roles.includes(req.user.role)){
//             next(new AppError('Only admin can access!!!'))
//         }
//         next()
//     }
// }

exports.adminRequired = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please log in to get access...🚫'));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded data', decode);

  if (!decode.role || decode.role !== 'ADMIN') {
    return next(
      new AppError('You do not have permission to access this route...🕵️‍♀️', 403)
    );
  }

  if (decode.role === 'ADMIN') {
    req.admin = await prisma.admin.findUnique({
      where: { id: decode.id },
    });
  }

  next();
});
