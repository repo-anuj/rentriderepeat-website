/**
 * Service for user-related operations
 */
const BaseService = require('./BaseService');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Registered user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const userExists = await this.findOne({ email: userData.email });
      
      if (userExists) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400;
        throw error;
      }
      
      // Create user
      const user = await this.create(userData);
      
      return user;
    } catch (error) {
      this._handleError(error, 'register');
    }
  }

  /**
   * Register a new vendor
   * @param {Object} userData - User data
   * @param {Object} vendorData - Vendor data
   * @returns {Promise<Object>} Object containing user and vendor
   */
  async registerVendor(userData, vendorData) {
    try {
      // Use transaction to ensure both user and vendor are created or neither
      return await this.transaction(async (session) => {
        // Check if user already exists
        const userExists = await this.findOne({ email: userData.email });
        
        if (userExists) {
          const error = new Error('User with this email already exists');
          error.statusCode = 400;
          throw error;
        }
        
        // Create user with vendor role
        userData.role = 'vendor';
        const user = await User.create([userData], { session })[0];
        
        // Create vendor profile
        vendorData.user = user._id;
        const vendor = await Vendor.create([vendorData], { session })[0];
        
        return { user, vendor };
      });
    } catch (error) {
      this._handleError(error, 'registerVendor');
    }
  }

  /**
   * Authenticate a user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} Authenticated user
   */
  async authenticate(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }
      
      // Check if account is locked
      if (user.lockUntil && user.lockUntil > Date.now()) {
        const error = new Error('Account is locked. Try again later');
        error.statusCode = 401;
        throw error;
      }
      
      // Check if password matches
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        // Increment login attempts
        user.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
        }
        
        await user.save({ validateBeforeSave: false });
        
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }
      
      // Reset login attempts and lock
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      
      return user;
    } catch (error) {
      this._handleError(error, 'authenticate');
    }
  }

  /**
   * Get user profile with vendor details if applicable
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    try {
      const user = await this.findById(userId);
      
      // If user is a vendor, get vendor details as well
      if (user.role === 'vendor') {
        const vendor = await Vendor.findOne({ user: user._id });
        return { user, vendor };
      }
      
      return { user };
    } catch (error) {
      this._handleError(error, 'getProfile');
    }
  }

  /**
   * Update user details
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateDetails(userId, updateData) {
    try {
      // Remove fields that aren't allowed to be updated
      const { password, role, ...allowedUpdates } = updateData;
      
      const user = await this.update(userId, allowedUpdates);
      
      return user;
    } catch (error) {
      this._handleError(error, 'updateDetails');
    }
  }

  /**
   * Update user password
   * @param {String} userId - User ID
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      
      // Check current password
      if (!(await user.matchPassword(currentPassword))) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      return user;
    } catch (error) {
      this._handleError(error, 'updatePassword');
    }
  }

  /**
   * Generate password reset token
   * @param {String} email - User email
   * @returns {Promise<String>} Reset token
   */
  async generateResetToken(email) {
    try {
      const user = await this.findOne({ email });
      
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      
      return resetToken;
    } catch (error) {
      this._handleError(error, 'generateResetToken');
    }
  }

  /**
   * Reset password using token
   * @param {String} token - Reset token
   * @param {String} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  async resetPassword(token, newPassword) {
    try {
      // Hash token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      
      // Find user by token and check if token is still valid
      const user = await this.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      
      if (!user) {
        const error = new Error('Invalid or expired token');
        error.statusCode = 400;
        throw error;
      }
      
      // Set new password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      
      await user.save();
      
      return user;
    } catch (error) {
      this._handleError(error, 'resetPassword');
    }
  }

  /**
   * Refresh access token
   * @param {String} refreshToken - Refresh token
   * @returns {Promise<Object>} User
   */
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        const error = new Error('No refresh token provided');
        error.statusCode = 401;
        throw error;
      }
      
      // Verify refresh token
      try {
        // First get the payload without verification to extract the user ID
        const payload = jwt.decode(refreshToken);
        
        if (!payload || !payload.id) {
          const error = new Error('Invalid refresh token');
          error.statusCode = 401;
          throw error;
        }
        
        // Find the user
        const user = await User.findById(payload.id).select('+password');
        
        if (!user) {
          const error = new Error('User not found');
          error.statusCode = 401;
          throw error;
        }
        
        // Verify the refresh token with user-specific secret
        jwt.verify(
          refreshToken, 
          process.env.JWT_SECRET + user.password.substring(0, 10)
        );
        
        // Check if token is valid in database
        if (!user.verifyRefreshToken(refreshToken)) {
          const error = new Error('Invalid refresh token');
          error.statusCode = 401;
          throw error;
        }
        
        return user;
      } catch (error) {
        error.statusCode = 401;
        throw error;
      }
    } catch (error) {
      this._handleError(error, 'refreshToken');
    }
  }
}

module.exports = new UserService();
