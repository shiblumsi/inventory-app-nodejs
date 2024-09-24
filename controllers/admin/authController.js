const catchAsync = require('../../utils/catchAsync');
const { prisma } = require('../../DB/db.config');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');
const jwt = require('jsonwebtoken');

exports.adminSignup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash: hashPassword,
    },
  });
  res.status(201).json({
    admin,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return next(new AppError('Admin not found!!!', 404));
  }
  const isPasswardValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswardValid) {
    return next(new AppError('Password not valid!!!', 401));
  }

  const token = jwt.sign(
    { id: admin.id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIREIN }
  );

  return res.status(200).json({
    status: 'success',
    token,
  });
});
