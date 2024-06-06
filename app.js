
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const asyncHanlder = require('express-async-handler');

require('dotenv').config();
const app = express();


//middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

}
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.all("*", (req, res, next) => {
    const err = new AppError(`Can't Find ${req.originalUrl}`, 404);
    next(err);
});
//Error Handling Middleware 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err.statusCode);
    console.log(err.message);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;

//starts servers



