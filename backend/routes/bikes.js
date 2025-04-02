const express = require('express');
const { 
  getBikes,
  getBike, 
  createBike,
  updateBike,
  deleteBike,
  uploadBikePhoto,
  addBikeRating
} = require('../controllers/bikes');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getBikes);
router.get('/:id', getBike);

// Protected routes
router.post('/', protect, authorize('vendor', 'admin'), createBike);
router.put('/:id', protect, authorize('vendor', 'admin'), updateBike);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteBike);
router.put('/:id/photo', protect, authorize('vendor', 'admin'), uploadBikePhoto);
router.post('/:id/ratings', protect, addBikeRating);

module.exports = router; 