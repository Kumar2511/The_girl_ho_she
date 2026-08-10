"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/toast-context";

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
    <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-md rounded-xl border border-[#ECE6E1] bg-white p-8 shadow-sm">

        {/* Heading */}
        <h1 className="mb-3 text-center font-serif text-5xl text-[#2E2E2E]">
          Create Account
        </h1>

        <p className="mb-10 text-center text-[#777]">
          Join Mahalaksmi Jewellery and start shopping.
        </p>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="h-12 w-full border border-[#E6E0DA] bg-white px-4 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="h-12 w-full border border-[#E6E0DA] bg-white px-4 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
            required
          />

          {/* Phone */}
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="h-12 w-full border border-[#E6E0DA] bg-white px-4 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
            required
          />

          {/* Password */}
          <div className="relative">

            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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

          {/* Confirm Password */}
          <div className="relative">

            <input
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="h-12 w-full border border-[#E6E0DA] bg-white px-4 pr-12 text-[#2E2E2E] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#3A2528]"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center bg-[#3A2528] font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <div className="mt-8 border-t border-[#ECE6E1] pt-6 text-center">

          <span className="text-[#777]">
            Already have an account?
          </span>

          <Link
            href="/login"
            className="ml-2 font-semibold text-[#3A2528] hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </main>
  );
}