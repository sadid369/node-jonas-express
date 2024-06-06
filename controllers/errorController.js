const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "No Error Given";
    err.status = err.status || 'error';
    console.log(err.statusCode);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = globalErrorHandler;