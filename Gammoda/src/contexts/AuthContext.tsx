import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Candidate, AuthResponse } from "../types";
import { apiClient } from "../utils/api";
import { apiEndpoints } from "../config/apiConfig";

interface AuthContextType {
  user: Candidate | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<Candidate>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("authToken");
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await apiClient.get<Candidate>(apiEndpoints.candidateMe);
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>(apiEndpoints.login, {
      email,
      password,
    });
    localStorage.setItem("authToken", response.token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await apiClient.post<AuthResponse>(apiEndpoints.register, {
      name,
      email,
      password,
      phone,
    });
    localStorage.setItem("authToken", response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/";
  };

  const updateUser = (userData: Partial<Candidate>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
