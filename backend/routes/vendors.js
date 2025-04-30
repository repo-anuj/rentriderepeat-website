const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');

const {
  getVendorProfile,
  updateVendorProfile,
  getVendorDashboard,
  getAllVendors,
  getVendorById,
  validateGST,
  validatePAN
} = require('../controllers/vendors');

const {
  submitDocuments,
  getVerificationStatus
} = require('../controllers/vendorVerification');

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Public routes
router.post('/validate/gst', validateGST);
router.post('/validate/pan', validatePAN);

// Vendor routes (protected)
router.use(protect);

// Vendor profile routes
router.get('/profile', authorize('vendor'), getVendorProfile);
router.put('/profile', authorize('vendor'), updateVendorProfile);
router.get('/dashboard', authorize('vendor'), getVendorDashboard);

// Vendor verification routes
router.post('/documents', authorize('vendor'), submitDocuments);
router.get('/verification', authorize('vendor'), getVerificationStatus);

// Admin routes
router.get('/', authorize('admin'), getAllVendors);
router.get('/:id', authorize('admin'), getVendorById);

module.exports = router;
