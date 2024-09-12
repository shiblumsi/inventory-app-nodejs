const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
// const otpRoutes = require('./routes/otpRoutes')
const AppError = require("./utils/appError")
const globalErrorHandler = require("./middlewares/globalErrorHandler")

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');



dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors());


// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'service', 'swagger.yaml'));

// Middleware to serve Swagger UI

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/payment', paymentRoutes)
// app.use('/api/v1/otp', otpRoutes)

app.get('/',(req,res)=>{
    res.json({status:'ok', message:"Hi there"})
})

//Path Not Found Middleware
app.all('*', (req, res, next)=>{
    next (new AppError(`Can't find ${req.originalUrl} on this server...🥱`))
})

// Global Error Handling Middleware
app.use(globalErrorHandler)



module.exports = app