const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    dob: {
      type: Date,
      required: [true, 'Please provide a date of birth'],
    },
    gender: {
      type: String,
      required: [true, 'Please provide gender'],
      enum: ['male', 'female', 'other'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    alternatePhone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    location: {
      type: String,
      required: [true, 'Please provide your city'],
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
    aadharCard: {
      type: String,
      required: [true, 'Please provide your Aadhar card number'],
      match: [/^[0-9]{12}$/, 'Please provide a valid 12-digit Aadhar number'],
    },
    drivingLicense: {
      type: String,
      required: [true, 'Please provide your driving license number'],
    },
    emergencyContact: {
      type: String,
      required: [true, 'Please provide an emergency contact number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: 'default.jpg',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);