const path = require('path');
const Bike = require('../models/Bike');
const Vendor = require('../models/Vendor');

// @desc    Get all bikes
// @route   GET /api/bikes
// @access  Public
exports.getBikes = async (req, res, next) => {
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
    let query = Bike.find(JSON.parse(queryStr)).populate({
      path: 'vendor',
      select: 'businessName averageRating',
      populate: {
        path: 'user',
        select: 'name',
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
    const total = await Bike.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bikes = await query;

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
      count: bikes.length,
      pagination,
      data: bikes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single bike
// @route   GET /api/bikes/:id
// @access  Public
exports.getBike = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id).populate({
      path: 'vendor',
      select: 'businessName averageRating',
      populate: {
        path: 'user',
        select: 'name',
      },
    });

    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bike,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new bike
// @route   POST /api/bikes
// @access  Private/Vendor
exports.createBike = async (req, res, next) => {
  try {
    // Find vendor profile for the logged in user
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found',
      });
    }

    // Add vendor to req.body
    req.body.vendor = vendor._id;

    // Create bike
    const bike = await Bike.create(req.body);

    res.status(201).json({
      success: true,
      data: bike,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update bike
// @route   PUT /api/bikes/:id
// @access  Private/Vendor
exports.updateBike = async (req, res, next) => {
  try {
    let bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }

    // Find vendor profile for the logged in user
    const vendor = await Vendor.findOne({ user: req.user.id });

    // Verify bike belongs to vendor
    if (bike.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this bike',
      });
    }

    // Update bike
    bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: bike,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete bike
// @route   DELETE /api/bikes/:id
// @access  Private/Vendor
exports.deleteBike = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }

    // Find vendor profile for the logged in user
    const vendor = await Vendor.findOne({ user: req.user.id });

    // Verify bike belongs to vendor
    if (bike.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this bike',
      });
    }

    await bike.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload bike photos
// @route   PUT /api/bikes/:id/photo
// @access  Private/Vendor
exports.uploadBikePhoto = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }

    // Find vendor profile for the logged in user
    const vendor = await Vendor.findOne({ user: req.user.id });

    // Verify bike belongs to vendor
    if (bike.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this bike',
      });
    }

    if (!req.files) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file',
      });
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).json({
        success: false,
        error: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
      });
    }

    // Create custom filename
    file.name = `bike_${bike._id}${path.parse(file.name).ext}`;

    // Move file to upload path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: 'Problem with file upload',
        });
      }

      // Add photo URL to bike images array
      const fileUrl = `${process.env.FILE_UPLOAD_BASE_URL}/${file.name}`;
      
      // Add to images array
      bike.images.push({
        url: fileUrl,
        caption: req.body.caption || bike.name,
      });
      
      await bike.save();

      res.status(200).json({
        success: true,
        data: bike,
      });
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add bike rating
// @route   POST /api/bikes/:id/ratings
// @access  Private
exports.addBikeRating = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a rating between 1 and 5',
      });
    }

    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        error: 'Bike not found',
      });
    }

    // Check if user already reviewed this bike
    const existingRating = bike.ratings.find(
      r => r.user.toString() === req.user.id
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      existingRating.date = Date.now();
    } else {
      // Add new rating
      bike.ratings.push({
        user: req.user.id,
        rating,
        review,
      });
    }

    await bike.save();
    
    // Now also add the rating to the vendor
    const vendor = await Vendor.findById(bike.vendor);
    
    // Check if user already rated this vendor
    const existingVendorRating = vendor.ratings.find(
      r => r.user.toString() === req.user.id
    );
    
    if (existingVendorRating) {
      // Update existing rating
      existingVendorRating.rating = rating;
      existingVendorRating.review = review;
      existingVendorRating.date = Date.now();
    } else {
      // Add new rating
      vendor.ratings.push({
        user: req.user.id,
        rating,
        review,
      });
    }
    
    await vendor.save();

    res.status(200).json({
      success: true,
      data: bike,
    });
  } catch (err) {
    next(err);
  }
}; 