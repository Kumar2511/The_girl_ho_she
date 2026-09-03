"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/toast-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RegisterPage() {
  const router = useRouter();

  const { register } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // Handle Input Changes
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear old error while typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // Register
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    // Password confirmation
    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      showToast(
        "Passwords do not match.",
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const success = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (success) {
        // Save email for OTP verification
        localStorage.setItem(
          "verifyEmail",
          form.email
        );

        // Success popup
        showToast(
          "Registration successful!",
          "success"
        );

        // Small delay so user can see popup
        setTimeout(() => {
          router.push("/verify-email");
        }, 500);
      } else {
        setError(
          "Registration failed."
        );

        showToast(
          "Registration unsuccessful. Please check your details.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

      showToast(
        "Registration unsuccessful. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7] flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="mx-auto my-10 sm:my-14 w-full max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-[#ECE6E1] bg-white p-6 sm:p-8 shadow-sm">

          {/* Heading */}
          <h1 className="mb-2 text-center font-serif text-3xl sm:text-4xl text-[#2E2E2E]">
            Create Account
          </h1>

          <p className="mb-8 text-center text-xs sm:text-sm text-[#777]">
            Join Mahalaksmi Jewellery and start shopping.
          </p>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[#E6E0DA] bg-white px-4 pr-12 text-sm text-[#2E2E2E] outline-none transition-all duration-200 placeholder:text-[#9CA3AF] focus:border-[#C78B7B] focus:ring-1 focus:ring-[#C78B7B]"
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
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="animate-panel-in-right rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#C78B7B] disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-[#ECE6E1] pt-5 text-center text-xs sm:text-sm">
            <span className="text-[#777]">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="ml-2 font-bold text-[#C78B7B] transition hover:underline"
            >
              Login Here
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}