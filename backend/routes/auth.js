const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  registerVendor,
  refreshToken,
} = require("../controllers/auth");

const {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/passwordReset");

const {
  sendVerificationEmail,
  verifyEmail,
  checkVerificationStatus,
} = require("../controllers/emailVerification");

const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimit");
const validate = require("../middleware/validate");
const {
  registerValidation,
  registerVendorValidation,
  loginValidation,
  updateDetailsValidation,
  updatePasswordValidation,
} = require("../validations/auth");

const router = express.Router();

// Apply rate limiting to authentication routes
router.use(authLimiter);

// Registration routes
router.post("/register", validate(registerValidation), register);
router.post(
  "/register/vendor",
  validate(registerVendorValidation),
  registerVendor
);

// Authentication routes
router.post("/login", validate(loginValidation), login);
router.post("/refresh-token", refreshToken);
router.get("/logout", protect, logout);

// Password reset routes
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/resetpassword/:resettoken/verify", verifyResetToken);

// Email verification routes
router.post("/verify/send", protect, sendVerificationEmail);
router.get("/verify/:token", verifyEmail);
router.get("/verify/status", protect, checkVerificationStatus);

// User profile routes
router.get("/me", protect, getMe);
router.put(
  "/updatedetails",
  protect,
  validate(updateDetailsValidation),
  updateDetails
);
router.put(
  "/updatepassword",
  protect,
  validate(updatePasswordValidation),
  updatePassword
);

module.exports = router;
