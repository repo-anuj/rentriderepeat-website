const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDB } = require("./config/database");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://bikerent.com", "https://www.bikerent.com"]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent with requests
  maxAge: 86400, // Cache preflight requests for 24 hours
};
app.use(cors(corsOptions));

// Set security headers
app.use(helmet());

// Request logging middleware
const requestLogger = require("./middleware/requestLogger");
app.use(requestLogger);

// Dev logging middleware (for console output)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Import rate limiter
const { apiLimiter } = require("./middleware/rateLimit");

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Mount routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bikes", require("./routes/bikes"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/vendors", require("./routes/vendors"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/search", require("./routes/search"));
app.use("/api/health", require("./routes/health"));

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});
