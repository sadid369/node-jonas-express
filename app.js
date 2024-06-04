
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();
const app = express();


//middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

}
app.use(express.json());


// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     console.log('hello from the middleware');
//     next();
// });

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.all("*", (req, res, next) => {
    // res.status(404).json({ status: 'Fail', message: `Can't Find ${req.originalUrl}` });

    const err = new Error(`Can't Find ${req.originalUrl}`);
    err.status = 'Fails';
    // err.sadid = "sadid";
    err.statusCode = 404;
    next(err);
});
//Error Handling Middleware 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        // sadid: err.sadid,
        message: err.message
    });
});


module.exports = app;

//starts servers



