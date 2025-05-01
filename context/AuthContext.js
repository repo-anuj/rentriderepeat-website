"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/auth/register", userData);

      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Registration successful");
        router.push("/");
        return true;
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register vendor
  const registerVendor = async (vendorData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/auth/register/vendor", vendorData);

      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Vendor registration successful");
        router.push("/vendor-dashboard");
        return true;
      }
    } catch (err) {
      console.error("Vendor registration error:", err);
      setError(err.response?.data?.message || "Vendor registration failed");
      toast.error(err.response?.data?.message || "Vendor registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/auth/signin", { email, password });

      if (res.data.success) {
        // Check if user data exists in the response
        const userData = res.data.user || res.data.data;

        if (!userData) {
          throw new Error("No user data received from the server");
        }

        // Set the user data
        setUser(userData);

        // If user is a vendor, get vendor details
        if (userData.role === "vendor") {
          await getVendorProfile();
        }

        toast.success("Login successful");

        // Redirect based on user role
        if (userData.role === "vendor") {
          router.push("/vendor-dashboard");
        } else if (userData.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }

        return true;
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/auth/logout");

      if (res.data.success) {
        setUser(null);
        setVendor(null);
        toast.success("Logout successful");
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/auth/me");

      if (res.data.success) {
        // Handle different response formats
        if (res.data.user) {
          // Format: { success: true, user: {...}, vendor: {...} }
          setUser(res.data.user);
          setVendor(res.data.vendor || null);
        } else if (res.data.data && res.data.data.user) {
          // Format: { success: true, data: { user: {...}, vendor: {...} } }
          setUser(res.data.data.user);
          setVendor(res.data.data.vendor || null);
        } else if (res.data.data) {
          // Format: { success: true, data: {...} }
          setUser(res.data.data);
          setVendor(null);
        } else {
          // No user data found
          console.warn("No user data found in response:", res.data);
          setUser(null);
          setVendor(null);
        }
      } else {
        setUser(null);
        setVendor(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setUser(null);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  // Get vendor profile
  const getVendorProfile = async () => {
    try {
      const res = await axios.get("/api/vendors/profile");

      if (res.data.success) {
        setVendor(res.data.data.vendor);
      }
    } catch (err) {
      console.error("Get vendor profile error:", err);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put("/api/auth/updatedetails", userData);

      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Profile updated successfully");
        return true;
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.response?.data?.message || "Profile update failed");
      toast.error(err.response?.data?.message || "Profile update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put("/api/auth/updatepassword", passwordData);

      if (res.data.success) {
        toast.success("Password updated successfully");
        return true;
      }
    } catch (err) {
      console.error("Update password error:", err);
      setError(err.response?.data?.message || "Password update failed");
      toast.error(err.response?.data?.message || "Password update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        loading,
        error,
        register,
        registerVendor,
        login,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
