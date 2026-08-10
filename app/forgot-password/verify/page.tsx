"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function VerifyResetOTPPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/verify-reset-otp",
        {
          email,
          otp,
        }
      );

      // OTP successfully verified
      sessionStorage.setItem(
        "resetOtpVerified",
        "true"
      );

      router.push(
        "/forgot-password/reset"
      );
    } catch (error: any) {
      console.error(
        "Reset OTP Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        <h1 className="mb-3 text-center font-serif text-4xl text-[#2E2E2E]">
          Verify OTP
        </h1>

        <p className="mb-8 text-center text-[#777]">
          Enter the OTP sent to your email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            value={email}
            readOnly
            className="h-12 w-full border border-[#E6E0DA] bg-gray-100 px-4"
          />

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            className="h-12 w-full border border-[#E6E0DA] px-4 text-center text-xl tracking-[0.3em] outline-none focus:border-[#3A2528]"
            required
          />

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#8D4E67] font-semibold text-white hover:bg-[#7B4259] disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

      </div>
    </main>
  );
}