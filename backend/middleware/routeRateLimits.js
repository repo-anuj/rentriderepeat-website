/**
 * Specialized rate limiters for different routes
 */
const { createAdvancedLimiter } = require('./rateLimit');

/**
 * Rate limiter for search routes
 * - Higher limits for public search endpoints
 * - Skips rate limiting for successful requests
 */
const searchLimiter = createAdvancedLimiter({
  points: 30, // 30 requests
  duration: 60, // per minute
  message: 'Too many search requests, please try again after a minute',
  skipSuccessfulRequests: true, // Don't count successful searches against the limit
});

/**
 * Rate limiter for booking routes
 * - Stricter limits for booking creation
 * - Different limits based on user authentication
 */
const bookingLimiter = createAdvancedLimiter({
  points: 10, // 10 requests
  duration: 60 * 5, // per 5 minutes
  message: 'Too many booking requests, please try again after 5 minutes',
  keyGenerator: (req) => {
    // Use different limits for authenticated vs non-authenticated users
    if (req.user) {
      return `user_${req.user.id}`;
    } else {
      // Stricter for non-authenticated users
      return `ip_${req.ip}_strict`;
    }
  },
  // Consume more points for booking creation
  pointsConsumed: (req) => {
    return req.method === 'POST' ? 3 : 1;
  },
});

/**
 * Rate limiter for payment routes
 * - Very strict limits for payment operations
 * - Higher consumption for sensitive operations
 */
const paymentLimiter = createAdvancedLimiter({
  points: 5, // 5 requests
  duration: 60 * 10, // per 10 minutes
  blockDuration: 60 * 30, // Block for 30 minutes on exceeding
  message: 'Too many payment requests, please try again after 10 minutes',
  // Consume more points for payment verification
  pointsConsumed: (req) => {
    return req.path.includes('/verify') ? 3 : 1;
  },
});

/**
 * Rate limiter for vendor routes
 * - Different limits based on operation type
 */
const vendorLimiter = createAdvancedLimiter({
  points: 20, // 20 requests
  duration: 60 * 5, // per 5 minutes
  message: 'Too many vendor requests, please try again after 5 minutes',
  // Consume more points for document submission
  pointsConsumed: (req) => {
    return req.path.includes('/documents') ? 5 : 1;
  },
});

/**
 * Rate limiter for admin routes
 * - Higher limits for admin operations
 * - Still protected against abuse
 */
const adminLimiter = createAdvancedLimiter({
  points: 50, // 50 requests
  duration: 60 * 5, // per 5 minutes
  message: 'Too many admin requests, please try again after 5 minutes',
});

module.exports = {
  searchLimiter,
  bookingLimiter,
  paymentLimiter,
  vendorLimiter,
  adminLimiter,
};
