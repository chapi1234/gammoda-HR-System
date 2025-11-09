import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

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
      try {
        const parsed = JSON.parse(userData);
        // normalize avatar/profileImage fields for consistent UI usage
        const normalized = {
          ...parsed,
          id: parsed.id || parsed._id || parsed._doc?._id,
          avatar: parsed.avatar || parsed.profileImage || (parsed.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.name)}&background=3b82f6&color=fff` : undefined),
        };
        setUser(normalized);
      } catch (e) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
          role,
        }
      );
      const data = response.data;
      if (!data.status) throw new Error(data.message);

      localStorage.setItem("authToken", data.data.token);
      // normalize user before storing so frontend always has `avatar` and `id`
      const su = data.data.user || {};
      const normalized = {
        ...su,
        id: su.id || su._id,
        avatar: su.avatar || su.profileImage || (su.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(su.name)}&background=3b82f6&color=fff` : undefined),
      };
      localStorage.setItem("userData", JSON.stringify(normalized));
      setUser(normalized);

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
        `${API_URL}/api/auth/register`,
        formData
      );
      const data = response.data;
      if (!data.status) throw new Error(data.message);

      localStorage.setItem("authToken", data.data.token);
      const su = data.data.user || {};
      const normalized = {
        ...su,
        id: su.id || su._id,
        avatar: su.avatar || su.profileImage || (su.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(su.name)}&background=3b82f6&color=fff` : undefined),
      };
      localStorage.setItem("userData", JSON.stringify(normalized));
      setUser(normalized);

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
        `${API_URL}/api/auth/change-password/${user._id}`,
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

  const uploadProfileImage = async (file, userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!file || !userId || !token) throw new Error('Missing params');
      const form = new FormData();
      form.append('profile', file);
      const res = await axios.put(`${API_URL}/api/employees/upload-profile/${userId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data && res.data.data) {
        // update local user and storage if current user
        const updated = res.data.data;
        if (user && String(user.id || user._id) === String(userId)) {
          const merged = { ...user, ...updated };
          setUser(merged);
          localStorage.setItem('userData', JSON.stringify(merged));
        }
        return updated;
      }
      throw new Error(res.data?.message || 'Upload failed');
    } catch (err) {
      console.error('Profile upload failed', err);
      toast.error(err.response?.data?.message || err.message || 'Profile upload failed');
      throw err;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    uploadProfileImage,
    loading,
    isAuthenticated: !!user,
    isHR: user?.role === "hr",
    isEmployee: user?.role === "employee",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
