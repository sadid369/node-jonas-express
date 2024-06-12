class AppError extends Error {
  constructor(error, message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith(4) ? 'Fail' : 'Error';
    this.isOperational = true;
    // Error.captureStackTrace(this, this.constructor);
    this.error = error;
  }
}

module.exports = AppError;
