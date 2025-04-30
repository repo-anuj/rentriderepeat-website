/**
 * Service for vendor-related operations
 */
const BaseService = require('./BaseService');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');

class VendorService extends BaseService {
  constructor() {
    super(Vendor);
  }

  /**
   * Get vendor profile by user ID
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Vendor profile
   */
  async getVendorProfile(userId) {
    try {
      const vendor = await this.findOne({ user: userId });
      
      if (!vendor) {
        const error = new Error('Vendor profile not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Get user details
      const user = await User.findById(userId).select('-password');
      
      return { vendor, user };
    } catch (error) {
      this._handleError(error, 'getVendorProfile');
    }
  }

  /**
   * Update vendor profile
   * @param {String} userId - User ID
   * @param {Object} vendorData - Vendor data to update
   * @returns {Promise<Object>} Updated vendor profile
   */
  async updateVendorProfile(userId, vendorData) {
    try {
      const vendor = await this.findOne({ user: userId });
      
      if (!vendor) {
        const error = new Error('Vendor profile not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Update vendor profile
      const updatedVendor = await this.update(vendor._id, vendorData);
      
      return updatedVendor;
    } catch (error) {
      this._handleError(error, 'updateVendorProfile');
    }
  }

  /**
   * Get vendor dashboard data
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Dashboard data
   */
  async getVendorDashboard(userId) {
    try {
      const vendor = await this.findOne({ user: userId });
      
      if (!vendor) {
        const error = new Error('Vendor profile not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Get bikes count
      const bikesCount = await Bike.countDocuments({ vendor: vendor._id });
      
      // Get bookings count by status
      const pendingBookings = await Booking.countDocuments({ 
        vendor: vendor._id,
        status: 'pending'
      });
      
      const confirmedBookings = await Booking.countDocuments({ 
        vendor: vendor._id,
        status: 'confirmed'
      });
      
      const completedBookings = await Booking.countDocuments({ 
        vendor: vendor._id,
        status: 'completed'
      });
      
      const cancelledBookings = await Booking.countDocuments({ 
        vendor: vendor._id,
        status: 'cancelled'
      });
      
      // Get total revenue
      const revenueData = await Booking.aggregate([
        {
          $match: {
            vendor: vendor._id,
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
      
      // Get recent bookings
      const recentBookings = await Booking.find({ vendor: vendor._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('bike', 'name brand model')
        .populate('user', 'name email');
      
      return {
        vendor,
        stats: {
          bikesCount,
          bookings: {
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
            total: pendingBookings + confirmedBookings + completedBookings + cancelledBookings
          },
          totalRevenue
        },
        recentBookings
      };
    } catch (error) {
      this._handleError(error, 'getVendorDashboard');
    }
  }

  /**
   * Verify vendor documents
   * @param {String} vendorId - Vendor ID
   * @param {Boolean} isVerified - Verification status
   * @param {String} adminId - Admin user ID
   * @returns {Promise<Object>} Updated vendor
   */
  async verifyVendor(vendorId, isVerified, adminId) {
    try {
      const vendor = await this.findById(vendorId);
      
      if (!vendor) {
        const error = new Error('Vendor not found');
        error.statusCode = 404;
        throw error;
      }
      
      // Update vendor verification status
      vendor.isVerified = isVerified;
      vendor.verifiedBy = adminId;
      vendor.verifiedAt = Date.now();
      
      await vendor.save();
      
      // Update user verification status
      await User.findByIdAndUpdate(vendor.user, { isVerified });
      
      return vendor;
    } catch (error) {
      this._handleError(error, 'verifyVendor');
    }
  }

  /**
   * Get all vendors with pagination
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Vendors with pagination metadata
   */
  async getAllVendors(queryParams) {
    try {
      const { 
        isVerified, 
        search,
        page = 1, 
        limit = 10,
        sort = '-createdAt'
      } = queryParams;
      
      // Build filter object
      const filter = {};
      
      // Verification status filter
      if (isVerified !== undefined) {
        filter.isVerified = isVerified === 'true';
      }
      
      // Search filter
      if (search) {
        // Get user IDs matching the search
        const users = await User.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }).select('_id');
        
        const userIds = users.map(user => user._id);
        
        filter.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { businessAddress: { $regex: search, $options: 'i' } },
          { user: { $in: userIds } }
        ];
      }
      
      // Prepare sort options
      let sortOptions = {};
      if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
          if (field.startsWith('-')) {
            sortOptions[field.substring(1)] = -1;
          } else {
            sortOptions[field] = 1;
          }
        });
      }
      
      // Get vendors with pagination
      const options = {
        sort: sortOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: { path: 'user', select: 'name email phone' }
      };
      
      return await this.findAll(filter, options);
    } catch (error) {
      this._handleError(error, 'getAllVendors');
    }
  }

  /**
   * Get vendor by ID with user details
   * @param {String} id - Vendor ID
   * @returns {Promise<Object>} Vendor with user details
   */
  async getVendorById(id) {
    try {
      return await this.findById(id, {
        populate: { path: 'user', select: 'name email phone isVerified' }
      });
    } catch (error) {
      this._handleError(error, 'getVendorById');
    }
  }

  /**
   * Validate GST number
   * @param {String} gstNumber - GST number to validate
   * @returns {Promise<Boolean>} True if valid, false otherwise
   */
  async validateGST(gstNumber) {
    try {
      // GST number format: 2 digits state code + 10 digits PAN + 1 digit entity number + 1 digit check digit + Z
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      
      if (!gstRegex.test(gstNumber)) {
        return false;
      }
      
      // Additional validation logic can be added here
      // For example, checking the state code, PAN validity, etc.
      
      return true;
    } catch (error) {
      this._handleError(error, 'validateGST');
    }
  }

  /**
   * Validate PAN number
   * @param {String} panNumber - PAN number to validate
   * @returns {Promise<Boolean>} True if valid, false otherwise
   */
  async validatePAN(panNumber) {
    try {
      // PAN number format: 5 letters + 4 digits + 1 letter
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      
      if (!panRegex.test(panNumber)) {
        return false;
      }
      
      return true;
    } catch (error) {
      this._handleError(error, 'validatePAN');
    }
  }
}

module.exports = new VendorService();
