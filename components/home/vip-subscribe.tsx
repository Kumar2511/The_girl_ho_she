"use client";

import { useState } from "react";
import { useToast } from "@/context/toast-context";
import api from "@/lib/api";

export default function VipSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showToast(
        "Please enter your email address.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/subscribers",
        {
          email: trimmedEmail,
        }
      );

      showToast(
        res.data.message ||
          "You're now a VIP subscriber!",
        "success"
      );

      setEmail("");
    } catch (error: any) {
      console.error(
        "Subscription Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to subscribe. Please try again.";

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex w-full flex-col items-center gap-4"
    >
      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Enter your email address"
        disabled={loading}
        className="h-12 w-full rounded-xl border border-[#EFE8DE] bg-white px-4 py-3 text-sm text-[#4A3428] outline-none placeholder:text-[#9E8E84] shadow-xs transition focus:border-[#C98C78] focus:ring-2 focus:ring-[#C98C78]/10 disabled:opacity-60"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full max-w-[220px] rounded-xl bg-[#C98C78] px-8 text-sm font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#B5776B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Subscribing..."
          : "Subscribe"}
      </button>
    </form>
  );
}