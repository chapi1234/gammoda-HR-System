import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: Date.now(),
            email,
            role,
            name: role === 'hr' ? 'HR Manager' : 'John Employee',
            department: role === 'hr' ? 'Human Resources' : 'Engineering',
            avatar: `https://ui-avatars.com/api/?name=${role === 'hr' ? 'HR+Manager' : 'John+Employee'}&background=3b82f6&color=fff`
          };
          
          resolve({
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now()
          });
        }, 1000);
      });

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      
      toast.success(`Welcome back, ${response.user.name}!`);
      return response.user;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    }
  };

  const signup = async (formData) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: Date.now(),
            email: formData.email,
            role: formData.role,
            name: formData.fullName,
            department: formData.department,
            avatar: `https://ui-avatars.com/api/?name=${formData.fullName.replace(' ', '+')}&background=3b82f6&color=fff`
          };
          
          resolve({
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now()
          });
        }, 1500);
      });

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      
      toast.success('Account created successfully!');
      return response.user;
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isHR: user?.role === 'hr',
    isEmployee: user?.role === 'employee'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};