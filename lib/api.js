import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies to be sent with requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'Your token has expired. Please log in again.' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshRes = await axios.post('/api/auth/refresh-token', {}, {
          withCredentials: true,
        });
        
        if (refreshRes.data.success) {
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with an error status
      const errorMessage = error.response.data.message || 'Something went wrong';
      
      if (error.response.status === 404) {
        console.error('Resource not found:', errorMessage);
      } else if (error.response.status === 403) {
        console.error('Forbidden:', errorMessage);
      } else if (error.response.status === 500) {
        console.error('Server error:', errorMessage);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  registerVendor: (vendorData) => api.post('/auth/register/vendor', vendorData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Bikes API
export const bikesAPI = {
  getBikes: (params) => api.get('/bikes', { params }),
  getBikeById: (id) => api.get(`/bikes/${id}`),
  getPopularBikes: (limit) => api.get('/bikes/popular', { params: { limit } }),
  checkAvailability: (bikeId, startDate, endDate) => 
    api.get(`/bikes/${bikeId}/availability`, { params: { startDate, endDate } }),
};

// Vendor Bikes API
export const vendorBikesAPI = {
  getVendorBikes: (params) => api.get('/vendor/bikes', { params }),
  addBike: (bikeData) => api.post('/vendor/bikes', bikeData),
  updateBike: (id, bikeData) => api.put(`/vendor/bikes/${id}`, bikeData),
  deleteBike: (id) => api.delete(`/vendor/bikes/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  processPayment: (bookingId, paymentDetails) => 
    api.post(`/bookings/${bookingId}/payment`, paymentDetails),
};

// Vendor Bookings API
export const vendorBookingsAPI = {
  getVendorBookings: (params) => api.get('/vendor/bookings', { params }),
  getVendorBookingStats: () => api.get('/vendor/bookings/stats'),
};

// Vendor API
export const vendorAPI = {
  getVendorProfile: () => api.get('/vendors/profile'),
  updateVendorProfile: (vendorData) => api.put('/vendors/profile', vendorData),
  getVendorDashboard: () => api.get('/vendors/dashboard'),
};

export default api;
