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
      className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Enter your email address"
        disabled={loading}
        className="h-12 sm:h-13 w-full flex-1 rounded-xl border border-[#DCD3CE] bg-white px-4 py-3 text-sm text-[#2E2E2E] outline-none placeholder:text-[#888] shadow-xs transition focus:border-[#CB8161] focus:ring-2 focus:ring-[#CB8161]/10 disabled:opacity-60"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="h-12 sm:h-13 w-full sm:w-auto shrink-0 rounded-xl bg-[#1F1F1F] px-7 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Subscribing..."
          : "Subscribe"}
      </button>
    </form>
  );
}