/**
 * Production environment configuration
 */
module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    trustProxy: true, // Trust proxy headers for secure cookies behind load balancer
    compression: true, // Enable compression
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "*.razorpay.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "*.cloudinary.com"],
          connectSrc: ["'self'", "*.razorpay.com", "*.cloudinary.com"],
          frameSrc: ["'self'", "*.razorpay.com"],
        },
      },
      xssFilter: true,
      noSniff: true,
      hidePoweredBy: true,
    },
  },

  // Database configuration
  database: {
    connectionPoolSize: 10,
    connectionTimeout: 30000, // 30 seconds
    socketTimeout: 45000, // 45 seconds
  },

  // Cache configuration
  cache: {
    enabled: true,
    defaultTTL: 300, // 5 minutes
    searchTTL: 600, // 10 minutes
    staticTTL: 86400, // 24 hours
  },

  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  },

  // CORS configuration
  cors: {
    origin: [
      'https://bikerent.com',
      'https://www.bikerent.com',
      'https://admin.bikerent.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Cookie configuration
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },

  // JWT configuration
  jwt: {
    expiresIn: '1d', // 1 day
    refreshExpiresIn: '7d', // 7 days
  },

  // Logging configuration
  logging: {
    level: 'info',
    format: 'json',
    logToFile: true,
    logToConsole: true,
  },

  // Upload configuration
  upload: {
    provider: 'cloudinary',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },

  // Payment configuration
  payment: {
    provider: 'razorpay',
    webhookEnabled: true,
  },

  // Email configuration
  email: {
    provider: 'sendgrid',
    from: {
      name: 'BikeRent',
      email: 'no-reply@bikerent.com',
    },
  },
};
