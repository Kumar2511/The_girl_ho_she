"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  // =================================
  // Check OTP Verification
  // =================================

  useEffect(() => {
    const verified = sessionStorage.getItem(
      "resetOtpVerified"
    );

    const savedEmail =
      localStorage.getItem("resetEmail");

    if (
      verified !== "true" ||
      !savedEmail
    ) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(savedEmail);
    setChecking(false);
  }, [router]);

  // =================================
  // Reset Password
  // =================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/reset-password",
        {
          email,
          newPassword: password,
        }
      );

      // Clear reset session
      sessionStorage.removeItem(
        "resetOtpVerified"
      );

      localStorage.removeItem(
        "resetEmail"
      );

      // Go back to customer login
      router.replace("/login");
    } catch (error: any) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // Loading / Access Check
  // =================================

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
        <p className="text-[#777]">
          Checking verification...
        </p>
      </main>
    );
  }

  // =================================
  // Page
  // =================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">

      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        {/* Heading */}

        <h1 className="mb-3 text-center font-serif text-4xl text-[#2E2E2E]">
          Create New Password
        </h1>

        <p className="mb-8 text-center text-[#777]">
          Enter your new password below.
        </p>

        {/* Email */}

        <div className="mb-5">
          <input
            type="email"
            value={email}
            readOnly
            className="h-12 w-full cursor-not-allowed border border-[#E6E0DA] bg-gray-100 px-4 text-[#777] outline-none"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* New Password */}

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="h-12 w-full border border-[#E6E0DA] px-4 pr-12 outline-none transition focus:border-[#3A2528]"
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

          {/* Confirm Password */}

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="h-12 w-full border border-[#E6E0DA] px-4 pr-12 outline-none transition focus:border-[#3A2528]"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#777] transition hover:text-[#3A2528]"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {/* Error */}

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Reset Button */}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#8D4E67] font-semibold text-white transition hover:bg-[#7B4259] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating Password..."
              : "Change Password"}
          </button>

        </form>

        {/* Back */}

        <div className="mt-8 border-t border-[#ECE6E1] pt-6 text-center">

          <Link
            href="/login"
            className="font-semibold text-[#3A2528] hover:underline"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </main>
  );
}