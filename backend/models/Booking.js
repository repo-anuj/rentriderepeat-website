const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the booking amount'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please provide the security deposit amount'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide the total amount'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash', 'Other'],
    },
    paymentId: String,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Disputed'],
      default: 'Pending',
    },
    pickupLocation: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    dropoffLocation: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    bookingNotes: String,
    cancellationReason: String,
    cancellationDate: Date,
    isReviewed: {
      type: Boolean,
      default: false,
    },
    insurance: {
      isSelected: {
        type: Boolean,
        default: false,
      },
      amount: Number,
      details: String,
    },
    additionalCharges: [
      {
        description: String,
        amount: Number,
      },
    ],
    bookingCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate booking code before saving
BookingSchema.pre('save', async function (next) {
  if (!this.bookingCode) {
    // Generate a random alphanumeric code with the prefix B-
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'B-';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.bookingCode = result;
  }

  // Calculate total days and total amount
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    this.totalDays = Math.max(1, diffDays); // Minimum 1 day
    
    // Calculate total amount
    let additionalChargesSum = 0;
    if (this.additionalCharges && this.additionalCharges.length > 0) {
      additionalChargesSum = this.additionalCharges.reduce(
        (sum, charge) => sum + (charge.amount || 0),
        0
      );
    }
    
    let insuranceAmount = 0;
    if (this.insurance && this.insurance.isSelected) {
      insuranceAmount = this.insurance.amount || 0;
    }
    
    this.totalAmount = this.amount + this.securityDeposit + additionalChargesSum + insuranceAmount;
  }

  next();
});

// Update bike availability status after booking
BookingSchema.post('save', async function () {
  try {
    const Bike = this.model('Bike');
    
    let availabilityStatus = 'Available';
    
    if (this.status === 'Confirmed' || this.status === 'Active') {
      availabilityStatus = 'Booked';
    }
    
    // Only update if the status requires a change
    if (availabilityStatus === 'Booked') {
      await Bike.findByIdAndUpdate(this.bike, { availabilityStatus });
    }
    
    // Increment total bookings count for the bike
    if (this.status === 'Confirmed' && this.isNew) {
      await Bike.findByIdAndUpdate(this.bike, { $inc: { totalBookings: 1 } });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = mongoose.model('Booking', BookingSchema); 