"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Create booking context
const BookingContext = createContext();

// Booking provider component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const router = useRouter();

  // Get user bookings
  const getUserBookings = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `/api/bookings?page=${page}&limit=${pagination.limit}&status=${status}`
      );

      if (res.data.success) {
        setBookings(res.data.data);
        setPagination({
          page: res.data.meta.pagination.page,
          limit: res.data.meta.pagination.limit,
          total: res.data.meta.pagination.total,
          totalPages: res.data.meta.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Get user bookings error:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Get vendor bookings
  const getVendorBookings = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `/api/vendor/bookings?page=${page}&limit=${pagination.limit}&status=${status}`
      );

      if (res.data.success) {
        setBookings(res.data.data);
        setPagination({
          page: res.data.meta.pagination.page,
          limit: res.data.meta.pagination.limit,
          total: res.data.meta.pagination.total,
          totalPages: res.data.meta.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Get vendor bookings error:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/bookings/${id}`);

      if (res.data.success) {
        setBooking(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error("Get booking error:", err);
      setError(err.response?.data?.message || "Failed to fetch booking");
      toast.error(err.response?.data?.message || "Failed to fetch booking");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/bookings", bookingData);

      if (res.data.success) {
        toast.success("Booking created successfully");
        return res.data.data;
      }
    } catch (err) {
      console.error("Create booking error:", err);
      setError(err.response?.data?.message || "Failed to create booking");
      toast.error(err.response?.data?.message || "Failed to create booking");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(`/api/bookings/${id}/status`, { status });

      if (res.data.success) {
        // Update booking in state
        if (booking && booking._id === id) {
          setBooking(res.data.data);
        }

        // Update booking in bookings list
        setBookings(bookings.map((b) => (b._id === id ? res.data.data : b)));

        toast.success(`Booking ${status} successfully`);
        return res.data.data;
      }
    } catch (err) {
      console.error("Update booking status error:", err);
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
      toast.error(
        err.response?.data?.message || "Failed to update booking status"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (bookingId, paymentDetails) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `/api/bookings/${bookingId}/payment`,
        paymentDetails
      );

      if (res.data.success) {
        toast.success("Payment processed successfully");
        router.push(`/bookings/${bookingId}`);
        return res.data.data;
      }
    } catch (err) {
      console.error("Process payment error:", err);
      setError(err.response?.data?.message || "Payment processing failed");
      toast.error(err.response?.data?.message || "Payment processing failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get vendor booking statistics
  const getVendorBookingStats = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/vendor/bookings/stats");

      if (res.data.success) {
        return res.data.data;
      }

      return null;
    } catch (err) {
      console.error("Get vendor booking stats error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        booking,
        loading,
        error,
        pagination,
        getUserBookings,
        getVendorBookings,
        getBookingById,
        createBooking,
        updateBookingStatus,
        processPayment,
        getVendorBookingStats,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context
export const useBookings = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookings must be used within a BookingProvider");
  }

  return context;
};

export default BookingContext;
