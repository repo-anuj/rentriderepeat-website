const AppError = require("../utils/AppError");
const { errorResponse } = require("../utils/responseHandler");
const logger = require("../utils/logger");

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error using structured logger
  logger.logError(err, req);

  let error = err;

  // If error is not an instance of AppError, convert it
  if (!(error instanceof AppError)) {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = {};

      // Format validation errors
      Object.keys(err.errors).forEach((field) => {
        errors[field] = err.errors[field].message;
      });

      error = AppError.validationError("Validation Error", errors);
    }

    // Mongoose duplicate key error
    else if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];

      error = AppError.conflict(
        `Duplicate value for ${field}: ${value}. Please use another value.`
      );
    }

    // Mongoose bad ObjectId
    else if (err.name === "CastError") {
      error = AppError.notFound(`Resource not found with id of ${err.value}`);
    }

    // JWT errors
    else if (err.name === "JsonWebTokenError") {
      error = AppError.unauthorized("Invalid token. Please log in again.");
    } else if (err.name === "TokenExpiredError") {
      error = AppError.unauthorized(
        "Your token has expired. Please log in again."
      );
    }

    // Default to server error for unknown errors
    else {
      error = AppError.serverError(err.message || "Internal Server Error");
    }
  }

  // Send standardized error response
  return errorResponse(
    res,
    error.statusCode || 500,
    error.message || "Server Error",
    error.errors || {}
  );
};

module.exports = errorHandler;
