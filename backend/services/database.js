/**
 * Database service for standardized database access
 */

const { getConnection } = require('../config/database');

/**
 * Generic database service for standardized database operations
 */
class DatabaseService {
  /**
   * Create a new document
   * @param {Object} model - Mongoose model
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  static async create(model, data) {
    try {
      return await model.create(data);
    } catch (error) {
      console.error(`Error creating document in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find documents with optional filtering, sorting, and pagination
   * @param {Object} model - Mongoose model
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (select, sort, page, limit)
   * @returns {Promise<Object>} Query results with pagination metadata
   */
  static async find(model, filter = {}, options = {}) {
    try {
      const { select, sort, page = 1, limit = 100 } = options;
      
      // Start building query
      let query = model.find(filter);
      
      // Apply field selection if provided
      if (select) {
        query = query.select(select);
      }
      
      // Apply sorting if provided
      if (sort) {
        query = query.sort(sort);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      // Get total count for pagination metadata
      const total = await model.countDocuments(filter);
      
      // Apply pagination to query
      query = query.skip(startIndex).limit(limit);
      
      // Execute query
      const results = await query;
      
      // Prepare pagination metadata
      const pagination = {};
      
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }
      
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }
      
      return {
        success: true,
        count: results.length,
        pagination,
        total,
        data: results
      };
    } catch (error) {
      console.error(`Error finding documents in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find a single document by ID
   * @param {Object} model - Mongoose model
   * @param {String} id - Document ID
   * @param {Object} options - Query options (select, populate)
   * @returns {Promise<Object>} Found document
   */
  static async findById(model, id, options = {}) {
    try {
      const { select, populate } = options;
      
      let query = model.findById(id);
      
      if (select) {
        query = query.select(select);
      }
      
      if (populate) {
        if (Array.isArray(populate)) {
          populate.forEach(field => {
            query = query.populate(field);
          });
        } else {
          query = query.populate(populate);
        }
      }
      
      const result = await query;
      
      if (!result) {
        const error = new Error(`Resource not found with id of ${id}`);
        error.name = 'NotFoundError';
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error(`Error finding document by ID in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find a single document by custom filter
   * @param {Object} model - Mongoose model
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (select, populate)
   * @returns {Promise<Object>} Found document
   */
  static async findOne(model, filter, options = {}) {
    try {
      const { select, populate } = options;
      
      let query = model.findOne(filter);
      
      if (select) {
        query = query.select(select);
      }
      
      if (populate) {
        if (Array.isArray(populate)) {
          populate.forEach(field => {
            query = query.populate(field);
          });
        } else {
          query = query.populate(populate);
        }
      }
      
      return await query;
    } catch (error) {
      console.error(`Error finding document in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   * @param {Object} model - Mongoose model
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated document
   */
  static async updateById(model, id, data, options = { new: true, runValidators: true }) {
    try {
      const document = await model.findByIdAndUpdate(id, data, options);
      
      if (!document) {
        const error = new Error(`Resource not found with id of ${id}`);
        error.name = 'NotFoundError';
        throw error;
      }
      
      return document;
    } catch (error) {
      console.error(`Error updating document in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   * @param {Object} model - Mongoose model
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  static async deleteById(model, id) {
    try {
      const document = await model.findByIdAndDelete(id);
      
      if (!document) {
        const error = new Error(`Resource not found with id of ${id}`);
        error.name = 'NotFoundError';
        throw error;
      }
      
      return document;
    } catch (error) {
      console.error(`Error deleting document in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Execute an aggregation pipeline
   * @param {Object} model - Mongoose model
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregation results
   */
  static async aggregate(model, pipeline) {
    try {
      return await model.aggregate(pipeline);
    } catch (error) {
      console.error(`Error executing aggregation in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Check if a document exists
   * @param {Object} model - Mongoose model
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Boolean>} True if document exists, false otherwise
   */
  static async exists(model, filter) {
    try {
      return await model.exists(filter);
    } catch (error) {
      console.error(`Error checking existence in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents matching a filter
   * @param {Object} model - Mongoose model
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Number>} Document count
   */
  static async count(model, filter = {}) {
    try {
      return await model.countDocuments(filter);
    } catch (error) {
      console.error(`Error counting documents in ${model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Execute a transaction
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} Transaction result
   */
  static async transaction(callback) {
    const session = await getConnection().startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = DatabaseService;
