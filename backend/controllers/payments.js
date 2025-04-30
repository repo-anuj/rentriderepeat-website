const PaymentService = require('../services/PaymentService');
const BookingService = require('../services/BookingService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Create payment order
 * @route   POST /api/payments/order
 * @access  Private
 */
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, amount, currency = 'INR' } = req.body;

    if (!bookingId || !amount) {
      throw AppError.validationError('Booking ID and amount are required');
    }

    // Get booking
    const booking = await BookingService.findById(bookingId);

    // Check if booking exists and belongs to user
    if (!booking) {
      throw AppError.notFound('Booking not found');
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw AppError.forbidden('Not authorized to create payment for this booking');
    }

    // Check if booking is already paid
    if (booking.paymentDetails && booking.paymentDetails.paidAt) {
      throw AppError.conflict('Booking is already paid');
    }

    // Create order
    const order = await PaymentService.createOrder({
      amount,
      currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        userId: req.user.id,
        userEmail: req.user.email,
      },
    });

    return successResponse(
      res,
      200,
      'Payment order created successfully',
      {
        orderId: order.id,
        amount: order.amount / 100, // Convert from paise to rupees
        currency: order.currency,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID,
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw AppError.validationError('Missing required payment verification fields');
    }

    // Verify payment signature
    const isValid = await PaymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      throw AppError.validationError('Invalid payment signature');
    }

    // Get payment details
    const paymentDetails = await PaymentService.getPaymentDetails(razorpayPaymentId);

    // Process payment in booking
    const booking = await BookingService.processPayment(bookingId, {
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      paymentMethod: 'razorpay',
      amount: paymentDetails.amount / 100, // Convert from paise to rupees
      currency: paymentDetails.currency,
      status: paymentDetails.status,
    });

    // Send payment confirmation email
    try {
      const message = `
        Your payment has been processed successfully!
        
        Booking Details:
        - Booking ID: ${booking._id}
        - Start Date: ${new Date(booking.startDate).toLocaleDateString()}
        - End Date: ${new Date(booking.endDate).toLocaleDateString()}
        - Duration: ${booking.duration} days
        - Total Amount: ${booking.totalAmount} ${booking.currency || 'INR'}
        
        Payment Details:
        - Payment ID: ${razorpayPaymentId}
        - Order ID: ${razorpayOrderId}
        - Amount Paid: ${paymentDetails.amount / 100} ${paymentDetails.currency}
        - Payment Status: ${paymentDetails.status}
        
        Thank you for choosing BikeRent!
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'Payment Confirmation - BikeRent',
        message,
      });
    } catch (err) {
      // Continue even if email fails
      console.error('Payment confirmation email failed:', err);
    }

    return successResponse(
      res,
      200,
      'Payment verified successfully',
      { booking }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get payment details
 * @route   GET /api/payments/:paymentId
 * @access  Private
 */
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    // Get payment details
    const payment = await PaymentService.getPaymentDetails(paymentId);

    return successResponse(
      res,
      200,
      'Payment details retrieved successfully',
      payment
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Refund payment
 * @route   POST /api/payments/:paymentId/refund
 * @access  Private/Admin
 */
exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { amount, notes } = req.body;

    // Refund payment
    const refund = await PaymentService.refundPayment(paymentId, {
      amount,
      notes,
    });

    return successResponse(
      res,
      200,
      'Payment refunded successfully',
      refund
    );
  } catch (err) {
    next(err);
  }
};
