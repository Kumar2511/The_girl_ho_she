"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      // Save email for reset page
      localStorage.setItem(
        "resetEmail",
        email
      );

      router.push(
  "/forgot-password/verify"
);
    } catch (error: any) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">

      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        <h1 className="mb-3 text-center font-serif text-4xl text-[#2E2E2E]">
          Forgot Password
        </h1>

        <p className="mb-8 text-center text-[#777]">
          Enter your email address and we'll
          send you a password reset OTP.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="h-12 w-full border border-[#E6E0DA] px-4 outline-none transition focus:border-[#3A2528]"
            required
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#8D4E67] font-semibold text-white transition hover:bg-[#7B4259] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
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