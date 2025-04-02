const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    // Copy query parameters
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Booking.find(JSON.parse(queryStr))
      .populate({
        path: 'user',
        select: 'name email phone',
      })
      .populate({
        path: 'bike',
        select: 'name brand model dailyRate images',
      })
      .populate({
        path: 'vendor',
        select: 'businessName user',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bookings = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'bike',
        select: 'name brand model dailyRate images',
      })
      .populate({
        path: 'vendor',
        select: 'businessName user',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
// @access  Private/Vendor
exports.getVendorBookings = async (req, res, next) => {
  try {
    // Find vendor id associated with user
    const vendor = await Vendor.findOne({ user: req.user.id });
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    const bookings = await Booking.find({ vendor: vendor._id })
      .populate({
        path: 'user',
        select: 'name email phone',
      })
      .populate({
        path: 'bike',
        select: 'name brand model dailyRate images',
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone',
      })
      .populate({
        path: 'bike',
        select: 'name brand model dailyRate images',
      })
      .populate({
        path: 'vendor',
        select: 'businessName user',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user is owner of booking, vendor of the bike, or admin
    const vendor = await Vendor.findOne({ user: req.user.id });
    
    if (
      booking.user.toString() !== req.user.id && 
      (!vendor || booking.vendor.toString() !== vendor._id.toString()) && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Check if bike exists
    const bike = await Bike.findById(req.body.bike);
    
    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }
    
    // Get vendor from bike
    req.body.vendor = bike.vendor;
    
    // Add user to request body
    req.body.user = req.user.id;
    
    // Check if bike is available for the requested dates
    const { startDate, endDate } = req.body;
    
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date',
      });
    }
    
    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be in the past',
      });
    }
    
    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      bike: bike._id,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
      status: { $nin: ['cancelled', 'rejected'] },
    });
    
    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Bike is not available for the requested dates',
      });
    }
    
    // Calculate total price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    req.body.totalPrice = days * bike.dailyRate;
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status',
      });
    }
    
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }
    
    // Determine who can update status
    const vendor = await Vendor.findOne({ user: req.user.id });
    const isVendor = vendor && booking.vendor.toString() === vendor._id.toString();
    const isUser = booking.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Status transition rules
    if (isUser) {
      // Users can only cancel their own bookings
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          error: 'Users can only cancel bookings',
        });
      }
      
      // Users can only cancel pending or confirmed bookings
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot cancel booking with status: ' + booking.status,
        });
      }
    } else if (isVendor) {
      // Vendors can confirm, reject, or complete bookings
      if (!['confirmed', 'rejected', 'completed'].includes(status)) {
        return res.status(403).json({
          success: false,
          error: 'Vendors can only confirm, reject, or complete bookings',
        });
      }
      
      // Vendors can only confirm or reject pending bookings
      if (status === 'confirmed' || status === 'rejected') {
        if (booking.status !== 'pending') {
          return res.status(400).json({
            success: false,
            error: `Cannot ${status} booking with status: ${booking.status}`,
          });
        }
      }
      
      // Vendors can only complete confirmed bookings
      if (status === 'completed' && booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          error: 'Cannot complete booking with status: ' + booking.status,
        });
      }
    } else if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
      });
    }
    
    // Update booking status
    booking.status = status;
    booking.statusUpdatedBy = req.user.id;
    booking.statusUpdatedAt = Date.now();
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add payment info to booking
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.addBookingPayment = async (req, res, next) => {
  try {
    const { transactionId, paymentMethod } = req.body;
    
    if (!transactionId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Please provide transaction ID and payment method',
      });
    }
    
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }
    
    // Only the booking user or admin can add payment
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
      });
    }
    
    // Update payment info
    booking.payment = {
      transactionId,
      method: paymentMethod,
      date: Date.now(),
    };
    booking.paymentStatus = 'paid';
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}; 