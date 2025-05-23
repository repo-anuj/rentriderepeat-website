const User = require("../models/User");
const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      gender,
      mobile,
      alternatePhone,
      location,
      address,
      aadharCard,
      drivingLicense,
      emergencyContact,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      dob,
      gender,
      phone: mobile, // Map mobile to phone in the schema
      alternatePhone,
      location,
      address,
      aadharCard,
      drivingLicense,
      emergencyContact,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register a vendor
// @route   POST /api/auth/register-vendor
// @access  Public
exports.registerVendor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      businessAddress,
      gstNumber,
      panNumber,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Create user with vendor role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "vendor",
    });

    // Create vendor profile
    const vendor = await Vendor.create({
      user: user._id,
      businessName,
      businessAddress,
      gstNumber,
      panNumber,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If user is a vendor, get vendor details as well
    if (user.role === "vendor") {
      const vendor = await Vendor.findOne({ user: user._id });
      return res.status(200).json({
        success: true,
        data: {
          user,
          vendor,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Remove fields that aren't allowed to be updated
    const { password, role, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Clear both token and refresh token
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // Clear refresh token in database
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = undefined;
        user.refreshTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "No refresh token provided",
      });
    }

    // Verify refresh token
    let decoded;
    try {
      // First get the payload without verification to extract the user ID
      const payload = jwt.decode(refreshToken);

      if (!payload || !payload.id) {
        return res.status(401).json({
          success: false,
          error: "Invalid refresh token",
        });
      }

      // Find the user
      const user = await User.findById(payload.id).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify the refresh token with user-specific secret
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET + user.password.substring(0, 10)
      );

      // Check if token is valid in database
      if (!user.verifyRefreshToken(refreshToken)) {
        return res.status(401).json({
          success: false,
          error: "Invalid refresh token",
        });
      }

      // Generate new tokens
      sendTokenResponse(user, 200, res);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Create refresh token (valid for 7 days longer than access token)
  const refreshToken = user.getSignedRefreshToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "strict", // Protect against CSRF
    path: "/",
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // Remove password from response
  user.password = undefined;

  // Get user role for frontend
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Set cookies and send response
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: new Date(
        Date.now() +
          process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 +
          7 * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      token, // Still include token in response for backward compatibility
      data: userData,
    });
};
