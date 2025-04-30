const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const { verifyVendor } = require('../controllers/vendorVerification');

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Vendor verification routes
router.put('/vendors/:id/verify', verifyVendor);

module.exports = router;
