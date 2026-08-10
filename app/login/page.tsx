"use client";

import {
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/toast-context";

export default function LoginPage() {
  const router = useRouter();

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

  // ==========================================
  // Redirect if already logged in
  // ==========================================

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
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

        setTimeout(() => {
          router.replace("/");
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
      <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
        <p className="text-[#777]">
          Loading...
        </p>
      </main>
    );
  }

  // ==========================================
  // Login Page
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <ShoppingBag
            size={28}
            className="text-[#C78B7B]"
          />
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-center font-serif text-5xl text-[#2E2E2E]">
          Welcome Back
        </h1>

        <p className="mb-10 text-center text-[#777]">
          Login to continue shopping with
          Mahalaksmi Jewellery.
        </p>

        {/* Login / Register Tabs */}
        <div className="mb-8 grid grid-cols-2 rounded-lg bg-[#F5F1EF] p-1">

          <button
            type="button"
            className="rounded-md bg-white py-3 font-medium text-[#2E2E2E] shadow-sm"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/register")
            }
            className="rounded-md py-3 font-medium text-[#777] transition hover:text-[#3A2528]"
          >
            Register
          </button>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="h-12 w-full border border-[#E6E0DA] bg-white px-4 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
            required
          />

          {/* Password */}
          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="h-12 w-full border border-[#E6E0DA] bg-white px-4 pr-12 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
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
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {/* Forgot Password */}
          <div className="text-right">

            <Link
              href="/forgot-password"
              className="text-sm text-[#3A2528] hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[#8D4E67] font-semibold text-white transition hover:bg-[#7B4259] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>

        {/* Guest Login */}
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="mt-6 w-full text-center text-[#7B5A56] transition hover:text-[#3A2528]"
        >
          Continue as Guest →
        </button>

        {/* Register */}
        <div className="mt-8 border-t border-[#ECE6E1] pt-6 text-center">

          <span className="text-[#777]">
            Don't have an account?
          </span>

          <Link
            href="/register"
            className="ml-2 font-semibold text-[#3A2528] hover:underline"
          >
            Register
          </Link>

        </div>

      </div>

    </main>
  );
}