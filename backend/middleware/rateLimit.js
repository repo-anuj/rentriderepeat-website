/**
 * Rate limiting middleware to prevent abuse of API endpoints
 */

const rateLimit = require("express-rate-limit");
const {
  RateLimiterMemory,
  RateLimiterRedis,
} = require("rate-limiter-flexible");
const redis = require("redis");
const logger = require("../utils/logger");

// Determine which rate limiter to use based on environment
let rateLimiter;

// Try to use Redis if available
if (process.env.REDIS_HOST) {
  try {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || "",
      enable_offline_queue: false,
    });

    redisClient.on("error", (err) => {
      logger.error("Redis rate limiter error", { error: err.message });
      // Fall back to memory rate limiter if Redis fails
      rateLimiter = new RateLimiterMemory({
        points: 100, // Number of points
        duration: 60, // Per 60 seconds
      });
    });

    // Create Redis rate limiter
    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "ratelimit",
      points: 100, // Number of points
      duration: 60, // Per 60 seconds
    });

    logger.info("Redis rate limiter initialized");
  } catch (err) {
    logger.error("Redis rate limiter initialization error", {
      error: err.message,
    });
    // Fall back to memory rate limiter
    rateLimiter = new RateLimiterMemory({
      points: 100, // Number of points
      duration: 60, // Per 60 seconds
    });
  }
} else {
  // Use memory rate limiter
  rateLimiter = new RateLimiterMemory({
    points: 100, // Number of points
    duration: 60, // Per 60 seconds
  });

  logger.info("Memory rate limiter initialized");
}

/**
 * Basic rate limiter for general API endpoints
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

/**
 * Stricter rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts, please try again after an hour",
  },
});

/**
 * Advanced rate limiter with IP and user ID tracking
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware
 */
const createAdvancedLimiter = (options = {}) => {
  const {
    points = 5,
    duration = 60,
    blockDuration = 60 * 10, // 10 minutes block by default
    message = "Too many requests, please try again later",
    keyGenerator = null, // Custom key generator function
    pointsConsumed = 1, // Points to consume per request
    skipSuccessfulRequests = false, // Whether to skip rate limiting for successful requests
  } = options;

  return async (req, res, next) => {
    try {
      // Generate key based on options or defaults
      let key;

      if (keyGenerator) {
        // Use custom key generator if provided
        key = keyGenerator(req);
      } else {
        // Default: Use user ID for authenticated requests, IP for non-authenticated
        key = req.user ? `user_${req.user.id}` : `ip_${req.ip}`;
      }

      // Add route to key for more granular control
      const routeKey = `${req.method}_${req.originalUrl.split("?")[0]}`;
      key = `${key}_${routeKey}`;

      // Store original end method
      const originalEnd = res.end;

      // If we should skip successful requests, we need to wait for the response
      if (skipSuccessfulRequests) {
        // Override end method to conditionally consume points
        res.end = function (...args) {
          // Only consume points for non-successful responses
          if (res.statusCode >= 400) {
            rateLimiter.consume(key, pointsConsumed).catch((err) => {
              logger.debug("Rate limit applied after response", {
                key,
                statusCode: res.statusCode,
              });
            });
          }

          // Call original end method
          return originalEnd.apply(this, args);
        };

        // Continue without consuming points yet
        next();
      } else {
        // Consume points immediately
        await rateLimiter.consume(key, pointsConsumed);
        next();
      }
    } catch (err) {
      if (err.remainingPoints !== undefined) {
        // This is a rate limiter error
        logger.warn("Rate limit exceeded", {
          ip: req.ip,
          path: req.originalUrl,
          method: req.method,
          user: req.user ? req.user.id : "anonymous",
        });

        res.status(429).json({
          success: false,
          error: message,
          retryAfter: Math.round(err.msBeforeNext / 1000) || 1,
        });
      } else {
        // This is some other error
        logger.error("Rate limiter error", { error: err.message });
        next(err);
      }
    }
  };
};

module.exports = {
  apiLimiter,
  authLimiter,
  createAdvancedLimiter,
};
