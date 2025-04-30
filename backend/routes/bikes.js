const express = require("express");
const {
  getBikes,
  getBike,
  createBike,
  updateBike,
  deleteBike,
  uploadBikePhoto,
  addBikeRating,
} = require("../controllers/bikes");

const { protect, authorize } = require("../middleware/auth");
const { cache, clearCache } = require("../middleware/cache");

const router = express.Router();

// Public routes (with caching)
router.get("/", cache(300), getBikes);
router.get("/:id", cache(300), getBike);

// Protected routes (with cache clearing)
router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  clearCache("bikes:*"),
  createBike
);
router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  clearCache(["bikes:*", "search:*"]),
  updateBike
);
router.delete(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  clearCache(["bikes:*", "search:*"]),
  deleteBike
);
router.put(
  "/:id/photo",
  protect,
  authorize("vendor", "admin"),
  clearCache("bikes:*"),
  uploadBikePhoto
);
router.post("/:id/ratings", protect, clearCache("bikes:*"), addBikeRating);

module.exports = router;
