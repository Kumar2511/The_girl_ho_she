"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("resetEmail");

    if (!savedEmail) {
      router.push("/forgot-password");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (
      password !== confirmPassword
    ) {
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
          otp,
          newPassword: password,
        }
      );

      // Remove temporary reset email
      localStorage.removeItem(
        "resetEmail"
      );

      // Password reset successful
      router.push("/login");
    } catch (error: any) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">

      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        <h1 className="mb-3 text-center font-serif text-4xl text-[#2E2E2E]">
          Reset Password
        </h1>

        <p className="mb-8 text-center text-[#777]">
          Enter the OTP sent to your email
          and create a new password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* OTP */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="h-12 w-full border border-[#E6E0DA] px-4 text-center tracking-[0.3em] outline-none transition focus:border-[#3A2528]"
            required
          />

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
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#777] hover:text-[#3A2528]"
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
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#777] hover:text-[#3A2528]"
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

          {/* Reset */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#8D4E67] font-semibold text-white transition hover:bg-[#7B4259] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>

        </form>

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