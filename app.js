
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();
const app = express();


//middlewares
if (process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));

}
app.use(express.json());

app.use((req, res, next) => {
    // console.log(req.params.id);

    console.log('hello from the middleware');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log('hello from the middleware');
    next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;

//starts servers



