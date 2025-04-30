const SearchService = require('../services/SearchService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/responseHandler');

/**
 * @desc    Search bikes
 * @route   GET /api/search/bikes
 * @access  Public
 */
exports.searchBikes = async (req, res, next) => {
  try {
    const queryParams = req.query;

    // Search bikes
    const results = await SearchService.searchBikes(queryParams);

    return successResponse(
      res,
      200,
      'Search results retrieved successfully',
      results.data,
      {
        pagination: results.pagination,
        total: results.total,
        count: results.count
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get popular search terms
 * @route   GET /api/search/popular
 * @access  Public
 */
exports.getPopularSearchTerms = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Get popular search terms
    const terms = await SearchService.getPopularSearchTerms(limit);

    return successResponse(
      res,
      200,
      'Popular search terms retrieved successfully',
      terms
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get search filters
 * @route   GET /api/search/filters
 * @access  Public
 */
exports.getSearchFilters = async (req, res, next) => {
  try {
    // Get search filters
    const filters = await SearchService.getSearchFilters();

    return successResponse(
      res,
      200,
      'Search filters retrieved successfully',
      filters
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get available locations
 * @route   GET /api/search/locations
 * @access  Public
 */
exports.getAvailableLocations = async (req, res, next) => {
  try {
    // Get available locations
    const locations = await SearchService.getAvailableLocations();

    return successResponse(
      res,
      200,
      'Available locations retrieved successfully',
      locations
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get available brands
 * @route   GET /api/search/brands
 * @access  Public
 */
exports.getAvailableBrands = async (req, res, next) => {
  try {
    // Get available brands
    const brands = await SearchService.getAvailableBrands();

    return successResponse(
      res,
      200,
      'Available brands retrieved successfully',
      brands
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get available categories
 * @route   GET /api/search/categories
 * @access  Public
 */
exports.getAvailableCategories = async (req, res, next) => {
  try {
    // Get available categories
    const categories = await SearchService.getAvailableCategories();

    return successResponse(
      res,
      200,
      'Available categories retrieved successfully',
      categories
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get price range
 * @route   GET /api/search/price-range
 * @access  Public
 */
exports.getPriceRange = async (req, res, next) => {
  try {
    // Get price range
    const priceRange = await SearchService.getPriceRange();

    return successResponse(
      res,
      200,
      'Price range retrieved successfully',
      priceRange
    );
  } catch (err) {
    next(err);
  }
};
