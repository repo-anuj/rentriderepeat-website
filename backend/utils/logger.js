/**
 * Logging utility for structured logging
 */
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const accessLogPath = path.join(logsDir, 'access.log');

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

/**
 * Format log message
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {String} Formatted log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    message,
    ...meta,
  };
  
  return JSON.stringify(logData);
};

/**
 * Write log to file
 * @param {String} filePath - Log file path
 * @param {String} message - Log message
 */
const writeToFile = (filePath, message) => {
  fs.appendFile(filePath, message + '\n', (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

/**
 * Log error message
 * @param {String} message - Error message
 * @param {Object} meta - Additional metadata
 */
const error = (message, meta = {}) => {
  const formattedMessage = formatLogMessage(LogLevel.ERROR, message, meta);
  console.error(formattedMessage);
  writeToFile(errorLogPath, formattedMessage);
};

/**
 * Log warning message
 * @param {String} message - Warning message
 * @param {Object} meta - Additional metadata
 */
const warn = (message, meta = {}) => {
  const formattedMessage = formatLogMessage(LogLevel.WARN, message, meta);
  console.warn(formattedMessage);
  writeToFile(errorLogPath, formattedMessage);
};

/**
 * Log info message
 * @param {String} message - Info message
 * @param {Object} meta - Additional metadata
 */
const info = (message, meta = {}) => {
  const formattedMessage = formatLogMessage(LogLevel.INFO, message, meta);
  console.info(formattedMessage);
  writeToFile(accessLogPath, formattedMessage);
};

/**
 * Log debug message
 * @param {String} message - Debug message
 * @param {Object} meta - Additional metadata
 */
const debug = (message, meta = {}) => {
  if (process.env.NODE_ENV === 'development') {
    const formattedMessage = formatLogMessage(LogLevel.DEBUG, message, meta);
    console.debug(formattedMessage);
  }
};

/**
 * Log HTTP request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logRequest = (req, res) => {
  const meta = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: res.statusCode,
    userAgent: req.headers['user-agent'],
    responseTime: res.responseTime,
  };
  
  info('HTTP Request', meta);
};

/**
 * Log error with request details
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 */
const logError = (err, req) => {
  const meta = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
  };
  
  error(err.message, meta);
};

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logError,
  LogLevel,
};
