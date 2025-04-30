const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {String} options.email - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.message - Email message
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Add HTML version if provided
    if (options.html) {
      mailOptions.html = options.html;
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent', {
      messageId: info.messageId,
      to: options.email,
      subject: options.subject,
    });
  } catch (error) {
    logger.error('Email sending failed', {
      error: error.message,
      to: options.email,
      subject: options.subject,
    });
    throw error;
  }
};

module.exports = sendEmail;
