"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/services/profileService";
import { useToast } from "@/context/toast-context";

export default function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill all password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        currentPassword,
        newPassword,
      });

      showToast("Password changed successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to change password. Please check your current password.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-[#444]">
          Current Password *
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 pr-10 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-3 text-gray-400 hover:text-black"
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-[#444]">
          New Password *
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min. 6 chars)"
            className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 pr-10 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-3 text-gray-400 hover:text-black"
          >
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-[#444]">
          Confirm New Password *
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
          required
        />
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1F1F1F] text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}