"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmailOTP } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState("");

  // ============================
  // Load Email
  // ============================

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("verifyEmail");

    if (!savedEmail) {
      router.push("/register");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  // ============================
  // Countdown
  // ============================

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // ============================
  // OTP Input
  // ============================

  const handleOTPChange = (
    index: number,
    value: string
  ) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================
  // Backspace
  // ============================

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ============================
  // Paste OTP
  // ============================

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedData
      .split("")
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // ============================
  // Verify OTP
  // ============================

  const verifyOTP = async () => {
    const finalOTP = otp.join("");

    setError("");

    if (!email) {
      setError(
        "Email address is missing. Please register again."
      );
      return;
    }

    if (finalOTP.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    setLoading(true);

    try {
      const success = await verifyEmailOTP(
        email,
        finalOTP
      );

      if (success) {
        // Remove temporary registration email
        localStorage.removeItem(
          "verifyEmail"
        );

        /*
         * IMPORTANT:
         * OTP verification is NOT login.
         *
         * User must manually login after
         * successful email verification.
         */
        router.push("/login");
      } else {
        setError(
          "Invalid or expired OTP. Please try again."
        );
      }
    } catch (error: any) {
      console.error(
        "OTP Verification Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Resend OTP
  // ============================

  const resendOTP = async () => {
    if (seconds > 0 || !email) {
      return;
    }

    setSending(true);
    setError("");

    try {
      await api.post(
        "/auth/resend-otp",
        {
          email,
        }
      );

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setSeconds(60);

      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error(
        "Resend OTP Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-10">
      <div className="w-full max-w-md border border-[#ECE6E1] bg-white p-8 shadow-sm">

        {/* Heading */}

        <h1 className="mb-3 text-center font-serif text-4xl text-[#2E2E2E]">
          Verify Email
        </h1>

        <p className="mb-8 text-center text-[#777]">
          Enter the 6-digit OTP sent to your
          email address.
        </p>

        <div className="space-y-5">

          {/* Email */}

          <input
            type="email"
            value={email}
            readOnly
            className="h-12 w-full cursor-not-allowed border border-[#E6E0DA] bg-gray-100 px-4 text-[#777]"
          />

          {/* OTP */}

          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOTPChange(
                    index,
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                onPaste={handlePaste}
                className="h-14 w-12 border border-[#E6E0DA] text-center text-2xl font-semibold outline-none transition focus:border-[#3A2528] sm:w-14"
                aria-label={`OTP digit ${
                  index + 1
                }`}
              />
            ))}
          </div>

          {/* Error */}

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Verify Button */}

          <button
            type="button"
            onClick={verifyOTP}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center bg-[#3A2528] text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          {/* Resend */}

          <div className="text-center">

            {seconds > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <b>{seconds}s</b>
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOTP}
                disabled={sending}
                className="font-medium text-[#3A2528] hover:underline disabled:opacity-50"
              >
                {sending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}