"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Home, CheckCircle2, ArrowLeft, Pencil, X } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAddresses, deleteAddress, updateAddress } from "@/services/profileService";
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
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const { showToast } = useToast();

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

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

  const handleStartEdit = (addr: Address) => {
    setEditingAddress(addr);
    setEditForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingAddress) return;

    if (
      !editForm.fullName.trim() ||
      !editForm.phone.trim() ||
      !editForm.address.trim() ||
      !editForm.city.trim() ||
      !editForm.state.trim() ||
      !editForm.pincode.trim()
    ) {
      showToast("Please fill in all required address fields.", "error");
      return;
    }

    try {
      setSavingEdit(true);
      await updateAddress(editingAddress._id, editForm);
      showToast("Address updated successfully", "success");
      setEditingAddress(null);
      await loadAddresses();
    } catch (error: any) {
      console.error("Update Address Error:", error);
      showToast(error?.response?.data?.message || "Failed to update address", "error");
    } finally {
      setSavingEdit(false);
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C98C78] px-6 text-xs font-medium uppercase tracking-wider text-white shadow-xs transition-all duration-300 hover:bg-[#B5776B] active:scale-[0.98]"
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF4F0] text-[#C98C78]">
                <MapPin size={28} />
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-[#2E2E2E]">No Saved Addresses</h2>
              <p className="mt-1.5 text-xs text-[#777]">
                Add your primary delivery address for faster checkout.
              </p>
              <button
                type="button"
                onClick={() => router.push("/account/addresses/add")}
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#C98C78] px-6 text-xs font-medium text-white hover:bg-[#B5776B]"
              >
                <Plus size={15} /> Add First Address
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {addresses.map((address, index) => (
                <div
                  key={address._id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#E8DFD9] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#C98C78]/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between border-b border-[#EEE6E1] pb-3.5">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-[#C98C78]" />
                        <h3 className="font-serif text-lg font-semibold text-[#2E2E2E]">
                          {address.fullName}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {index === 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF4F0] px-2.5 py-0.5 text-[10px] font-bold text-[#C98C78]">
                            <CheckCircle2 size={10} /> Default
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(address)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C98C78] transition hover:text-[#B5776B] hover:underline"
                        >
                          <Pencil size={12} /> Edit Address
                        </button>
                      </div>
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

          {/* EDIT ADDRESS MODAL */}
          {editingAddress && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
              <div className="w-full max-w-lg rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between border-b border-[#EEE6E1] pb-4">
                  <div className="flex items-center gap-2">
                    <Pencil size={18} className="text-[#C98C78]" />
                    <h3 className="font-serif text-xl font-semibold text-[#2E2E2E]">Edit Address</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingAddress(null)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#444]">Full Name *</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-[#E3DAD4] px-3.5 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#444]">Phone Number *</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-[#E3DAD4] px-3.5 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#444]">Street Address *</label>
                    <textarea
                      rows={2}
                      value={editForm.address}
                      onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                      className="w-full rounded-xl border border-[#E3DAD4] p-3 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#444]">City *</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[#E3DAD4] px-3.5 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#444]">State *</label>
                      <input
                        type="text"
                        value={editForm.state}
                        onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[#E3DAD4] px-3.5 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#444]">Pincode *</label>
                      <input
                        type="text"
                        value={editForm.pincode}
                        onChange={(e) => setEditForm((p) => ({ ...p, pincode: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[#E3DAD4] px-3.5 text-xs text-[#2E2E2E] outline-none transition focus:border-[#C98C78]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#444]">Country</label>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[#E3DAD4] bg-gray-50 px-3.5 text-xs text-[#2E2E2E] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={savingEdit}
                      className="flex-1 rounded-xl bg-[#C98C78] py-2.5 text-xs font-medium uppercase tracking-wider text-white shadow-xs transition hover:bg-[#B5776B] disabled:opacity-60"
                    >
                      {savingEdit ? "Updating Address..." : "Update Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAddress(null)}
                      className="rounded-xl border border-[#EFE8DE] bg-[#FAF7F2] px-5 py-2.5 text-xs font-medium text-[#4A3428] hover:bg-[#F3ECE1]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}