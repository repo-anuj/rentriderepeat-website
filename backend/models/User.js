const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      lowercase: true, // Convert email to lowercase
      trim: true, // Remove whitespace
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    dob: {
      type: Date,
      required: [true, "Please provide a date of birth"],
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
    },
    alternatePhone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
    },
    location: {
      type: String,
      required: [true, "Please provide your city"],
    },
    address: {
      type: String,
      required: [true, "Please provide your address"],
    },
    aadharCard: {
      type: String,
      required: [true, "Please provide your Aadhar card number"],
      match: [/^[0-9]{12}$/, "Please provide a valid 12-digit Aadhar number"],
    },
    drivingLicense: {
      type: String,
      required: [true, "Please provide your driving license number"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Please provide an emergency contact number"],
      match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "default.jpg",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    refreshTokenExpire: Date,
    verificationToken: String,
    verificationTokenExpire: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Generate and hash refresh token
UserSchema.methods.getSignedRefreshToken = function () {
  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET + this.password.substring(0, 10), // Add part of hashed password to make it user-specific
    {
      expiresIn: "7d", // Refresh token valid for 7 days
    }
  );

  // Hash token and set to refreshToken field
  this.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Set expire
  this.refreshTokenExpire = Date.now() + 7 * 24 * 60 * 60 * 1000;

  // Save the user
  this.save({ validateBeforeSave: false });

  return refreshToken;
};

// Verify refresh token
UserSchema.methods.verifyRefreshToken = function (refreshToken) {
  // Hash the provided refresh token
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Check if token matches and is not expired
  return (
    this.refreshToken === hashedToken && this.refreshTokenExpire > Date.now()
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
