const UserService = require('../services/UserService');
const AppError = require('../utils/AppError');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @desc    Send verification email
 * @route   POST /api/auth/verify/send
 * @access  Private
 */
exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await UserService.findById(userId);

    // Check if already verified
    if (user.isVerified) {
      throw AppError.conflict('Email already verified');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to verificationToken field
    user.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Set expire
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;

    // Create message
    const message = `
      Thank you for registering with BikeRent.
      Please click on the following link to verify your email address:
      \n\n${verificationUrl}\n\n
      This link will expire in 24 hours.
      If you did not register with us, please ignore this email.
    `;

    try {
      // Send email
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message,
      });

      return successResponse(
        res,
        200,
        'Verification email sent',
        { success: true }
      );
    } catch (err) {
      // If email fails, reset the token
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      throw AppError.serverError('Email could not be sent');
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hash token
    const verificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with token
    const user = await UserService.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw AppError.validationError('Invalid or expired token');
    }

    // Set user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return successResponse(
      res,
      200,
      'Email verified successfully',
      { success: true }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Check verification status
 * @route   GET /api/auth/verify/status
 * @access  Private
 */
exports.checkVerificationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await UserService.findById(userId);

    return successResponse(
      res,
      200,
      'Verification status',
      { isVerified: user.isVerified }
    );
  } catch (err) {
    next(err);
  }
};
