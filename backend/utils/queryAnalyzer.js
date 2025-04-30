/**
 * Database query analyzer for performance monitoring
 */
const mongoose = require('mongoose');
const logger = require('./logger');

// Threshold for slow queries in milliseconds
const SLOW_QUERY_THRESHOLD = process.env.SLOW_QUERY_THRESHOLD || 100;

/**
 * Initialize query analyzer
 */
const initQueryAnalyzer = () => {
  // Skip in test environment
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  // Add query monitoring
  mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
    // Create a unique ID for this query
    const queryId = Math.random().toString(36).substring(2, 15);
    
    // Log query start
    const startTime = Date.now();
    logger.debug('Query started', {
      queryId,
      collection: collectionName,
      operation: methodName,
      args: methodArgs.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)),
    });

    // The last argument is the callback
    const originalCallback = methodArgs[methodArgs.length - 1];
    
    if (typeof originalCallback !== 'function') {
      // If no callback, we can't track timing
      return;
    }

    // Replace the callback to measure execution time
    methodArgs[methodArgs.length - 1] = function(err, result) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Log query completion
      if (executionTime >= SLOW_QUERY_THRESHOLD) {
        // Log slow queries with warning level
        logger.warn('Slow query detected', {
          queryId,
          collection: collectionName,
          operation: methodName,
          executionTime,
          args: methodArgs.slice(0, -1).map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)),
        });
      } else {
        // Log normal queries with debug level
        logger.debug('Query completed', {
          queryId,
          collection: collectionName,
          operation: methodName,
          executionTime,
        });
      }

      // Call the original callback
      originalCallback.apply(this, arguments);
    };
  });

  logger.info('MongoDB query analyzer initialized');
};

/**
 * Get explain plan for a query
 * @param {Object} model - Mongoose model
 * @param {Object} query - Query object
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Explain plan
 */
const explainQuery = async (model, query, options = {}) => {
  try {
    const explainPlan = await model.find(query).explain('executionStats');
    
    // Log the explain plan
    logger.debug('Query explain plan', {
      collection: model.collection.name,
      query: JSON.stringify(query),
      executionTimeMillis: explainPlan.executionStats.executionTimeMillis,
      totalDocsExamined: explainPlan.executionStats.totalDocsExamined,
      totalKeysExamined: explainPlan.executionStats.totalKeysExamined,
      indexesUsed: explainPlan.queryPlanner.winningPlan.inputStage.indexName || 'none',
    });
    
    return explainPlan;
  } catch (error) {
    logger.error('Error explaining query', { error: error.message });
    throw error;
  }
};

/**
 * Analyze a collection for optimization opportunities
 * @param {Object} model - Mongoose model
 * @returns {Promise<Object>} Analysis results
 */
const analyzeCollection = async (model) => {
  try {
    const collectionName = model.collection.name;
    logger.info(`Analyzing collection: ${collectionName}`);
    
    // Get collection stats
    const stats = await model.collection.stats();
    
    // Get current indexes
    const indexes = await model.collection.indexes();
    
    // Check for large documents
    const largestDocs = await model.aggregate([
      { $project: { documentSize: { $bsonSize: '$$ROOT' } } },
      { $sort: { documentSize: -1 } },
      { $limit: 5 },
    ]);
    
    // Check for missing indexes on common query fields
    // This would require analyzing your application's query patterns
    
    const analysis = {
      collectionName,
      documentCount: stats.count,
      avgDocumentSize: stats.avgObjSize,
      totalSize: stats.size,
      indexSize: stats.totalIndexSize,
      indexes: indexes.map(idx => ({
        name: idx.name,
        fields: Object.keys(idx.key),
        unique: !!idx.unique,
        sparse: !!idx.sparse,
      })),
      largestDocuments: largestDocs.map(doc => ({
        id: doc._id,
        size: doc.documentSize,
      })),
      recommendations: [],
    };
    
    // Generate recommendations
    if (analysis.avgDocumentSize > 16384) { // 16KB
      analysis.recommendations.push('Average document size is large. Consider restructuring data.');
    }
    
    if (analysis.indexSize > analysis.totalSize) {
      analysis.recommendations.push('Index size exceeds data size. Consider removing unused indexes.');
    }
    
    if (indexes.length > 10) {
      analysis.recommendations.push('Large number of indexes. Review and remove unused indexes.');
    }
    
    logger.info('Collection analysis complete', { collectionName, recommendations: analysis.recommendations });
    return analysis;
  } catch (error) {
    logger.error('Error analyzing collection', { error: error.message });
    throw error;
  }
};

module.exports = {
  initQueryAnalyzer,
  explainQuery,
  analyzeCollection,
  SLOW_QUERY_THRESHOLD,
};
