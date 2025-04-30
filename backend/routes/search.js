const express = require("express");
const { searchLimiter } = require("../middleware/routeRateLimits");
const { cache } = require("../middleware/cache");

const {
  searchBikes,
  getPopularSearchTerms,
  getSearchFilters,
  getAvailableLocations,
  getAvailableBrands,
  getAvailableCategories,
  getPriceRange,
} = require("../controllers/search");

const router = express.Router();

// Apply specialized rate limiting for search routes
router.use(searchLimiter);

// Search bikes (cache for 5 minutes)
router.get("/bikes", cache(300), searchBikes);

// Get popular search terms (cache for 1 hour)
router.get("/popular", cache(3600), getPopularSearchTerms);

// Get search filters (cache for 1 hour)
router.get("/filters", cache(3600), getSearchFilters);

// Get available locations (cache for 1 hour)
router.get("/locations", cache(3600), getAvailableLocations);

// Get available brands (cache for 1 hour)
router.get("/brands", cache(3600), getAvailableBrands);

// Get available categories (cache for 1 hour)
router.get("/categories", cache(3600), getAvailableCategories);

// Get price range (cache for 1 hour)
router.get("/price-range", cache(3600), getPriceRange);

module.exports = router;
