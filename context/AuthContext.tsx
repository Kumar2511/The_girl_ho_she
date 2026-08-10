"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import api from "@/lib/api";

import {
  User,
  LoginData,
  RegisterData,
} from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (data: LoginData) => Promise<boolean>;

  register: (
    data: RegisterData
  ) => Promise<boolean>;

  verifyEmailOTP: (
    email: string,
    otp: string
  ) => Promise<boolean>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // Load Logged-in User
  // ==========================================

  const loadUser = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get(
        "/auth/profile"
      );

      setUser(data.user);
    } catch (error) {
      console.error(
        "Load User Error:",
        error
      );

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Authentication Check
  // ==========================================

  useEffect(() => {
    loadUser();
  }, []);

  // ==========================================
  // Login
  // ==========================================

  const login = async (
    loginData: LoginData
  ): Promise<boolean> => {
    try {
      const { data } =
        await api.post(
          "/auth/login",
          loginData
        );

      localStorage.setItem(
        "token",
        data.token
      );

      setUser(data.user);

      return true;
    } catch (error: any) {
      console.error(
        "Login Error:",
        error
      );

      return false;
    }
  };

  // ==========================================
  // Register
  // ==========================================

  const register = async (
    registerData: RegisterData
  ): Promise<boolean> => {
    try {
      await api.post(
        "/auth/register",
        registerData
      );

      return true;
    } catch (error: any) {
      console.error(
        "Register Error:",
        error
      );

      if (error.response) {
        console.log(
          "Status:",
          error.response.status
        );

        console.log(
          "Response:",
          error.response.data
        );
      }

      return false;
    }
  };

  // ==========================================
  // Verify Email OTP
  // ==========================================

  const verifyEmailOTP = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      await api.post(
        "/auth/verify-email",
        {
          email,
          otp,
        }
      );

      // OTP verification is NOT login.
      // User must login separately.
      localStorage.removeItem("token");
      setUser(null);

      return true;
    } catch (error: any) {
      console.error(
        "OTP Verification Error:",
        error
      );

      return false;
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmailOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// useAuth Hook
// ==========================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}