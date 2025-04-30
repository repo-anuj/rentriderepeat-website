/**
 * Base service class that provides common functionality for all services
 */
const DatabaseService = require('./database');
const { getConnection } = require('../config/database');

class BaseService {
  /**
   * Constructor for BaseService
   * @param {Object} model - Mongoose model
   */
  constructor(model) {
    this.model = model;
    this.modelName = model.modelName;
    this.db = DatabaseService;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      return await this.db.create(this.model, data);
    } catch (error) {
      this._handleError(error, 'create');
    }
  }

  /**
   * Find documents with optional filtering, sorting, and pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (select, sort, page, limit)
   * @returns {Promise<Object>} Query results with pagination metadata
   */
  async findAll(filter = {}, options = {}) {
    try {
      return await this.db.find(this.model, filter, options);
    } catch (error) {
      this._handleError(error, 'findAll');
    }
  }

  /**
   * Find a single document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Query options (select, populate)
   * @returns {Promise<Object>} Found document
   */
  async findById(id, options = {}) {
    try {
      return await this.db.findById(this.model, id, options);
    } catch (error) {
      this._handleError(error, 'findById');
    }
  }

  /**
   * Find a single document by custom filter
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (select, populate)
   * @returns {Promise<Object>} Found document
   */
  async findOne(filter, options = {}) {
    try {
      return await this.db.findOne(this.model, filter, options);
    } catch (error) {
      this._handleError(error, 'findOne');
    }
  }

  /**
   * Update a document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated document
   */
  async update(id, data, options = { new: true, runValidators: true }) {
    try {
      return await this.db.updateById(this.model, id, data, options);
    } catch (error) {
      this._handleError(error, 'update');
    }
  }

  /**
   * Delete a document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async delete(id) {
    try {
      return await this.db.deleteById(this.model, id);
    } catch (error) {
      this._handleError(error, 'delete');
    }
  }

  /**
   * Execute an aggregation pipeline
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregation results
   */
  async aggregate(pipeline) {
    try {
      return await this.db.aggregate(this.model, pipeline);
    } catch (error) {
      this._handleError(error, 'aggregate');
    }
  }

  /**
   * Check if a document exists
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Boolean>} True if document exists, false otherwise
   */
  async exists(filter) {
    try {
      return await this.db.exists(this.model, filter);
    } catch (error) {
      this._handleError(error, 'exists');
    }
  }

  /**
   * Count documents matching a filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Number>} Document count
   */
  async count(filter = {}) {
    try {
      return await this.db.count(this.model, filter);
    } catch (error) {
      this._handleError(error, 'count');
    }
  }

  /**
   * Execute a transaction
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    try {
      return await this.db.transaction(callback);
    } catch (error) {
      this._handleError(error, 'transaction');
    }
  }

  /**
   * Handle errors in service methods
   * @param {Error} error - Error object
   * @param {String} operation - Operation that caused the error
   * @throws {Error} Rethrows the error with additional context
   * @private
   */
  _handleError(error, operation) {
    console.error(`Error in ${this.modelName}Service.${operation}:`, error);
    
    // Add context to the error
    error.service = this.modelName;
    error.operation = operation;
    
    // Rethrow the error
    throw error;
  }
}

module.exports = BaseService;
