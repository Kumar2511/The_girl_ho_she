"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Home, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAddresses, deleteAddress } from "@/services/profileService";
import { useToast } from "@/context/toast-context";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load saved addresses.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this delivery address?");
    if (!confirmDelete) return;

    try {
      await deleteAddress(id);
      showToast("Address deleted successfully", "success");
      loadAddresses();
    } catch (error) {
      console.error(error);
      showToast("Failed to delete address", "error");
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        <Navbar />

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/account"
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#888] hover:text-[#CB8161]"
              >
                <ArrowLeft size={13} /> Back to Account
              </Link>
              <h1 className="font-serif text-3xl font-semibold text-[#2E2E2E] sm:text-4xl">
                Delivery Addresses
              </h1>
              <p className="mt-1 text-xs text-[#777]">
                Manage your saved shipping and billing locations
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/account/addresses/add")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98]"
            >
              <Plus size={16} /> Add New Address
            </button>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl border border-[#E8DFD9] bg-white p-6" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl border border-[#E8DFD9] bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF4F0] text-[#CB8161]">
                <MapPin size={28} />
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-[#2E2E2E]">No Saved Addresses</h2>
              <p className="mt-1.5 text-xs text-[#777]">
                Add your primary delivery address for faster checkout.
              </p>
              <button
                type="button"
                onClick={() => router.push("/account/addresses/add")}
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] px-6 text-xs font-semibold text-white hover:bg-[#CB8161]"
              >
                <Plus size={15} /> Add First Address
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {addresses.map((address, index) => (
                <div
                  key={address._id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#E8DFD9] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#CB8161]/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#EEE6E1] pb-3.5">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-[#CB8161]" />
                        <h3 className="font-serif text-lg font-semibold text-[#2E2E2E]">
                          {address.fullName}
                        </h3>
                      </div>
                      {index === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF4F0] px-2.5 py-0.5 text-[10px] font-bold text-[#CB8161]">
                          <CheckCircle2 size={10} /> Default
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5 space-y-1 text-xs text-[#666] leading-5">
                      <p className="font-medium text-[#2E2E2E]">Phone: {address.phone}</p>
                      <p className="mt-2 text-[#444]">{address.address}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p className="font-semibold text-[#888]">{address.country || "India"}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end border-t border-[#EEE6E1] pt-3.5">
                    <button
                      type="button"
                      onClick={() => handleDelete(address._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition hover:text-red-700"
                    >
                      <Trash2 size={14} /> Remove Address
                    </button>
                  </div>
                </div>

              ))}

            </div>

          )}

        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}