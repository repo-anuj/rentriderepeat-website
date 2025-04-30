/**
 * Script to create database indexes for performance optimization
 */
const mongoose = require('mongoose');
const logger = require('./logger');
const User = require('../models/User');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');

/**
 * Create indexes for all collections
 */
const createIndexes = async () => {
  try {
    logger.info('Creating database indexes...');

    // User indexes
    await User.collection.createIndexes([
      { key: { email: 1 }, unique: true, background: true },
      { key: { role: 1 }, background: true },
      { key: { isVerified: 1 }, background: true },
      { key: { verificationToken: 1 }, background: true, sparse: true },
      { key: { resetPasswordToken: 1 }, background: true, sparse: true },
    ]);
    logger.info('User indexes created');

    // Bike indexes
    await Bike.collection.createIndexes([
      { key: { vendor: 1 }, background: true },
      { key: { location: 1 }, background: true },
      { key: { category: 1 }, background: true },
      { key: { brand: 1 }, background: true },
      { key: { pricePerDay: 1 }, background: true },
      { key: { isAvailable: 1 }, background: true },
      { key: { rating: 1 }, background: true },
      { key: { createdAt: -1 }, background: true },
      // Compound indexes for common queries
      { key: { location: 1, category: 1 }, background: true },
      { key: { location: 1, brand: 1 }, background: true },
      { key: { location: 1, pricePerDay: 1 }, background: true },
      // Text index for search
      { 
        key: { 
          name: 'text', 
          brand: 'text', 
          model: 'text', 
          description: 'text' 
        }, 
        weights: {
          name: 10,
          brand: 5,
          model: 5,
          description: 1
        },
        background: true 
      },
    ]);
    logger.info('Bike indexes created');

    // Booking indexes
    await Booking.collection.createIndexes([
      { key: { user: 1 }, background: true },
      { key: { bike: 1 }, background: true },
      { key: { vendor: 1 }, background: true },
      { key: { status: 1 }, background: true },
      { key: { startDate: 1 }, background: true },
      { key: { endDate: 1 }, background: true },
      { key: { createdAt: -1 }, background: true },
      // Compound indexes for common queries
      { key: { bike: 1, status: 1 }, background: true },
      { key: { bike: 1, startDate: 1, endDate: 1 }, background: true },
      { key: { vendor: 1, status: 1 }, background: true },
      { key: { user: 1, status: 1 }, background: true },
    ]);
    logger.info('Booking indexes created');

    // Vendor indexes
    await Vendor.collection.createIndexes([
      { key: { user: 1 }, unique: true, background: true },
      { key: { isVerified: 1 }, background: true },
      { key: { isActive: 1 }, background: true },
      { key: { businessName: 1 }, background: true },
      { key: { 'businessAddress.city': 1 }, background: true },
      { key: { 'businessAddress.state': 1 }, background: true },
      { key: { averageRating: -1 }, background: true },
      // Text index for search
      { 
        key: { 
          businessName: 'text', 
          'businessAddress.city': 'text', 
          'businessAddress.state': 'text' 
        }, 
        weights: {
          businessName: 10,
          'businessAddress.city': 5,
          'businessAddress.state': 3
        },
        background: true 
      },
    ]);
    logger.info('Vendor indexes created');

    logger.info('All database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes', { error: error.message });
    throw error;
  }
};

// Export for use in other files
module.exports = createIndexes;

// Run directly if this file is executed directly
if (require.main === module) {
  // Connect to database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info('MongoDB connected');
      return createIndexes();
    })
    .then(() => {
      logger.info('Index creation completed');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Error:', err.message);
      process.exit(1);
    });
}
