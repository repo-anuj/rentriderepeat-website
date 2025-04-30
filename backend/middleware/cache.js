/**
 * Middleware for caching API responses
 */
const CacheService = require('../services/CacheService');
const logger = require('../utils/logger');

/**
 * Cache middleware
 * @param {Number} ttl - Time to live in seconds
 * @param {Function} keyGenerator - Function to generate cache key (optional)
 * @returns {Function} Express middleware
 */
const cache = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache if disabled
    if (process.env.DISABLE_CACHE === 'true') {
      return next();
    }

    try {
      // Generate cache key
      const key = keyGenerator
        ? keyGenerator(req)
        : `${req.originalUrl || req.url}`;

      // Try to get cached response
      const cachedResponse = await CacheService.get(key);

      if (cachedResponse) {
        logger.debug('Cache hit', { key });
        return res.status(cachedResponse.status).json(cachedResponse.body);
      }

      logger.debug('Cache miss', { key });

      // Store original send method
      const originalSend = res.send;

      // Override send method to cache response
      res.send = function (body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const response = {
            status: res.statusCode,
            body: JSON.parse(body),
          };

          // Cache response
          CacheService.set(key, response, ttl).catch((err) => {
            logger.error('Cache set error', { error: err.message, key });
          });
        }

        // Call original send method
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { error: error.message });
      next();
    }
  };
};

/**
 * Clear cache for specific patterns
 * @param {String|Array} patterns - Cache key pattern(s)
 * @returns {Function} Express middleware
 */
const clearCache = (patterns) => {
  return async (req, res, next) => {
    try {
      const patternArray = Array.isArray(patterns) ? patterns : [patterns];

      // Process after response is sent
      res.on('finish', async () => {
        // Only clear cache for successful requests
        if (res.statusCode >= 200 && res.statusCode < 300) {
          for (const pattern of patternArray) {
            await CacheService.delPattern(pattern);
            logger.debug('Cache cleared', { pattern });
          }
        }
      });

      next();
    } catch (error) {
      logger.error('Clear cache middleware error', { error: error.message });
      next();
    }
  };
};

module.exports = {
  cache,
  clearCache,
};
