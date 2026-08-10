"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { addAddress } from "@/services/profileService";

export default function AddAddressPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveAddress = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await addAddress(form);

      alert("✅ Address added successfully");

      router.push("/account/addresses");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-10 px-4">

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#E8E3DC] p-8">

          <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">
            Add New Address
          </h1>

          <p className="text-gray-500 mb-8">
            Add a delivery address for your future orders.
          </p>

          <div className="space-y-5">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <textarea
              name="address"
              placeholder="House No, Street, Area..."
              value={form.address}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#C78B7B]"
            />

            <div className="flex gap-4">

              <button
                onClick={saveAddress}
                disabled={loading}
                className="flex-1 bg-[#C78B7B] hover:bg-[#B5776B] text-white py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>

              <button
                onClick={() => router.push("/account/addresses")}
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