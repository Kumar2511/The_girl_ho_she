"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  getProfile,
  updateProfile,
} from "@/services/profileService";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setName(data.user.name);
      setEmail(data.user.email);
      setPhone(data.user.phone || "");
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile({
        name,
        phone,
      });

      setIsSuccess(true);
      setMessage("✅ Profile updated successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
          <div className="text-lg">Loading profile...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-12 px-4">

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#E8E3DC] p-8">

          <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">
            My Profile
          </h1>

          <p className="text-gray-500 mb-8">
            Update your personal information.
          </p>

          <div className="space-y-6">

            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 text-[#2E2E2E] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 text-sm font-medium ${
                  isSuccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-4">

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#C78B7B] hover:bg-[#B5776B] text-white py-3 rounded-lg font-semibold transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => router.push("/account")}
                className="flex-1 border border-[#C78B7B] text-[#C78B7B] py-3 rounded-lg font-semibold hover:bg-[#FCFAF7] transition"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}