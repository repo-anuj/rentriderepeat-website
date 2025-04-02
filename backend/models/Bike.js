const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a bike name'],
      trim: true,
      maxlength: [100, 'Bike name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a bike category'],
      enum: [
        'Sport Bike',
        'Cruiser',
        'Scooter',
        'Adventure',
        'Touring',
        'Standard',
        'Off-Road',
        'Electric',
        'Other',
      ],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a bike brand'],
    },
    model: {
      type: String,
      required: [true, 'Please provide a bike model'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide a manufacturing year'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a bike description'],
    },
    engineCapacity: {
      type: Number, // in CC
      required: [true, 'Please provide engine capacity'],
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Other'],
      default: 'Petrol',
    },
    mileage: {
      type: Number, // km/l
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    dailyRate: {
      type: Number,
      required: [true, 'Please provide a daily rental rate'],
    },
    weeklyRate: {
      type: Number,
    },
    monthlyRate: {
      type: Number,
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please provide a security deposit amount'],
    },
    features: {
      abs: { type: Boolean, default: false },
      bluetooth: { type: Boolean, default: false },
      usbCharger: { type: Boolean, default: false },
      gps: { type: Boolean, default: false },
      diskBrake: { type: Boolean, default: false },
      ledLights: { type: Boolean, default: false },
      electronicIgnition: { type: Boolean, default: false },
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Booked', 'Maintenance', 'Inactive'],
      default: 'Available',
    },
    insuranceAvailable: {
      type: Boolean,
      default: false,
    },
    insuranceDetails: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
      coverageDetails: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate average rating
BikeSchema.statics.calculateAverageRating = async function (bikeId) {
  const result = await this.aggregate([
    {
      $match: { _id: bikeId },
    },
    {
      $unwind: '$ratings',
    },
    {
      $group: {
        _id: '$_id',
        averageRating: { $avg: '$ratings.rating' },
      },
    },
  ]);

  try {
    await this.findByIdAndUpdate(bikeId, {
      averageRating: result[0]?.averageRating || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
BikeSchema.post('save', function () {
  this.constructor.calculateAverageRating(this._id);
});

// Virtual for bookings
BikeSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'bike',
  justOne: false,
});

module.exports = mongoose.model('Bike', BikeSchema); 