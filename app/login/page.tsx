"use client";

import {
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useState,
  Suspense,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/toast-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user,
    loading: authLoading,
    login,
  } = useAuth();

  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const getRedirectTarget = () => {
    const param = searchParams?.get("redirect") || searchParams?.get("returnUrl");
    if (param) return param;
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("redirect_after_login");
      if (stored) return stored;
    }
    return "/";
  };

  // ==========================================
  // Redirect if already logged in
  // ==========================================

  useEffect(() => {
    if (!authLoading && user) {
      const target = getRedirectTarget();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirect_after_login");
      }
      router.replace(target);
    }
  }, [user, authLoading, router]);

  // ==========================================
  // Login
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const success = await login({
        email,
        password,
      });

      if (success) {
        showToast(
          "Login successful!",
          "success"
        );

        const target = getRedirectTarget();
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("redirect_after_login");
        }

        setTimeout(() => {
          router.replace(target);
        }, 500);
      } else {
        showToast(
          "Login unsuccessful. Please check your email and password.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      showToast(
        "Login unsuccessful. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Authentication loading
  // ==========================================

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#FCFAF7] flex flex-col justify-between">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-[#777]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#C78B7B] border-t-transparent" />
            <span>Loading...</span>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ==========================================
  // Login Page
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FCFAF7] flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="mx-auto my-10 sm:my-14 w-full max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-[#ECE6E1] bg-white p-6 sm:p-8 shadow-sm">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <ShoppingBag
              size={32}
              className="text-[#C78B7B]"
            />
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-center font-serif text-3xl sm:text-4xl text-[#2E2E2E]">
            Welcome Back
          </h1>

          <p className="mb-8 text-center text-xs sm:text-sm text-[#777]">
            Login to continue shopping with Mahalaksmi Jewellery.
          </p>

          {/* Login / Register Tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#F5F1EF] p-1 text-xs sm:text-sm">
            <button
              type="button"
              className="rounded-lg bg-white py-2.5 font-semibold text-[#2E2E2E] shadow-sm transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/register")
              }
              className="rounded-lg py-2.5 font-medium text-[#777] transition hover:text-[#3A2528]"
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#C78B7B] transition hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 pr-12 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#777] transition hover:text-[#3A2528]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#C78B7B] disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

          </form>

          {/* Guest Login */}
          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="mt-5 w-full text-center text-xs font-medium text-[#7B5A56] transition hover:text-[#3A2528]"
          >
            Continue as Guest →
          </button>

          {/* Register */}
          <div className="mt-6 border-t border-[#ECE6E1] pt-5 text-center text-xs sm:text-sm">
            <span className="text-[#777]">
              Don&apos;t have an account?
            </span>
            <Link
              href="/register"
              className="ml-2 font-bold text-[#C78B7B] transition hover:underline"
            >
              Register Now
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
          <div className="w-10 h-10 border-4 border-[#C78B7B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}