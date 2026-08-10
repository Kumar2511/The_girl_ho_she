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
      className="mt-8 flex flex-col gap-4 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Enter your email"
        disabled={loading}
        className="h-14 flex-1 rounded-full border border-white/20 bg-white/10 px-6 text-white outline-none placeholder:text-white/50 focus:border-[#C78B7B] disabled:opacity-60"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="h-14 rounded-full bg-[#C78B7B] px-8 font-semibold text-white transition hover:bg-[#B5776B] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Subscribing..."
          : "Subscribe"}
      </button>
    </form>
  );
}