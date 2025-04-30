/**
 * Database monitoring utility
 */

const { getConnection } = require('../config/database');

// Store metrics
const metrics = {
  operations: {
    count: 0,
    failed: 0,
    slow: 0
  },
  lastChecked: Date.now(),
  slowThreshold: 100 // ms
};

/**
 * Initialize database monitoring
 */
const initDbMonitoring = () => {
  const db = getConnection();
  
  // Monitor all database operations
  db.on('query', (query) => {
    metrics.operations.count++;
    
    // Check for slow queries
    if (query.time > metrics.slowThreshold) {
      metrics.operations.slow++;
      console.warn(`Slow query detected (${query.time}ms): ${query.query}`);
    }
  });
  
  // Monitor database errors
  db.on('error', (err) => {
    metrics.operations.failed++;
    console.error('Database error:', err);
  });
  
  // Set up periodic health checks
  setInterval(checkDbHealth, 60000); // Check every minute
  
  console.log('Database monitoring initialized');
};

/**
 * Check database health
 */
const checkDbHealth = async () => {
  try {
    const db = getConnection();
    const now = Date.now();
    const timeSinceLastCheck = now - metrics.lastChecked;
    
    // Skip if database is not connected
    if (db.readyState !== 1) {
      console.warn(`Database not connected. Current state: ${db.readyState}`);
      return;
    }
    
    // Perform a simple ping to check responsiveness
    const startTime = Date.now();
    await db.db.admin().ping();
    const pingTime = Date.now() - startTime;
    
    // Log health status
    console.log(`Database health check: Ping time ${pingTime}ms`);
    
    // Log operation metrics
    const opsPerSecond = metrics.operations.count / (timeSinceLastCheck / 1000);
    console.log(`Database operations: ${metrics.operations.count} total, ${opsPerSecond.toFixed(2)}/sec, ${metrics.operations.failed} failed, ${metrics.operations.slow} slow`);
    
    // Reset metrics
    metrics.operations.count = 0;
    metrics.operations.failed = 0;
    metrics.operations.slow = 0;
    metrics.lastChecked = now;
    
  } catch (error) {
    console.error('Database health check failed:', error);
  }
};

/**
 * Get current database metrics
 */
const getDbMetrics = () => {
  return { ...metrics };
};

module.exports = {
  initDbMonitoring,
  checkDbHealth,
  getDbMetrics
};
