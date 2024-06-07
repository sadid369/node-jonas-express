const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.error.path}: ${err.error.value}`;
  return new AppError(err, message, 400);
};
const handleDuplicateFieldsErrorDB = (err) => {
  const message = `Duplicate field value: "${err.error.keyValue.name}". Please use another value`;
  return new AppError(err, message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.error,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Operational Error, trusted error: send message to client
  //   if (err.operational) {
  //   console.log(err.json());
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  //   console.log(err.error.code);
  //   res.status(err.statusCode).json({
  //     err,
  //   });
  //   }
  //programming or other unknown error: don't leak error details to client
  //   else {
  //     // 1) Log Error
  //     console.error('ERROR 🔥', err);
  //     // 2) send generic message
  //     res
  //       .status(500)
  //       .json({ status: 'Error', message: 'Something went very wrong' });
  //   }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    // console.log(err.error.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let mError = { ...err };
    if (mError.error.name === 'CastError') {
      mError = handleCastErrorDB(mError);
    }
    if (mError.error.code === 11000) {
      mError = handleDuplicateFieldsErrorDB(mError);
    }
    // console.log(mError);
    sendErrorProd(mError, res);
  }
};

module.exports = globalErrorHandler;
