# Multi-stage build for BikeRent application

# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

# Production stage
FROM node:18-alpine
LABEL maintainer="BikeRent Team <dev@bikerent.com>"
LABEL description="BikeRent - Bike Rental Application for India"

# Install dependencies
RUN apk --no-cache add curl tzdata

# Set timezone
ENV TZ=Asia/Kolkata

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

# Copy backend from build stage
COPY --from=backend-build --chown=appuser:appgroup /app/backend ./
# Copy frontend build from build stage
COPY --from=frontend-build --chown=appuser:appgroup /app/frontend/dist ./public

# Install only production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
