/**
 * Service for booking-related operations
 */
const BaseService = require('./BaseService');
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const User = require('../models/User');
const BikeService = require('./BikeService');

class BookingService extends BaseService {
  constructor() {
    super(Booking);
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData, userId) {
    try {
      const { bikeId, startDate, endDate, ...otherData } = bookingData;

      // Check if bike exists
      const bike = await Bike.findById(bikeId);
      if (!bike) {
        const error = new Error('Bike not found');
        error.statusCode = 404;
        throw error;
      }

      // Check if bike is available for the requested dates
      const isAvailable = await BikeService.checkAvailability(bikeId, startDate, endDate);
      if (!isAvailable) {
        const error = new Error('Bike is not available for the selected dates');
        error.statusCode = 400;
        throw error;
      }

      // Calculate booking duration in days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationInMs = end.getTime() - start.getTime();
      const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

      // Calculate booking amount
      const baseAmount = bike.pricePerDay * durationInDays;
      const gstAmount = baseAmount * 0.18; // 18% GST
      const totalAmount = baseAmount + gstAmount;

      // Create booking
      const bookingDetails = {
        user: userId,
        bike: bikeId,
        vendor: bike.vendor,
        startDate,
        endDate,
        duration: durationInDays,
        baseAmount,
        gstAmount,
        totalAmount,
        status: 'pending',
        ...otherData,
      };

      return await this.create(bookingDetails);
    } catch (error) {
      this._handleError(error, 'createBooking');
    }
  }

  /**
   * Get bookings by user ID
   * @param {String} userId - User ID
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Bookings with pagination metadata
   */
  async getUserBookings(userId, queryParams) {
    try {
      const { status, page = 1, limit = 10, sort = '-createdAt' } = queryParams;

      // Build filter object
      const filter = { user: userId };

      // Status filter
      if (status) {
        filter.status = status;
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

      // Get bookings with pagination
      const options = {
        sort: sortOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: [
          { path: 'bike', select: 'name brand model images pricePerDay' },
          { path: 'vendor', select: 'businessName businessAddress' },
        ],
      };

      return await this.findAll(filter, options);
    } catch (error) {
      this._handleError(error, 'getUserBookings');
    }
  }

  /**
   * Get bookings by vendor ID
   * @param {String} vendorId - Vendor ID
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Bookings with pagination metadata
   */
  async getVendorBookings(vendorId, queryParams) {
    try {
      const { status, page = 1, limit = 10, sort = '-createdAt' } = queryParams;

      // Build filter object
      const filter = { vendor: vendorId };

      // Status filter
      if (status) {
        filter.status = status;
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

      // Get bookings with pagination
      const options = {
        sort: sortOptions,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: [
          { path: 'bike', select: 'name brand model images pricePerDay' },
          { path: 'user', select: 'name email phone' },
        ],
      };

      return await this.findAll(filter, options);
    } catch (error) {
      this._handleError(error, 'getVendorBookings');
    }
  }

  /**
   * Get booking by ID
   * @param {String} id - Booking ID
   * @param {String} userId - User ID
   * @param {String} role - User role
   * @returns {Promise<Object>} Booking details
   */
  async getBookingById(id, userId, role) {
    try {
      const booking = await this.findById(id, {
        populate: [
          { path: 'bike', populate: { path: 'vendor', select: 'businessName businessAddress' } },
          { path: 'user', select: 'name email phone location address' },
        ],
      });

      // Check if user is authorized to view this booking
      if (role === 'admin') {
        return booking;
      } else if (role === 'vendor' && booking.vendor.toString() === userId) {
        return booking;
      } else if (booking.user._id.toString() === userId) {
        return booking;
      } else {
        const error = new Error('Not authorized to view this booking');
        error.statusCode = 403;
        throw error;
      }
    } catch (error) {
      this._handleError(error, 'getBookingById');
    }
  }

  /**
   * Update booking status
   * @param {String} id - Booking ID
   * @param {String} status - New status
   * @param {String} userId - User ID
   * @param {String} role - User role
   * @returns {Promise<Object>} Updated booking
   */
  async updateBookingStatus(id, status, userId, role) {
    try {
      const booking = await this.findById(id);

      // Check if user is authorized to update this booking
      if (role === 'admin') {
        // Admin can update any booking
      } else if (role === 'vendor' && booking.vendor.toString() === userId) {
        // Vendor can only update their own bookings
        if (!['confirmed', 'rejected', 'completed'].includes(status)) {
          const error = new Error('Vendors can only confirm, reject, or complete bookings');
          error.statusCode = 400;
          throw error;
        }
      } else if (booking.user.toString() === userId) {
        // User can only cancel their own bookings
        if (status !== 'cancelled') {
          const error = new Error('Users can only cancel their bookings');
          error.statusCode = 400;
          throw error;
        }

        // Check if booking can be cancelled
        if (!['pending', 'confirmed'].includes(booking.status)) {
          const error = new Error('Only pending or confirmed bookings can be cancelled');
          error.statusCode = 400;
          throw error;
        }

        // Check if cancellation is within 24 hours of start date
        const now = new Date();
        const startDate = new Date(booking.startDate);
        const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilStart < 24) {
          const error = new Error('Bookings cannot be cancelled within 24 hours of start time');
          error.statusCode = 400;
          throw error;
        }
      } else {
        const error = new Error('Not authorized to update this booking');
        error.statusCode = 403;
        throw error;
      }

      // Update booking status
      booking.status = status;

      // Add status update timestamp
      booking.statusUpdates.push({
        status,
        updatedBy: userId,
        updatedAt: Date.now(),
      });

      await booking.save();

      return booking;
    } catch (error) {
      this._handleError(error, 'updateBookingStatus');
    }
  }

  /**
   * Process payment for a booking
   * @param {String} bookingId - Booking ID
   * @param {Object} paymentDetails - Payment details
   * @returns {Promise<Object>} Updated booking
   */
  async processPayment(bookingId, paymentDetails) {
    try {
      const booking = await this.findById(bookingId);

      if (booking.status !== 'pending') {
        const error = new Error('Payment can only be processed for pending bookings');
        error.statusCode = 400;
        throw error;
      }

      // Update booking with payment details
      booking.paymentDetails = {
        ...paymentDetails,
        paidAt: Date.now(),
      };

      // Update booking status
      booking.status = 'confirmed';

      // Add status update
      booking.statusUpdates.push({
        status: 'confirmed',
        updatedBy: booking.user,
        updatedAt: Date.now(),
      });

      await booking.save();

      return booking;
    } catch (error) {
      this._handleError(error, 'processPayment');
    }
  }

  /**
   * Get booking statistics for a vendor
   * @param {String} vendorId - Vendor ID
   * @returns {Promise<Object>} Booking statistics
   */
  async getVendorStats(vendorId) {
    try {
      // Get total bookings count by status
      const statusCounts = await this.model.aggregate([
        { $match: { vendor: mongoose.Types.ObjectId(vendorId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      // Get total revenue
      const revenue = await this.model.aggregate([
        { 
          $match: { 
            vendor: mongoose.Types.ObjectId(vendorId),
            status: 'completed',
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);

      // Get monthly revenue for the current year
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = await this.model.aggregate([
        {
          $match: {
            vendor: mongoose.Types.ObjectId(vendorId),
            status: 'completed',
            createdAt: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            total: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Format status counts
      const formattedStatusCounts = statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      // Format monthly revenue
      const formattedMonthlyRevenue = Array(12).fill(0);
      monthlyRevenue.forEach(item => {
        formattedMonthlyRevenue[item._id - 1] = item.total;
      });

      return {
        totalBookings: await this.count({ vendor: vendorId }),
        statusCounts: formattedStatusCounts,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
        monthlyRevenue: formattedMonthlyRevenue,
      };
    } catch (error) {
      this._handleError(error, 'getVendorStats');
    }
  }
}

module.exports = new BookingService();
