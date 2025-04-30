/**
 * Health check routes for monitoring
 */
const express = require('express');
const mongoose = require('mongoose');
const { isDbConnected } = require('../config/database');
const CacheService = require('../services/CacheService');
const os = require('os');
const { version } = require('../package.json');

const router = express.Router();

/**
 * @desc    Basic health check
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'bikerent-api',
    version,
  });
});

/**
 * @desc    Detailed health check
 * @route   GET /api/health/details
 * @access  Public
 */
router.get('/details', async (req, res) => {
  // Check database connection
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';
  
  // Check Redis connection
  const redisStatus = CacheService.isConnected ? 'connected' : 'disconnected';
  
  // System information
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const systemMemory = {
    total: os.totalmem(),
    free: os.freemem(),
    used: os.totalmem() - os.freemem(),
  };
  
  // Response time
  const startTime = process.hrtime();
  const responseTime = process.hrtime(startTime);
  const responseTimeMs = (responseTime[0] * 1e9 + responseTime[1]) / 1e6;
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'bikerent-api',
    version,
    uptime,
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'unknown',
    },
    cache: {
      status: redisStatus,
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpus: os.cpus().length,
      memory: {
        total: `${Math.round(systemMemory.total / 1024 / 1024)} MB`,
        free: `${Math.round(systemMemory.free / 1024 / 1024)} MB`,
        used: `${Math.round(systemMemory.used / 1024 / 1024)} MB`,
        usedPercent: `${Math.round((systemMemory.used / systemMemory.total) * 100)}%`,
      },
      processMemory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
    },
    performance: {
      responseTime: `${responseTimeMs.toFixed(2)} ms`,
    },
  });
});

/**
 * @desc    Readiness probe
 * @route   GET /api/health/ready
 * @access  Public
 */
router.get('/ready', async (req, res) => {
  // Check if database is connected
  if (!isDbConnected()) {
    return res.status(503).json({
      status: 'error',
      message: 'Database not connected',
    });
  }
  
  // Check if Redis is connected (if required)
  if (process.env.REDIS_REQUIRED === 'true' && !CacheService.isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Redis not connected',
    });
  }
  
  res.status(200).json({
    status: 'ok',
    message: 'Service is ready',
  });
});

/**
 * @desc    Liveness probe
 * @route   GET /api/health/live
 * @access  Public
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Service is alive',
  });
});

module.exports = router;
