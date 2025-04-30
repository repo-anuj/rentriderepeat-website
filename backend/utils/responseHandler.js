/**
 * Utility for standardizing API responses
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} meta - Additional metadata
 * @returns {Object} Express response
 */
const successResponse = (
  res,
  statusCode = 200,
  message = 'Success',
  data = {},
  meta = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Detailed errors
 * @returns {Object} Express response
 */
const errorResponse = (
  res,
  statusCode = 500,
  message = 'Server Error',
  errors = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message
 * @returns {Object} Express response
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 * @returns {Object} Express response
 */
const validationErrorResponse = (res, errors) => {
  return errorResponse(res, 400, 'Validation Error', errors);
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Unauthorized message
 * @returns {Object} Express response
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, 401, message);
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Forbidden message
 * @returns {Object} Express response
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, 403, message);
};

/**
 * Send a conflict response
 * @param {Object} res - Express response object
 * @param {String} message - Conflict message
 * @returns {Object} Express response
 */
const conflictResponse = (res, message = 'Resource already exists') => {
  return errorResponse(res, 409, message);
};

/**
 * Send a too many requests response
 * @param {Object} res - Express response object
 * @param {String} message - Too many requests message
 * @returns {Object} Express response
 */
const tooManyRequestsResponse = (res, message = 'Too many requests') => {
  return errorResponse(res, 429, message);
};

/**
 * Send a created response
 * @param {Object} res - Express response object
 * @param {String} message - Created message
 * @param {Object|Array} data - Response data
 * @returns {Object} Express response
 */
const createdResponse = (res, message = 'Resource created successfully', data = {}) => {
  return successResponse(res, 201, message, data);
};

/**
 * Send a no content response
 * @param {Object} res - Express response object
 * @returns {Object} Express response
 */
const noContentResponse = (res) => {
  return res.status(204).end();
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
  tooManyRequestsResponse,
  createdResponse,
  noContentResponse,
};
