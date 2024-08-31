const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const AppError = require("./utils/appError")
const globalErrorHandler = require("./middlewares/globalErrorHandler")


dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

//Path Not Found Middleware
app.all('*', (req, res, next)=>{
    next (new AppError(`Can't find ${req.originalUrl} on this server...🥱`))
})

// Global Error Handling Middleware
app.use(globalErrorHandler)

module.exports = app