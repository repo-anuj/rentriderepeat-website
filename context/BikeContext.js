"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create bike context
const BikeContext = createContext();

// Bike provider component
export const BikeProvider = ({ children }) => {
  const [bikes, setBikes] = useState([]);
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    available: "",
    startDate: "",
    endDate: "",
    search: "",
    sort: "-createdAt",
  });

  // Get all bikes
  const getBikes = async (page = 1, newFilters = null) => {
    try {
      setLoading(true);
      setError(null);

      // Update filters if provided
      const currentFilters = newFilters || filters;

      // Build query string
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...currentFilters,
      });

      const res = await axios.get(`/api/bikes?${queryParams.toString()}`);

      if (res.data.success) {
        setBikes(res.data.data);
        setPagination({
          page: res.data.meta.pagination.page,
          limit: res.data.meta.pagination.limit,
          total: res.data.meta.pagination.total,
          totalPages: res.data.meta.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Get bikes error:", err);
      setError(err.response?.data?.message || "Failed to fetch bikes");
      toast.error(err.response?.data?.message || "Failed to fetch bikes");
    } finally {
      setLoading(false);
    }
  };

  // Get bike by ID
  const getBikeById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/bikes/${id}`);

      if (res.data.success) {
        setBike(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error("Get bike error:", err);
      setError(err.response?.data?.message || "Failed to fetch bike");
      toast.error(err.response?.data?.message || "Failed to fetch bike");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get vendor bikes
  const getVendorBikes = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `/api/vendor/bikes?page=${page}&limit=${pagination.limit}`
      );

      if (res.data.success) {
        setBikes(res.data.data);
        setPagination({
          page: res.data.meta.pagination.page,
          limit: res.data.meta.pagination.limit,
          total: res.data.meta.pagination.total,
          totalPages: res.data.meta.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error("Get vendor bikes error:", err);
      setError(err.response?.data?.message || "Failed to fetch vendor bikes");
      toast.error(
        err.response?.data?.message || "Failed to fetch vendor bikes"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add new bike
  const addBike = async (bikeData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/vendor/bikes", bikeData);

      if (res.data.success) {
        toast.success("Bike added successfully");
        return res.data.data;
      }
    } catch (err) {
      console.error("Add bike error:", err);
      setError(err.response?.data?.message || "Failed to add bike");
      toast.error(err.response?.data?.message || "Failed to add bike");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update bike
  const updateBike = async (id, bikeData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(`/api/vendor/bikes/${id}`, bikeData);

      if (res.data.success) {
        toast.success("Bike updated successfully");
        return res.data.data;
      }
    } catch (err) {
      console.error("Update bike error:", err);
      setError(err.response?.data?.message || "Failed to update bike");
      toast.error(err.response?.data?.message || "Failed to update bike");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete bike
  const deleteBike = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.delete(`/api/vendor/bikes/${id}`);

      if (res.data.success) {
        // Remove bike from state
        setBikes(bikes.filter((bike) => bike._id !== id));
        toast.success("Bike deleted successfully");
        return true;
      }
    } catch (err) {
      console.error("Delete bike error:", err);
      setError(err.response?.data?.message || "Failed to delete bike");
      toast.error(err.response?.data?.message || "Failed to delete bike");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check bike availability
  const checkAvailability = async (bikeId, startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/bikes/${bikeId}/availability`, {
        params: { startDate, endDate },
      });

      if (res.data.success) {
        return res.data.data.available;
      }
    } catch (err) {
      console.error("Check availability error:", err);
      setError(err.response?.data?.message || "Failed to check availability");
      toast.error(
        err.response?.data?.message || "Failed to check availability"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      location: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      available: "",
      startDate: "",
      endDate: "",
      search: "",
      sort: "-createdAt",
    });
  };

  // Get popular bikes
  const getPopularBikes = async (limit = 5) => {
    try {
      const res = await axios.get(`/api/bikes/popular?limit=${limit}`);

      if (res.data.success) {
        return res.data.data;
      }

      return [];
    } catch (err) {
      console.error("Get popular bikes error:", err);
      return [];
    }
  };

  return (
    <BikeContext.Provider
      value={{
        bikes,
        bike,
        loading,
        error,
        pagination,
        filters,
        getBikes,
        getBikeById,
        getVendorBikes,
        addBike,
        updateBike,
        deleteBike,
        checkAvailability,
        updateFilters,
        clearFilters,
        getPopularBikes,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
};

// Custom hook to use bike context
export const useBikes = () => {
  const context = useContext(BikeContext);

  if (!context) {
    throw new Error("useBikes must be used within a BikeProvider");
  }

  return context;
};

export default BikeContext;
