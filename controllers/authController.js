const {prisma} = require("../DB/db.config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")


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
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = await prisma.user.findUnique({where:{email}})
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