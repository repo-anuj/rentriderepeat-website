const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/dashboard
// @access  Private/Vendor
exports.getVendorDashboard = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Get total revenue
    const bookings = await Booking.find({
      vendor: vendor._id,
      status: { $in: ['Completed', 'Active'] },
    });

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const totalBookings = bookings.length;

    // Get active bikes count
    const activeBikes = await Bike.countDocuments({
      vendor: vendor._id,
      availabilityStatus: 'Available',
      isActive: true,
    });

    // Get total bikes count
    const totalBikes = await Bike.countDocuments({
      vendor: vendor._id,
    });

    // Get recent bookings
    const recentBookings = await Booking.find({
      vendor: vendor._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('bike', 'name');

    // Get monthly revenue
    const monthlyRevenue = await getMonthlyRevenue(vendor._id);

    // Get bike usage data
    const bikeUsage = await getBikeUsage(vendor._id);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        activeBikes,
        totalBikes,
        averageRating: vendor.averageRating,
        recentBookings,
        monthlyRevenue,
        bikeUsage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private/Vendor
exports.updateVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Update vendor profile
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedVendor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bikes for a vendor
// @route   GET /api/vendors/bikes
// @access  Private/Vendor
exports.getVendorBikes = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Find all bikes for the vendor
    const bikes = await Bike.find({ vendor: vendor._id });

    res.status(200).json({
      success: true,
      count: bikes.length,
      data: bikes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings for a vendor
// @route   GET /api/vendors/bookings
// @access  Private/Vendor
exports.getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Filter by status if provided
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    // Find all bookings for the vendor
    const bookings = await Booking.find({
      vendor: vendor._id,
      ...statusFilter,
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('bike', 'name brand model');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor customers
// @route   GET /api/vendors/customers
// @access  Private/Vendor
exports.getVendorCustomers = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Get unique customer IDs from bookings
    const bookings = await Booking.find({ vendor: vendor._id }).distinct('user');

    // Get customer details
    const customers = await User.find({ _id: { $in: bookings } }).select(
      'name email phone'
    );

    // For each customer, get booking stats
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const customerBookings = await Booking.find({
          vendor: vendor._id,
          user: customer._id,
        });

        // Calculate total spent
        const totalSpent = customerBookings.reduce(
          (sum, booking) => sum + booking.amount,
          0
        );

        // Get latest booking
        const latestBooking = customerBookings.sort(
          (a, b) => b.createdAt - a.createdAt
        )[0];

        return {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          totalBookings: customerBookings.length,
          totalSpent,
          lastBooking: latestBooking ? latestBooking.createdAt : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      data: customersWithStats,
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to get monthly revenue data
async function getMonthlyRevenue(vendorId) {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

  const bookings = await Booking.find({
    vendor: vendorId,
    status: 'Completed',
    createdAt: { $gte: sixMonthsAgo },
  });

  // Group by month and sum the amounts
  const monthlyData = {};
  
  bookings.forEach(booking => {
    const date = new Date(booking.createdAt);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }
    
    monthlyData[monthYear] += booking.amount;
  });

  // Convert to array for chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = Object.keys(monthlyData).map(key => {
    const [year, month] = key.split('-');
    return {
      month: months[parseInt(month) - 1],
      revenue: monthlyData[key],
    };
  });

  // Sort by date
  chartData.sort((a, b) => {
    const aIndex = months.indexOf(a.month);
    const bIndex = months.indexOf(b.month);
    return aIndex - bIndex;
  });

  return chartData;
}

// Helper function to get bike usage data
async function getBikeUsage(vendorId) {
  const bikes = await Bike.find({ vendor: vendorId });
  
  const bikeUsage = await Promise.all(bikes.map(async bike => {
    const bookings = await Booking.countDocuments({
      bike: bike._id,
      status: { $in: ['Completed', 'Active'] },
    });
    
    return {
      name: bike.name,
      bookings,
    };
  }));
  
  // Sort by most booked
  bikeUsage.sort((a, b) => b.bookings - a.bookings);
  
  return bikeUsage.slice(0, 5); // Return top 5
} 