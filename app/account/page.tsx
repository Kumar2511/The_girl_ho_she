"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, logout, deleteAccount } = useAuth();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword.trim()) {
      setDeleteError("Please enter your current password.");
      return;
    }

    try {
      setDeleting(true);
      const success = await deleteAccount(deletePassword);
      if (!success) {
        setDeleteError("Unable to delete account. Please check your password.");
        return;
      }
      setShowDeleteModal(false);
      router.replace("/");
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const accountCards = [
    {
      title: "My Orders",
      description: "Track shipment status, view order history & invoices",
      href: "/account/orders",
      icon: Package,
      badge: "Orders & Tracking",
    },
    {
      title: "Delivery Addresses",
      description: "Manage saved shipping & billing addresses",
      href: "/account/addresses",
      icon: MapPin,
      badge: "Address Book",
    },
    {
      title: "Edit Profile",
      description: "Update personal information & contact details",
      href: "/account/profile",
      icon: User,
      badge: "Personal Details",
    },
    {
      title: "Password & Security",
      description: "Change password & account security settings",
      href: "/account/security",
      icon: ShieldCheck,
      badge: "Security",
    },
  ];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        {/* SHARED NAVBAR */}
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* ==================================================
              ACCOUNT HERO HEADER CARD
          ================================================== */}
          <div className="overflow-hidden rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Avatar Badge */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1F1F1F] font-serif text-2xl font-bold text-white shadow-md sm:h-20 sm:w-20 sm:text-3xl">
                  {getInitials(user?.name)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF4F0] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#CB8161]">
                      <Sparkles size={11} /> VIP Member
                    </span>
                  </div>

                  <h1 className="mt-1 font-serif text-2xl font-semibold text-[#2E2E2E] sm:text-3xl">
                    Welcome back, {user?.name || "Valued Customer"}
                  </h1>

                  <p className="mt-1 text-xs text-[#777] sm:text-sm">
                    {user?.email || "customer@thegirlhouse.com"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] px-5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98]"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* ==================================================
              ACCOUNT NAVIGATION CARDS
          ================================================== */}
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#C78B7B]">
              Account Management
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {accountCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#E8DFD9] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CB8161]/50 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF4F0] text-[#CB8161] transition-colors group-hover:bg-[#1F1F1F] group-hover:text-white">
                          <IconComponent size={20} />
                        </div>
                        <span className="text-[10px] font-semibold text-[#999] group-hover:text-[#CB8161]">
                          {card.badge}
                        </span>
                      </div>

                      <h3 className="mt-4 font-serif text-xl text-[#2E2E2E] transition-colors group-hover:text-[#CB8161]">
                        {card.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-[#777]">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#1F1F1F] group-hover:text-[#CB8161]">
                      Manage
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              ACCOUNT ACTIONS & DESTRUCTION
          ================================================== */}
          <div className="mt-10 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2E2E2E]">
                    Delete My Account
                  </h3>
                  <p className="text-xs text-[#888]">
                    Permanently delete your profile, saved addresses and order history.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            DELETE ACCOUNT CONFIRMATION MODAL
        ================================================== */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-[#E8DFD9] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EEE] pb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={20} />
                  <h3 className="font-serif text-lg text-[#2E2E2E]">Confirm Account Deletion</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#666]">
                This action is permanent and cannot be undone. Please enter your password to confirm deletion.
              </p>

              {deleteError && (
                <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-semibold text-red-600">
                  {deleteError}
                </p>
              )}

              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-[#DDD] px-3.5 text-xs text-[#2E2E2E] outline-none focus:border-red-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="h-10 rounded-md border border-gray-300 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="h-10 rounded-md bg-red-600 px-5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHARED FOOTER */}
        <Footer />
      </main>
    </ProtectedRoute>
  );
}