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

  login: (
    data: LoginData
  ) => Promise<boolean>;

  register: (
    data: RegisterData
  ) => Promise<boolean>;

  verifyEmailOTP: (
    email: string,
    otp: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;

  // ==========================================
  // Delete Account
  // ==========================================

  deleteAccount: (
    password: string
  ) => Promise<boolean>;
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
    try {
      const { data } = await api.get(
        "/auth/profile"
      );

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      /*
       * 401 is EXPECTED when the user is logged out.
       *
       * Do NOT console.error it because it creates
       * unnecessary red error messages during logout
       * / initial authentication checking.
       */

      if (error?.response?.status === 401) {
        setUser(null);
        return;
      }

      console.error(
        "Load User Error:",
        error
      );

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

      console.log(
        "========== FRONTEND LOGIN =========="
      );

      console.log(
        "Login response:",
        data
      );

      if (
        !data?.success ||
        !data?.user
      ) {
        console.error(
          "Login response is invalid:",
          data
        );

        return false;
      }

      /*
       * JWT is stored in the HTTP-only cookie
       * by the backend.
       *
       * DO NOT store JWT in localStorage.
       */

      setUser(data.user);

      return true;
    } catch (error: any) {
      console.error(
        "Login Error:",
        error
      );

      if (error?.response) {
        console.error(
          "Login Status:",
          error.response.status
        );

        console.error(
          "Login Response:",
          error.response.data
        );
      }

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

      if (error?.response) {
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
      const { data } =
        await api.post(
          "/auth/verify-email",
          {
            email,
            otp,
          }
        );

      /*
       * Email verification does not create
       * a logged-in session.
       *
       * User should login normally after
       * verification.
       */

      setUser(null);

      return Boolean(
        data?.success
      );
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

  const logout = async (): Promise<void> => {
    /*
     * Immediately clear the frontend user.
     *
     * This prevents the UI from continuing to
     * display the logged-in account after logout.
     */

    setUser(null);

    try {
      await api.post(
        "/auth/logout"
      );
    } catch (error: any) {
      /*
       * If the backend already considers the
       * session unauthenticated, that's okay.
       *
       * 401 during logout is NOT a fatal error.
       */

      if (
        error?.response?.status !== 401
      ) {
        console.error(
          "Logout Error:",
          error
        );
      }
    }
  };

  // ==========================================
  // Delete My Account
  // ==========================================

  const deleteAccount = async (
    password: string
  ): Promise<boolean> => {
    try {
      const { data } =
        await api.delete(
          "/auth/account",
          {
            data: {
              password,
            },
          }
        );

      if (!data?.success) {
        console.error(
          "Delete Account Response:",
          data
        );

        return false;
      }

      // ==========================================
      // Clear Frontend Authentication State
      // ==========================================

      setUser(null);

      return true;
    } catch (error: any) {
      console.error(
        "Delete Account Error:",
        error
      );

      if (error?.response) {
        console.error(
          "Delete Account Status:",
          error.response.status
        );

        console.error(
          "Delete Account Response:",
          error.response.data
        );
      }

      return false;
    }
  };

  // ==========================================
  // Provider
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmailOTP,
        logout,
        deleteAccount,
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