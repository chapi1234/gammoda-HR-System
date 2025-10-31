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
      const res: any = await apiClient.get(apiEndpoints.candidateMe);
      // backend shape: { status: true, data: <candidate> }
      // apiClient may already unwrap axios response. Be defensive and try a few shapes.
      const payload = unwrapResponse(res);
      if (payload) {
        // payload could be candidate object, or { user, token }
        if ((payload as any).user) setUser((payload as any).user as Candidate);
        else setUser(payload as Candidate);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res: any = await apiClient.post(apiEndpoints.login, {
      email,
      password,
    });

    const payload = unwrapResponse(res);
    // payload may be { user, token } or the candidate directly (older APIs)
    let token: string | undefined;
    let userObj: Candidate | null = null;

    if (payload) {
      if ((payload as any).token) token = (payload as any).token;
      if ((payload as any).user) userObj = (payload as any).user as Candidate;
      // if payload looks like a candidate document
      if (!userObj && (payload as any)._id) userObj = payload as Candidate;
    }

    if (token) localStorage.setItem("authToken", token);
    if (userObj) setUser(userObj);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res: any = await apiClient.post(apiEndpoints.register, {
      name,
      email,
      password,
      phone,
    });

    const payload = unwrapResponse(res);
    let token: string | undefined;
    let userObj: Candidate | null = null;

    if (payload) {
      if ((payload as any).token) token = (payload as any).token;
      if ((payload as any).user) userObj = (payload as any).user as Candidate;
      if (!userObj && (payload as any)._id) userObj = payload as Candidate;
    }

    if (token) localStorage.setItem("authToken", token);
    if (userObj) setUser(userObj);
  };

  // Helper to defensively unwrap API responses coming from different shapes.
  function unwrapResponse(res: any): any {
    if (!res) return null;
    // axios-like: res.data
    if (res.data !== undefined) {
      // If backend wraps payload as { status, data }
      if (res.data.data !== undefined) return res.data.data;
      return res.data;
    }
    // direct server response (already unwrapped)
    if (res.status !== undefined && res.data === undefined && res !== null) {
      // maybe the server response object itself: { status: true, data: ... }
      if ((res as any).data !== undefined) return (res as any).data;
    }
    return res;
  }

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
