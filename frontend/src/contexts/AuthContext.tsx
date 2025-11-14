import React, { createContext, useState, useEffect, useMemo } from "react";
import * as authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  address?: string;
  recaptchaToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean; // Add this helper
  login: (
    email: string,
    password: string,
    recaptchaToken: string
  ) => Promise<any>;
  signup: (formData: SignupData) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data); // Extract data from response
        } catch (error) {
          console.error("Token verification failed:", error);
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (
    email: string,
    password: string,
    recaptchaToken: string
  ): Promise<any> => {
    const response = await authService.login(email, password, recaptchaToken);

    localStorage.setItem("token", response.data.accessToken);

    try {
      const userResponse = await authService.getMe();
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      console.error("Failed to fetch user data after login:", error);
      authService.logout();
      setUser(null);
      throw new Error("Login succeeded but failed to verify user.");
    }
  };

  const signup = async (formData: SignupData): Promise<any> => {
    return authService.signup(formData);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role as any) || false;
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      hasRole,
      login,
      signup,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we know auth status */}
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}
