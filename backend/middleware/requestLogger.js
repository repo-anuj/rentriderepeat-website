/**
 * Middleware for logging HTTP requests
 */
const logger = require('../utils/logger');

/**
 * Log HTTP request details
 */
const requestLogger = (req, res, next) => {
  // Record start time
  const start = Date.now();
  
  // Process request
  next();
  
  // Add response time to response object
  res.on('finish', () => {
    // Calculate response time
    const responseTime = Date.now() - start;
    res.responseTime = responseTime;
    
    // Log request
    logger.logRequest(req, res);
  });
};

module.exports = requestLogger;
