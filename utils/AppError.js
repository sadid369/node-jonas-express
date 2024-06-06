
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith(4) ? "Fail" : "Error";
    }
}


module.exports = AppError;