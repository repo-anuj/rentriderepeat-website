/**
 * Validation schemas for booking routes
 */

const { body } = require('express-validator');

/**
 * Validation rules for creating a booking
 */
const createBookingValidation = [
  body('bikeId')
    .notEmpty()
    .withMessage('Bike ID is required')
    .isMongoId()
    .withMessage('Invalid bike ID format'),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      
      return true;
    }),
  
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      
      return true;
    }),
  
  body('pickupTime')
    .optional()
    .isString()
    .withMessage('Pickup time must be a string'),
  
  body('dropoffTime')
    .optional()
    .isString()
    .withMessage('Dropoff time must be a string'),
  
  body('pickupLocation')
    .optional()
    .isString()
    .withMessage('Pickup location must be a string'),
  
  body('dropoffLocation')
    .optional()
    .isString()
    .withMessage('Dropoff location must be a string'),
  
  body('additionalRequirements')
    .optional()
    .isString()
    .withMessage('Additional requirements must be a string'),
];

/**
 * Validation rules for updating booking status
 */
const updateBookingStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed', 'rejected'])
    .withMessage('Invalid status value'),
];

/**
 * Validation rules for processing payment
 */
const processPaymentValidation = [
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash'])
    .withMessage('Invalid payment method'),
  
  body('paymentId')
    .optional()
    .isString()
    .withMessage('Payment ID must be a string'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value, { req }) => {
      if (value <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code')
    .default('INR'),
  
  body('status')
    .optional()
    .isIn(['success', 'pending', 'failed'])
    .withMessage('Invalid payment status'),
];

module.exports = {
  createBookingValidation,
  updateBookingStatusValidation,
  processPaymentValidation,
};
