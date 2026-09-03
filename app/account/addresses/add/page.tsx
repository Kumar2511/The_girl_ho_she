"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { addAddress } from "@/services/profileService";
import { useToast } from "@/context/toast-context";

export default function AddAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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
      showToast("Please fill all required fields.", "error");
      return;
    }

    try {
      setLoading(true);
      await addAddress(form);
      showToast("Address added successfully", "success");
      router.push("/account/addresses");
    } catch (error) {
      console.error(error);
      showToast("Failed to save address", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        <Navbar />

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/account/addresses"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#888] hover:text-[#CB8161]"
          >
            <ArrowLeft size={13} /> Back to Saved Addresses
          </Link>

          <div className="rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF4F0] text-[#CB8161]">
                <MapPin size={20} />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                  Add New Delivery Address
                </h1>
                <p className="text-xs text-[#777]">
                  Save your address details for seamless checkout
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#444]">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Priya Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#444]">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#444]">
                  Street Address / Flat / Building *
                </label>
                <textarea
                  name="address"
                  placeholder="House No., Building Name, Street Name..."
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-[#E3DAD4] p-3 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E3DAD4] px-4 text-xs text-[#2E2E2E] outline-none transition focus:border-[#CB8161]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#444]">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-[#E3DAD4] bg-gray-50 px-4 text-xs text-[#2E2E2E] outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveAddress}
                  disabled={loading}
                  className="flex-1 rounded-md bg-[#1F1F1F] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#CB8161] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/account/addresses")}
                  className="rounded-md border border-[#DCD3CE] px-6 py-3 text-xs font-semibold text-[#2E2E2E] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}