/**
 * Service for advanced search and filtering
 */
const BikeService = require('./BikeService');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

class SearchService {
  /**
   * Search bikes with advanced filtering
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchBikes(queryParams) {
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
        features,
        rating,
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
        const brands = Array.isArray(brand) ? brand : [brand];
        filter.brand = { $in: brands };
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

      // Features filter
      if (features) {
        const featuresList = Array.isArray(features) ? features : features.split(',');
        filter.features = { $all: featuresList };
      }

      // Rating filter
      if (rating) {
        filter.rating = { $gte: Number(rating) };
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

      return await BikeService.findAll(filter, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get popular search terms
   * @param {Number} limit - Number of terms to return
   * @returns {Promise<Array>} Popular search terms
   */
  async getPopularSearchTerms(limit = 10) {
    try {
      // This would typically come from a search log or analytics
      // For now, we'll return popular brands and categories
      const popularBrands = await Bike.aggregate([
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit / 2, 10) },
      ]);

      const popularCategories = await Bike.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit / 2, 10) },
      ]);

      return [
        ...popularBrands.map(item => ({ term: item._id, type: 'brand', count: item.count })),
        ...popularCategories.map(item => ({ term: item._id, type: 'category', count: item.count })),
      ];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available locations
   * @returns {Promise<Array>} Available locations
   */
  async getAvailableLocations() {
    try {
      const locations = await Bike.aggregate([
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return locations.map(item => ({ location: item._id, count: item.count }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available brands
   * @returns {Promise<Array>} Available brands
   */
  async getAvailableBrands() {
    try {
      const brands = await Bike.aggregate([
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return brands.map(item => ({ brand: item._id, count: item.count }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available categories
   * @returns {Promise<Array>} Available categories
   */
  async getAvailableCategories() {
    try {
      const categories = await Bike.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return categories.map(item => ({ category: item._id, count: item.count }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get price range
   * @returns {Promise<Object>} Price range
   */
  async getPriceRange() {
    try {
      const priceRange = await Bike.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$pricePerDay' },
            maxPrice: { $max: '$pricePerDay' },
          },
        },
      ]);

      return priceRange.length > 0
        ? { minPrice: priceRange[0].minPrice, maxPrice: priceRange[0].maxPrice }
        : { minPrice: 0, maxPrice: 0 };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available features
   * @returns {Promise<Array>} Available features
   */
  async getAvailableFeatures() {
    try {
      const features = await Bike.aggregate([
        { $unwind: '$features' },
        { $group: { _id: '$features', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return features.map(item => ({ feature: item._id, count: item.count }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get search filters
   * @returns {Promise<Object>} Search filters
   */
  async getSearchFilters() {
    try {
      const [locations, brands, categories, priceRange, features] = await Promise.all([
        this.getAvailableLocations(),
        this.getAvailableBrands(),
        this.getAvailableCategories(),
        this.getPriceRange(),
        this.getAvailableFeatures(),
      ]);

      return {
        locations,
        brands,
        categories,
        priceRange,
        features,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SearchService();
