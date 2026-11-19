// Central error handling and 404 middleware
const notFound = (req, res, next) => {
    const error = new Error(`Resource not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // If status code is 200, default to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "An unexpected server error occurred.";
    let errors = {};

    // Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        message = `Resource not found with invalid ID format: ${err.value}`;
        errors[err.path || "id"] = "Invalid ID format.";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed.";
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
    }

    // Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        message = `Duplicate value entered for ${field}.`;
        errors[field] = `This ${field} is already in use.`;
    }

    // JSON syntax error from express.json()
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        statusCode = 400;
        message = "Malformed JSON syntax in request body.";
        errors.body = "Invalid JSON format.";
    }

    res.status(statusCode).json({
        message,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
};

module.exports = { notFound, errorHandler };
