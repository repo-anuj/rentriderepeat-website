const mongoose = require("mongoose");
const { initQueryAnalyzer } = require("../utils/queryAnalyzer");

// Connection options for better performance and reliability
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
};

// Connection state tracking
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Connect to MongoDB with retry logic
 */
const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    connectionAttempts++;
    console.log(`MongoDB connection attempt ${connectionAttempts}...`);

    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      connectionOptions
    );

    isConnected = true;
    connectionAttempts = 0;

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize query analyzer in development and production
    if (process.env.NODE_ENV !== "test") {
      initQueryAnalyzer();
    }

    // Create database indexes in production
    if (
      process.env.NODE_ENV === "production" ||
      process.env.FORCE_INDEX_CREATION === "true"
    ) {
      try {
        const createIndexes = require("../utils/createIndexes");
        await createIndexes();
        console.log("Database indexes created successfully");
      } catch (indexError) {
        console.error("Error creating database indexes:", indexError.message);
        // Continue even if index creation fails
      }
    }

    // Add connection event listeners
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
      isConnected = false;

      // Try to reconnect if disconnected unexpectedly
      if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
        setTimeout(() => {
          connectDB();
        }, 5000); // Wait 5 seconds before reconnecting
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    isConnected = false;

    // Retry connection with exponential backoff
    if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
      const retryDelay = Math.pow(2, connectionAttempts) * 1000;
      console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);

      setTimeout(() => {
        connectDB();
      }, retryDelay);
    } else {
      console.error(
        `Failed to connect to MongoDB after ${MAX_RETRY_ATTEMPTS} attempts`
      );
      process.exit(1);
    }
  }
};

/**
 * Check if database is connected
 */
const isDbConnected = () => {
  return isConnected;
};

/**
 * Get the mongoose connection
 */
const getConnection = () => {
  return mongoose.connection;
};

/**
 * Close the database connection
 */
const closeConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log("MongoDB connection closed");
  }
};

module.exports = {
  connectDB,
  isDbConnected,
  getConnection,
  closeConnection,
};
