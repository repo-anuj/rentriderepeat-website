const VendorService = require('../services/VendorService');
const UserService = require('../services/UserService');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Verify vendor
 * @route   PUT /api/admin/vendors/:id/verify
 * @access  Private/Admin
 */
exports.verifyVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    const adminId = req.user.id;

    if (isVerified === undefined) {
      throw AppError.validationError('Please provide verification status');
    }

    // Verify vendor
    const vendor = await VendorService.verifyVendor(id, isVerified, adminId);

    // Get user details
    const user = await UserService.findById(vendor.user);

    // Send verification email
    try {
      const message = isVerified
        ? `
          Congratulations! Your vendor account has been verified.
          You can now add bikes to your inventory and start accepting bookings.
          
          Thank you for choosing BikeRent.
        `
        : `
          We regret to inform you that your vendor account verification has been rejected.
          
          Please contact our support team for more information.
        `;

      await sendEmail({
        email: user.email,
        subject: isVerified ? 'Vendor Account Verified' : 'Vendor Account Verification Failed',
        message,
      });
    } catch (err) {
      // Continue even if email fails
      console.error('Vendor verification email failed:', err);
    }

    return successResponse(
      res,
      200,
      `Vendor ${isVerified ? 'verified' : 'unverified'} successfully`,
      { vendor }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit vendor documents
 * @route   POST /api/vendors/documents
 * @access  Private/Vendor
 */
exports.submitDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { documentType, documentUrl } = req.body;

    if (!documentType || !documentUrl) {
      throw AppError.validationError('Please provide document type and URL');
    }

    // Get vendor
    const vendorData = await VendorService.getVendorProfile(userId);
    const vendor = vendorData.vendor;

    // Add document
    if (!vendor.documents) {
      vendor.documents = [];
    }

    vendor.documents.push({
      type: documentType,
      url: documentUrl,
      uploadedAt: Date.now(),
    });

    // Update vendor
    const updatedVendor = await VendorService.updateVendorProfile(userId, {
      documents: vendor.documents,
      documentStatus: 'submitted',
    });

    // Notify admin about new document submission
    try {
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
      
      if (adminEmails.length > 0) {
        const message = `
          A vendor has submitted new documents for verification.
          
          Vendor ID: ${vendor._id}
          Vendor Name: ${vendorData.user.name}
          Document Type: ${documentType}
          
          Please review the documents in the admin dashboard.
        `;

        for (const email of adminEmails) {
          await sendEmail({
            email: email.trim(),
            subject: 'New Vendor Document Submission',
            message,
          });
        }
      }
    } catch (err) {
      // Continue even if email fails
      console.error('Admin notification email failed:', err);
    }

    return successResponse(
      res,
      200,
      'Document submitted successfully',
      { vendor: updatedVendor }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get vendor verification status
 * @route   GET /api/vendors/verification
 * @access  Private/Vendor
 */
exports.getVerificationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get vendor
    const vendorData = await VendorService.getVendorProfile(userId);
    const vendor = vendorData.vendor;
    const user = vendorData.user;

    return successResponse(
      res,
      200,
      'Vendor verification status',
      {
        isVerified: user.isVerified,
        documentStatus: vendor.documentStatus || 'not_submitted',
        documents: vendor.documents || [],
        verifiedAt: vendor.verifiedAt,
      }
    );
  } catch (err) {
    next(err);
  }
};
