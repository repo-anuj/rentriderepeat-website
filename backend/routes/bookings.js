const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  processPayment,
  getBookingStats
} = require('../controllers/bookings');

const {
  createBookingValidation,
  updateBookingStatusValidation,
  processPaymentValidation
} = require('../validations/booking');

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Protect all booking routes
router.use(protect);

// Get all bookings for the logged-in user
router.get('/', getBookings);

// Get booking statistics (admin only)
router.get('/stats', authorize('admin'), getBookingStats);

// Create a new booking
router.post('/', validate(createBookingValidation), createBooking);

// Get a single booking
router.get('/:id', getBookingById);

// Update booking status
router.put('/:id/status', validate(updateBookingStatusValidation), updateBookingStatus);

// Process payment for a booking
router.post('/:id/payment', validate(processPaymentValidation), processPayment);

module.exports = router;
