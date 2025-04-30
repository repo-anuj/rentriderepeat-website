const UserService = require('../services/UserService');
const AppError = require('../utils/AppError');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/**
 * @desc    Forgot password - generate reset token
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw AppError.validationError('Please provide an email address');
    }

    // Generate reset token
    const resetToken = await UserService.generateResetToken(email);

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Create message
    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link to reset your password:
      \n\n${resetUrl}\n\n
      This link will expire in 10 minutes.
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      // Send email
      await sendEmail({
        email,
        subject: 'Password Reset Token',
        message,
      });

      return successResponse(
        res,
        200,
        'Password reset email sent',
        { success: true }
      );
    } catch (err) {
      // If email fails, reset the token
      const user = await UserService.findOne({ email });
      
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }

      throw AppError.serverError('Email could not be sent');
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { resettoken } = req.params;

    if (!password) {
      throw AppError.validationError('Please provide a new password');
    }

    if (password.length < 6) {
      throw AppError.validationError('Password must be at least 6 characters');
    }

    // Reset password
    const user = await UserService.resetPassword(resettoken, password);

    // Create and send token
    const token = user.getSignedJwtToken();
    const refreshToken = user.getSignedRefreshToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
    }

    // Remove password from response
    user.password = undefined;

    // Get user role for frontend
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Set cookies and send response
    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        expires: new Date(
          Date.now() +
            process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 +
            7 * 24 * 60 * 60 * 1000
        ),
      })
      .json({
        success: true,
        message: 'Password reset successful',
        token,
        data: userData,
      });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify reset token
 * @route   GET /api/auth/resetpassword/:resettoken/verify
 * @access  Public
 */
exports.verifyResetToken = async (req, res, next) => {
  try {
    const { resettoken } = req.params;

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resettoken)
      .digest('hex');

    // Check if token exists and is not expired
    const user = await UserService.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw AppError.validationError('Invalid or expired token');
    }

    return successResponse(
      res,
      200,
      'Token is valid',
      { valid: true }
    );
  } catch (err) {
    next(err);
  }
};
