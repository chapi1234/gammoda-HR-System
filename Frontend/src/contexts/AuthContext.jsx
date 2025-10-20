import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
          role,
        }
      );
      const data = response.data;
      if (!data.status) throw new Error(data.message);

      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userData", JSON.stringify(data.data.user));
      setUser(data.data.user);

      toast.success(`Welcome back, ${data.data.user.name}!`);
      return data.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  };

  const signup = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      const data = response.data;
      if (!data.status) throw new Error(data.message);

      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userData", JSON.stringify(data.data.user));
      setUser(data.data.user);

      toast.success("Account created successfully!");
      return data.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!user || !token) throw new Error("Not authenticated");

      const response = await axios.put(
        `http://localhost:5000/api/auth/change-password/${user._id}`,
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if backend middleware checks JWT
          },
        }
      );

      const data = response.data;
      if (!data.status) throw new Error(data.message);

      toast.success(data.message || "Password changed successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password change failed. Please try again."
      );
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    loading,
    isAuthenticated: !!user,
    isHR: user?.role === "hr",
    isEmployee: user?.role === "employee",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
