const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoute')
// const otpRoutes = require('./routes/otpRoutes')

const passport = require('./service/passport');
const session = require('express-session');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
const { googleCallback } = require('./controllers/oAuthController');

const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: '*',
  })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Load Swagger YAML file
const swaggerDocument = YAML.load(
  path.join(__dirname, 'service', 'swagger.yaml')
);

// Middleware to serve Swagger UI

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: '/swagger-ui.css',
    customJsUrl: '/swagger-ui-bundle.js',
    customJs: '/swagger-ui-standalone-preset.js',
  })
);

//setup session middleware
// app.use(session({
//     secret: 'very-strong-secret',
//     resave:false,
//     saveUninitialized:true
// }))

// Initialize Passport middleware
app.use(passport.initialize());
//app.use(passport.session())

// Routes

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hi there 🙋‍♀️',
    APIs: 'https://inventory-app-nodejs.onrender.com/api-docs',
  });
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

app.get(
  '/api/v1/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleCallback
);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/ticket', ticketRoutes);
app.use('/api/v1/admin', adminOrderRoutes);
app.use('/payment', paymentRoutes);
// app.use('/api/v1/otp', otpRoutes)

//Path Not Found Middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server...🥱`));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
