"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  getAddresses,
  deleteAddress,
} from "@/services/profileService";

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

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAddress(id);

      alert("✅ Address deleted successfully");

      loadAddresses();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete address");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-10">

        <div className="max-w-5xl mx-auto px-6">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-4xl font-bold text-[#2E2E2E]">
                My Addresses
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your delivery addresses
              </p>

            </div>

            <button
              onClick={() =>
                router.push("/account/addresses/add")
              }
              className="bg-[#C78B7B] hover:bg-[#B5776B] text-white px-6 py-3 rounded-lg"
            >
              + Add Address
            </button>

          </div>

          {loading ? (

            <div className="text-center py-20">
              Loading...
            </div>

          ) : addresses.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md border border-[#E8E3DC] p-10 text-center">

              <div className="text-6xl mb-4">
                📍
              </div>

              <h2 className="text-2xl font-bold">
                No Addresses Found
              </h2>

              <p className="text-gray-500 mt-3">
                Add your first delivery address.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              {addresses.map((address) => (

                <div
                  key={address._id}
                  className="bg-white rounded-2xl shadow-md border border-[#E8E3DC] p-6"
                >

                  <h2 className="font-bold text-xl">
                    {address.fullName}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {address.phone}
                  </p>

                  <p className="mt-4">
                    {address.address}
                  </p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>
                    {address.pincode}
                  </p>

                  <p>
                    {address.country}
                  </p>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        router.push(
                          `/account/addresses/edit/${address._id}`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(address._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </ProtectedRoute>
  );
}