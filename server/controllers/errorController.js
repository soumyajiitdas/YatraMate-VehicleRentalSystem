const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // Handle both old (errmsg) and new (keyValue) MongoDB error formats
    let value;
    
    if (err.keyValue) {
        // New MongoDB driver format - keyValue contains the duplicate field(s)
        value = Object.values(err.keyValue).join(', ');
    } else if (err.errmsg) {
        // Old MongoDB format
        const match = err.errmsg.match(/(?<=")([^"]*?)(?=")/);
        value = match ? match[0] : 'unknown';
    } else if (err.message) {
        // Try to extract from error message
        const match = err.message.match(/dup key: \{ [^:]+: "([^"]+)" \}/);
        value = match ? match[1] : 'unknown';
    } else {
        value = 'unknown';
    }
    
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Log error for debugging in production logs
    console.error('ERROR 💥', err);

    // Operational error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Programming or other unknown error: don't leak error details
    } else {
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Create error copy with all necessary properties
        // Note: spread operator doesn't copy non-enumerable properties like name, message
        let error = { 
            ...err,
            name: err.name,
            message: err.message,
            code: err.code,
            keyValue: err.keyValue,
            errmsg: err.errmsg,
            errors: err.errors,
            path: err.path,
            value: err.value
        };

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};