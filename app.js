const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const asyncHanlder = require('express-async-handler');
const User = require('./models/userModel');

require('dotenv').config();
const app = express();

//middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't Find ${req.originalUrl}`, 404);
  next(err);
});
// console.log(x);
app.use(globalErrorHandler);

module.exports = app;

//starts servers
//ok
