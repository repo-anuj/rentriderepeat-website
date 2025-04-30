/**
 * Custom error class for application errors
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {Object} errors - Detailed errors
   */
  constructor(message, statusCode = 500, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Indicates this is an operational error

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a not found error
   * @param {String} message - Error message
   * @returns {AppError} Not found error
   */
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  /**
   * Create a validation error
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors
   * @returns {AppError} Validation error
   */
  static validationError(message = 'Validation Error', errors = {}) {
    return new AppError(message, 400, errors);
  }

  /**
   * Create an unauthorized error
   * @param {String} message - Error message
   * @returns {AppError} Unauthorized error
   */
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  /**
   * Create a forbidden error
   * @param {String} message - Error message
   * @returns {AppError} Forbidden error
   */
  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  /**
   * Create a conflict error
   * @param {String} message - Error message
   * @returns {AppError} Conflict error
   */
  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409);
  }

  /**
   * Create a too many requests error
   * @param {String} message - Error message
   * @returns {AppError} Too many requests error
   */
  static tooManyRequests(message = 'Too many requests') {
    return new AppError(message, 429);
  }

  /**
   * Create a server error
   * @param {String} message - Error message
   * @returns {AppError} Server error
   */
  static serverError(message = 'Internal Server Error') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
