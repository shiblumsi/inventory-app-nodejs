const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')
const {prisma} = require('../DB/db.config')
const {promisify} = require('util')

exports.protected = catchAsync(async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('Please log in to get access...😎'))
    }
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await prisma.user.findUnique({where:{id:decode.id}})
    req.user = currentUser

    next()

})