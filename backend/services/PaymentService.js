/**
 * Payment service for Razorpay integration
 */
const Razorpay = require('razorpay');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Initialize Razorpay if keys are available
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  logger.info('Razorpay initialized successfully');
} else {
  logger.warn('Razorpay keys not found in environment variables. Payment features will be disabled.');
  // Create a mock razorpay object for development
  razorpay = {
    orders: {
      create: () => {
        logger.warn('Attempted to create Razorpay order without API keys');
        return { id: 'mock_order_id', amount: 0, currency: 'INR', receipt: 'mock_receipt' };
      }
    },
    payments: {
      fetch: () => {
        logger.warn('Attempted to fetch Razorpay payment without API keys');
        return { id: 'mock_payment_id', amount: 0, status: 'created' };
      },
      refund: () => {
        logger.warn('Attempted to refund Razorpay payment without API keys');
        return { id: 'mock_refund_id', amount: 0, status: 'created' };
      }
    },
    refunds: {
      fetch: () => {
        logger.warn('Attempted to fetch Razorpay refund without API keys');
        return { id: 'mock_refund_id', amount: 0, status: 'created' };
      }
    }
  };
}

class PaymentService {
  /**
   * Create a new payment order
   * @param {Object} orderData - Order data
   * @param {Number} orderData.amount - Amount in paise (INR)
   * @param {String} orderData.currency - Currency code (default: INR)
   * @param {String} orderData.receipt - Receipt ID
   * @param {Object} orderData.notes - Additional notes
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const { amount, currency = 'INR', receipt, notes } = orderData;

      // Validate amount
      if (!amount || amount <= 0) {
        throw AppError.validationError('Amount must be greater than 0');
      }

      // Create order
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        notes,
      });

      logger.info('Payment order created', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });

      return order;
    } catch (error) {
      logger.error('Error creating payment order', {
        error: error.message,
        orderData,
      });
      throw error;
    }
  }

  /**
   * Verify payment signature
   * @param {Object} paymentData - Payment data
   * @param {String} paymentData.razorpayOrderId - Razorpay order ID
   * @param {String} paymentData.razorpayPaymentId - Razorpay payment ID
   * @param {String} paymentData.razorpaySignature - Razorpay signature
   * @returns {Promise<Boolean>} True if signature is valid, false otherwise
   */
  async verifyPayment(paymentData) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;

      // Validate required fields
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw AppError.validationError('Missing required payment verification fields');
      }

      // Create signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      // Verify signature
      const isValid = expectedSignature === razorpaySignature;

      logger.info('Payment verification', {
        razorpayOrderId,
        razorpayPaymentId,
        isValid,
      });

      return isValid;
    } catch (error) {
      logger.error('Error verifying payment', {
        error: error.message,
        paymentData,
      });
      throw error;
    }
  }

  /**
   * Get payment details
   * @param {String} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);

      logger.info('Payment details fetched', {
        paymentId,
        amount: payment.amount,
        status: payment.status,
      });

      return payment;
    } catch (error) {
      logger.error('Error fetching payment details', {
        error: error.message,
        paymentId,
      });
      throw error;
    }
  }

  /**
   * Refund payment
   * @param {String} paymentId - Razorpay payment ID
   * @param {Object} refundData - Refund data
   * @param {Number} refundData.amount - Amount to refund in paise (INR)
   * @param {Boolean} refundData.speed - Refund speed (normal or optimum)
   * @param {String} refundData.notes - Additional notes
   * @returns {Promise<Object>} Refund details
   */
  async refundPayment(paymentId, refundData = {}) {
    try {
      const { amount, speed = 'normal', notes } = refundData;

      const refund = await razorpay.payments.refund(paymentId, {
        amount,
        speed,
        notes,
      });

      logger.info('Payment refunded', {
        paymentId,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      });

      return refund;
    } catch (error) {
      logger.error('Error refunding payment', {
        error: error.message,
        paymentId,
        refundData,
      });
      throw error;
    }
  }

  /**
   * Get refund details
   * @param {String} refundId - Razorpay refund ID
   * @returns {Promise<Object>} Refund details
   */
  async getRefundDetails(refundId) {
    try {
      const refund = await razorpay.refunds.fetch(refundId);

      logger.info('Refund details fetched', {
        refundId,
        amount: refund.amount,
        status: refund.status,
      });

      return refund;
    } catch (error) {
      logger.error('Error fetching refund details', {
        error: error.message,
        refundId,
      });
      throw error;
    }
  }
}

module.exports = new PaymentService();
