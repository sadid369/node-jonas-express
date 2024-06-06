const sendErrorDev = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};
const sendErrorProd = (err, res) => {
    //Operational Error, trusted error: send message to client
    if (err.operational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,

        });
    }
    //programming or other unknown error: don't leak error details to client 
    else {
        // 1) Log Error
        console.error('ERROR 🔥', err);


        // 2) send generic message
        res.status(500).json({ status: "Error", message: "Something went very wrong" });
    }

};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        console.log('Kuk');
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log('Vokka');
        sendErrorProd(err, res);
    }
    // res.status(err.statusCode).json({
    //     status: err.status,
    //     message: err.message
    // });
};

module.exports = globalErrorHandler;