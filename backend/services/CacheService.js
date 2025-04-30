/**
 * Redis cache service for performance optimization
 */
const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.getAsync = null;
    this.setAsync = null;
    this.delAsync = null;
    this.keysAsync = null;
    this.flushallAsync = null;
    this.expireAsync = null;
    this.ttlAsync = null;
    this.hgetAsync = null;
    this.hsetAsync = null;
    this.hdelAsync = null;
    this.hkeysAsync = null;
    this.hgetallAsync = null;

    this.initialize();
  }

  /**
   * Initialize Redis client
   */
  initialize() {
    try {
      // Create Redis client
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB || 0,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error
            logger.error('Redis connection refused', { options });
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout
            logger.error('Redis retry time exhausted', { options });
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            logger.error('Redis max retries reached', { options });
            return undefined;
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        },
      });

      // Promisify Redis methods
      this.getAsync = promisify(this.client.get).bind(this.client);
      this.setAsync = promisify(this.client.set).bind(this.client);
      this.delAsync = promisify(this.client.del).bind(this.client);
      this.keysAsync = promisify(this.client.keys).bind(this.client);
      this.flushallAsync = promisify(this.client.flushall).bind(this.client);
      this.expireAsync = promisify(this.client.expire).bind(this.client);
      this.ttlAsync = promisify(this.client.ttl).bind(this.client);
      this.hgetAsync = promisify(this.client.hget).bind(this.client);
      this.hsetAsync = promisify(this.client.hset).bind(this.client);
      this.hdelAsync = promisify(this.client.hdel).bind(this.client);
      this.hkeysAsync = promisify(this.client.hkeys).bind(this.client);
      this.hgetallAsync = promisify(this.client.hgetall).bind(this.client);

      // Redis event handlers
      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connected');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.error('Redis error', { error: err.message });
      });

      this.client.on('end', () => {
        this.isConnected = false;
        logger.info('Redis connection closed');
      });

      logger.info('Redis client initialized');
    } catch (error) {
      logger.error('Redis initialization error', { error: error.message });
      this.isConnected = false;
    }
  }

  /**
   * Get value from cache
   * @param {String} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    try {
      if (!this.isConnected) return null;

      const data = await this.getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis get error', { error: error.message, key });
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {String} key - Cache key
   * @param {any} value - Value to cache
   * @param {Number} ttl - Time to live in seconds (optional)
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async set(key, value, ttl = null) {
    try {
      if (!this.isConnected) return false;

      const stringValue = JSON.stringify(value);
      
      if (ttl) {
        await this.setAsync(key, stringValue, 'EX', ttl);
      } else {
        await this.setAsync(key, stringValue);
      }
      
      return true;
    } catch (error) {
      logger.error('Redis set error', { error: error.message, key });
      return false;
    }
  }

  /**
   * Delete value from cache
   * @param {String} key - Cache key
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async del(key) {
    try {
      if (!this.isConnected) return false;

      await this.delAsync(key);
      return true;
    } catch (error) {
      logger.error('Redis del error', { error: error.message, key });
      return false;
    }
  }

  /**
   * Get all keys matching pattern
   * @param {String} pattern - Key pattern
   * @returns {Promise<Array>} Array of keys
   */
  async keys(pattern) {
    try {
      if (!this.isConnected) return [];

      return await this.keysAsync(pattern);
    } catch (error) {
      logger.error('Redis keys error', { error: error.message, pattern });
      return [];
    }
  }

  /**
   * Delete all keys matching pattern
   * @param {String} pattern - Key pattern
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async delPattern(pattern) {
    try {
      if (!this.isConnected) return false;

      const keys = await this.keysAsync(pattern);
      if (keys.length > 0) {
        await this.delAsync(keys);
      }
      return true;
    } catch (error) {
      logger.error('Redis delPattern error', { error: error.message, pattern });
      return false;
    }
  }

  /**
   * Flush all cache
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async flushAll() {
    try {
      if (!this.isConnected) return false;

      await this.flushallAsync();
      return true;
    } catch (error) {
      logger.error('Redis flushAll error', { error: error.message });
      return false;
    }
  }

  /**
   * Set expiration time for key
   * @param {String} key - Cache key
   * @param {Number} ttl - Time to live in seconds
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async expire(key, ttl) {
    try {
      if (!this.isConnected) return false;

      await this.expireAsync(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis expire error', { error: error.message, key, ttl });
      return false;
    }
  }

  /**
   * Get time to live for key
   * @param {String} key - Cache key
   * @returns {Promise<Number>} Time to live in seconds
   */
  async ttl(key) {
    try {
      if (!this.isConnected) return -2;

      return await this.ttlAsync(key);
    } catch (error) {
      logger.error('Redis ttl error', { error: error.message, key });
      return -2;
    }
  }

  /**
   * Get hash field
   * @param {String} key - Hash key
   * @param {String} field - Hash field
   * @returns {Promise<any>} Field value or null
   */
  async hget(key, field) {
    try {
      if (!this.isConnected) return null;

      const data = await this.hgetAsync(key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis hget error', { error: error.message, key, field });
      return null;
    }
  }

  /**
   * Set hash field
   * @param {String} key - Hash key
   * @param {String} field - Hash field
   * @param {any} value - Field value
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async hset(key, field, value) {
    try {
      if (!this.isConnected) return false;

      const stringValue = JSON.stringify(value);
      await this.hsetAsync(key, field, stringValue);
      return true;
    } catch (error) {
      logger.error('Redis hset error', { error: error.message, key, field });
      return false;
    }
  }

  /**
   * Delete hash field
   * @param {String} key - Hash key
   * @param {String} field - Hash field
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async hdel(key, field) {
    try {
      if (!this.isConnected) return false;

      await this.hdelAsync(key, field);
      return true;
    } catch (error) {
      logger.error('Redis hdel error', { error: error.message, key, field });
      return false;
    }
  }

  /**
   * Get all hash fields
   * @param {String} key - Hash key
   * @returns {Promise<Array>} Array of fields
   */
  async hkeys(key) {
    try {
      if (!this.isConnected) return [];

      return await this.hkeysAsync(key);
    } catch (error) {
      logger.error('Redis hkeys error', { error: error.message, key });
      return [];
    }
  }

  /**
   * Get all hash fields and values
   * @param {String} key - Hash key
   * @returns {Promise<Object>} Object with fields and values
   */
  async hgetall(key) {
    try {
      if (!this.isConnected) return {};

      const data = await this.hgetallAsync(key);
      if (!data) return {};

      // Parse JSON values
      const result = {};
      for (const field in data) {
        result[field] = JSON.parse(data[field]);
      }
      
      return result;
    } catch (error) {
      logger.error('Redis hgetall error', { error: error.message, key });
      return {};
    }
  }
}

module.exports = new CacheService();
