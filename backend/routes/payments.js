const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { paymentLimiter } = require("../middleware/routeRateLimits");
const validate = require("../middleware/validate");

const {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
} = require("../controllers/payments");

const {
  createPaymentOrderValidation,
  verifyPaymentValidation,
  refundPaymentValidation,
} = require("../validations/payment");

const router = express.Router();

// Apply specialized rate limiting for payment routes
router.use(paymentLimiter);

// Protect all payment routes
router.use(protect);

// Create payment order
router.post(
  "/order",
  validate(createPaymentOrderValidation),
  createPaymentOrder
);

// Verify payment
router.post("/verify", validate(verifyPaymentValidation), verifyPayment);

// Get payment details
router.get("/:paymentId", getPaymentDetails);

// Refund payment (admin only)
router.post(
  "/:paymentId/refund",
  authorize("admin"),
  validate(refundPaymentValidation),
  refundPayment
);

module.exports = router;
