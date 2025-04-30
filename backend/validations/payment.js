/**
 * Validation schemas for payment routes
 */

const { body } = require('express-validator');

/**
 * Validation rules for creating a payment order
 */
const createPaymentOrderValidation = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID format'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
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
];

/**
 * Validation rules for verifying a payment
 */
const verifyPaymentValidation = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID format'),
  
  body('razorpayOrderId')
    .notEmpty()
    .withMessage('Razorpay order ID is required')
    .isString()
    .withMessage('Razorpay order ID must be a string'),
  
  body('razorpayPaymentId')
    .notEmpty()
    .withMessage('Razorpay payment ID is required')
    .isString()
    .withMessage('Razorpay payment ID must be a string'),
  
  body('razorpaySignature')
    .notEmpty()
    .withMessage('Razorpay signature is required')
    .isString()
    .withMessage('Razorpay signature must be a string'),
];

/**
 * Validation rules for refunding a payment
 */
const refundPaymentValidation = [
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  
  body('speed')
    .optional()
    .isIn(['normal', 'optimum'])
    .withMessage('Speed must be either normal or optimum'),
  
  body('notes')
    .optional()
    .isObject()
    .withMessage('Notes must be an object'),
];

module.exports = {
  createPaymentOrderValidation,
  verifyPaymentValidation,
  refundPaymentValidation,
};
