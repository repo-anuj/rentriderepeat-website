const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Please provide a business name"],
      trim: true,
      maxlength: [100, "Business name cannot be more than 100 characters"],
    },
    businessAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    gstNumber: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please provide a valid GST number",
      ],
    },
    panNumber: {
      type: String,
      match: [
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Please provide a valid PAN number",
      ],
    },
    businessLicense: String,
    documents: [
      {
        type: {
          type: String,
          enum: [
            "business_license",
            "gst_certificate",
            "pan_card",
            "address_proof",
            "identity_proof",
            "other",
          ],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        verified: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verifiedAt: Date,
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
      },
    ],
    documentStatus: {
      type: String,
      enum: ["not_submitted", "submitted", "verified", "rejected"],
      default: "not_submitted",
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate average rating
VendorSchema.statics.calculateAverageRating = async function (vendorId) {
  const result = await this.aggregate([
    {
      $match: { _id: vendorId },
    },
    {
      $unwind: "$ratings",
    },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$ratings.rating" },
      },
    },
  ]);

  try {
    await this.findByIdAndUpdate(vendorId, {
      averageRating: result[0]?.averageRating || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
VendorSchema.post("save", function () {
  this.constructor.calculateAverageRating(this._id);
});

// Virtual for bikes
VendorSchema.virtual("bikes", {
  ref: "Bike",
  localField: "_id",
  foreignField: "vendor",
  justOne: false,
});

// Virtual for bookings
VendorSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "vendor",
  justOne: false,
});

module.exports = mongoose.model("Vendor", VendorSchema);
