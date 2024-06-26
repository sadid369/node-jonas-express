const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.error.path}: ${err.error.value}`;
  return new AppError(err, message, 400);
};
const handleDuplicateFieldsErrorDB = (err) => {
  const message = `Duplicate field value: "${err.error.keyValue.name}". Please use another value`;
  return new AppError(err, message, 400);
};
const handleValidationErrorDB = (err) => {
  const errorMessage = Object.values(err.error.errors).map((el) => el.message);
  const message = `Invalid Duplicate Data. ${errorMessage.join('. ')}`;
  return new AppError(err, message, 400);
};
const handleJWTError = (err) => {
  return new AppError(err, 'Invalid Token Please Log in Again', 401);
};
const handleJWTExpiredError = (err) => {
  return new AppError(err, 'Your Token has Expire Please Log in Again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error:
      err.error === null || err.error === undefined ? undefined : err.error,
    message: err.message,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let mError = { ...err };
    if (mError.error.name === 'CastError') {
      mError = handleCastErrorDB(mError);
    }
    if (mError.error.code === 11000) {
      mError = handleDuplicateFieldsErrorDB(mError);
    }

    if (mError.error.name === 'ValidationError') {
      mError = handleValidationErrorDB(mError);
    }
    if (mError.error.name === 'JsonWebTokenError') {
      mError = handleJWTError(mError);
    }
    if (mError.error.name === 'TokenExpiredError') {
      mError = handleJWTExpiredError(mError);
    }
    console.log(mError);
    sendErrorProd(mError, res);
  }
};

module.exports = globalErrorHandler;
