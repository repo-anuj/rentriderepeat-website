/**
 * Service for bike-related operations
 */
const BaseService = require('./BaseService');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

class BikeService extends BaseService {
  constructor() {
    super(Bike);
  }

  /**
   * Get all bikes with filtering, sorting, and pagination
   * @param {Object} queryParams - Query parameters for filtering
   * @returns {Promise<Object>} Bikes with pagination metadata
   */
  async getAllBikes(queryParams) {
    try {
      const {
        location,
        category,
        brand,
        minPrice,
        maxPrice,
        available,
        startDate,
        endDate,
        sort,
        page = 1,
        limit = 10,
        search,
      } = queryParams;

      // Build filter object
      const filter = {};

      // Location filter
      if (location) {
        filter.location = location;
      }

      // Category filter
      if (category) {
        filter.category = category;
      }

      // Brand filter
      if (brand) {
        filter.brand = brand;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        filter.pricePerDay = {};
        if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
      }

      // Availability filter
      if (available === 'true') {
        filter.isAvailable = true;
      }

      // Search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Date availability filter
      if (startDate && endDate) {
        // Find bookings that overlap with the requested date range
        const overlappingBookings = await Booking.find({
          $and: [
            { startDate: { $lte: new Date(endDate) } },
            { endDate: { $gte: new Date(startDate) } },
            { status: { $in: ['confirmed', 'pending'] } },
          ],
        }).select('bike');

        // Extract bike IDs from overlapping bookings
        const unavailableBikeIds = overlappingBookings.map(booking => booking.bike);

        // Exclude unavailable bikes
        if (unavailableBikeIds.length > 0) {
          filter._id = { $nin: unavailableBikeIds };
        }
      }

      // Prepare sort options
      let sortOptions = {};
      if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
          if (field.startsWith('-')) {
            sortOptions[field.substring(1)] = -1;
          } else {
            sortOptions[field] = 1;
          }
        });
      } else {
        // Default sort by createdAt descending
        sortOptions = { createdAt: -1 };
      }

      // Get bikes with pagination
      const options = {
        sort: sortOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: 'vendor',
      };

      return await this.findAll(filter, options);
    } catch (error) {
      this._handleError(error, 'getAllBikes');
    }
  }

  /**
   * Get bike by ID with vendor details
   * @param {String} id - Bike ID
   * @returns {Promise<Object>} Bike with vendor details
   */
  async getBikeById(id) {
    try {
      return await this.findById(id, {
        populate: [
          { path: 'vendor', select: 'businessName businessAddress' },
          { path: 'reviews', populate: { path: 'user', select: 'name profilePicture' } },
        ],
      });
    } catch (error) {
      this._handleError(error, 'getBikeById');
    }
  }

  /**
   * Get bikes by vendor ID
   * @param {String} vendorId - Vendor ID
   * @param {Object} queryParams - Query parameters for filtering
   * @returns {Promise<Object>} Bikes with pagination metadata
   */
  async getBikesByVendor(vendorId, queryParams) {
    try {
      const { page = 1, limit = 10, sort } = queryParams;

      // Prepare sort options
      let sortOptions = {};
      if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
          if (field.startsWith('-')) {
            sortOptions[field.substring(1)] = -1;
          } else {
            sortOptions[field] = 1;
          }
        });
      } else {
        // Default sort by createdAt descending
        sortOptions = { createdAt: -1 };
      }

      // Get bikes with pagination
      const options = {
        sort: sortOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };

      return await this.findAll({ vendor: vendorId }, options);
    } catch (error) {
      this._handleError(error, 'getBikesByVendor');
    }
  }

  /**
   * Create a new bike
   * @param {Object} bikeData - Bike data
   * @param {String} vendorId - Vendor ID
   * @returns {Promise<Object>} Created bike
   */
  async createBike(bikeData, vendorId) {
    try {
      // Add vendor ID to bike data
      bikeData.vendor = vendorId;

      return await this.create(bikeData);
    } catch (error) {
      this._handleError(error, 'createBike');
    }
  }

  /**
   * Update a bike
   * @param {String} id - Bike ID
   * @param {Object} bikeData - Bike data to update
   * @param {String} vendorId - Vendor ID
   * @returns {Promise<Object>} Updated bike
   */
  async updateBike(id, bikeData, vendorId) {
    try {
      // Check if bike exists and belongs to vendor
      const bike = await this.findOne({ _id: id, vendor: vendorId });

      if (!bike) {
        const error = new Error('Bike not found or you are not authorized to update this bike');
        error.statusCode = 404;
        throw error;
      }

      return await this.update(id, bikeData);
    } catch (error) {
      this._handleError(error, 'updateBike');
    }
  }

  /**
   * Delete a bike
   * @param {String} id - Bike ID
   * @param {String} vendorId - Vendor ID
   * @returns {Promise<Object>} Deleted bike
   */
  async deleteBike(id, vendorId) {
    try {
      // Check if bike exists and belongs to vendor
      const bike = await this.findOne({ _id: id, vendor: vendorId });

      if (!bike) {
        const error = new Error('Bike not found or you are not authorized to delete this bike');
        error.statusCode = 404;
        throw error;
      }

      // Check if bike has active bookings
      const activeBookings = await Booking.countDocuments({
        bike: id,
        status: { $in: ['confirmed', 'pending'] },
        endDate: { $gte: new Date() },
      });

      if (activeBookings > 0) {
        const error = new Error('Cannot delete bike with active bookings');
        error.statusCode = 400;
        throw error;
      }

      return await this.delete(id);
    } catch (error) {
      this._handleError(error, 'deleteBike');
    }
  }

  /**
   * Check bike availability for a date range
   * @param {String} bikeId - Bike ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Boolean>} True if bike is available, false otherwise
   */
  async checkAvailability(bikeId, startDate, endDate) {
    try {
      // Check if bike exists and is available
      const bike = await this.findById(bikeId);

      if (!bike.isAvailable) {
        return false;
      }

      // Check if there are any overlapping bookings
      const overlappingBookings = await Booking.countDocuments({
        bike: bikeId,
        $and: [
          { startDate: { $lte: new Date(endDate) } },
          { endDate: { $gte: new Date(startDate) } },
          { status: { $in: ['confirmed', 'pending'] } },
        ],
      });

      return overlappingBookings === 0;
    } catch (error) {
      this._handleError(error, 'checkAvailability');
    }
  }

  /**
   * Get popular bikes
   * @param {Number} limit - Number of bikes to return
   * @returns {Promise<Array>} Popular bikes
   */
  async getPopularBikes(limit = 5) {
    try {
      // Get bikes with most bookings
      const popularBikes = await Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$bike', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit, 10) },
      ]);

      // Get bike details
      const bikeIds = popularBikes.map(item => mongoose.Types.ObjectId(item._id));
      
      if (bikeIds.length === 0) {
        // If no bookings, return latest bikes
        return await this.model.find()
          .sort({ createdAt: -1 })
          .limit(parseInt(limit, 10))
          .populate('vendor', 'businessName businessAddress');
      }

      return await this.model.find({ _id: { $in: bikeIds } })
        .populate('vendor', 'businessName businessAddress');
    } catch (error) {
      this._handleError(error, 'getPopularBikes');
    }
  }

  /**
   * Add a review to a bike
   * @param {String} bikeId - Bike ID
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Updated bike
   */
  async addReview(bikeId, reviewData) {
    try {
      const bike = await this.findById(bikeId);

      // Add review to bike
      bike.reviews.push(reviewData);

      // Update average rating
      const totalRating = bike.reviews.reduce((sum, review) => sum + review.rating, 0);
      bike.rating = totalRating / bike.reviews.length;

      await bike.save();

      return bike;
    } catch (error) {
      this._handleError(error, 'addReview');
    }
  }
}

module.exports = new BikeService();
