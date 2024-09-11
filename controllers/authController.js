const {prisma} = require("../DB/db.config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { createResetToken } = require("../utils/createResetToken")
const {sendEmail} = require('../service/sendEmail')


exports.register = catchAsync(async (req, res, next)=>{
    const {name, email, password, confirmPassword, role} = req.body
    const user = await prisma.user.findUnique({where:{email}})
    if(user){
        return next(new AppError('User already has been taken! Try with another email',400))
    }
    if(password !== confirmPassword){
        return next(new AppError('Password not matched!'))
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await prisma.user.create({
        data:{name, email, passwordHash:hashedPassword, role}
    })
    const token = jwt.sign({id:newUser}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIREIN})

    return res.status(201).json({
        status:'success',
        token
    })
})


exports.login = catchAsync(async (req, res, next)=>{
    const {email, password} = req.body
    console.log(email, password)
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = await prisma.user.findUnique({where:{email}})
    console.log(user);
    
    if (!user) {
        return next(new AppError('No user found with this email!', 401));
    }
    const isPasswardValid = await bcrypt.compare(password, user.passwordHash)
    if(!isPasswardValid){
        return next(new AppError('Password not matched!', 401))
    }

    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIREIN}) 

    return res.status(200).json({
        status:'ok',
        token
    })
})


exports.forgotPassword = catchAsync(async (req, res,next)=>{
    const user = await prisma.user.findUnique({
        where:{email:req.body.email}
    })
    
    
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
      }
    const resetToken = await createResetToken(user)
    console.log(resetToken);

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email:user.email,
            subject: 'Password Reset Token, Valid For 10 Minutes!',
            message
        })

        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
          });
    } catch (error) {
       
        console.log('qqqqqq',error);
        
        return next( new AppError('There was an error sending the email. Try again later!', 500))
    }
})


exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    // Find the user by the hashed token and check expiration
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gte: new Date() // Ensures token is not expired
        }
      }
    });
  
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
  
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }
  
    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
  
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash : hashedPassword,
        passwordResetToken: null, // Clear reset token and expiration
        passwordResetExpires: null
      }
    });
  
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully!'
    });
  });



exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, againNewPassword } = req.body;

    // 1. Get the currently logged-in user
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // 2. Check if the provided current password is correct
    const isCorrectPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCorrectPassword) {
        return next(new AppError('Your current password is incorrect', 401));
    }

    // 3. Check if the new passwords match
    if (newPassword !== againNewPassword) {
        return next(new AppError('New passwords do not match', 400));
    }

    // 4. Hash the new password and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
        passwordHash: hashedNewPassword
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully!'
    });
});
  
  

  