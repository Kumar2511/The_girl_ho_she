"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getProfile, updateProfile } from "@/services/profileService";
import { useToast } from "@/context/toast-context";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data?.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load profile details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Please enter your full name.", "error");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        <Navbar />

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/account"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#888] hover:text-[#CB8161]"
          >
            <ArrowLeft size={13} /> Back to Account
          </Link>

          <div className="rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF4F0] text-[#CB8161]">
                <User size={20} />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                  Edit Profile
                </h1>
                <p className="text-xs text-[#777]">
                  Update your personal account details
                </p>
              </div>
            </div>

            {loading ? (
              <div className="h-40 animate-pulse rounded-2xl bg-[#F7F2EF]" />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    Email Address (Account ID)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="h-11 w-full rounded-xl border border-[#E3DAD4] bg-gray-50 px-4 pl-10 text-xs text-[#666] outline-none cursor-not-allowed"
                    />
                    <Mail size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="h-11 w-full rounded-xl border border-[#E3DAD4] pl-10 pr-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                    />
                    <Phone size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1F1F1F] text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98] disabled:opacity-60"
                  >
                    {saving ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}