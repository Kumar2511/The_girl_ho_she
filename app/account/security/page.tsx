"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SecurityForm from "@/components/account/SecurityForm";
import { useAuth } from "@/context/AuthContext";

export default function SecurityPage() {
  const router = useRouter();

  const { deleteAccount } = useAuth();

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // Delete Account
  // ==========================================

  const handleDeleteAccount = async () => {
    setError("");

    if (!password.trim()) {
      setError(
        "Please enter your current password."
      );

      return;
    }

    try {
      setDeleting(true);

      const success =
        await deleteAccount(password);

      if (!success) {
        setError(
          "Unable to delete your account. Please check your password and try again."
        );

        return;
      }

      // Account deleted successfully
      setPassword("");

      setShowDeleteModal(false);

      router.replace("/");
    } catch (error) {
      console.error(
        "Delete Account UI Error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setPassword("");
    setError("");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-10">
        <div className="mx-auto max-w-3xl px-6">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <h1 className="mb-2 text-4xl font-bold text-[#2E2E2E]">
            Security
          </h1>

          <p className="mb-8 text-gray-500">
            Manage your password and account security
          </p>

          {/* ==========================================
              CHANGE PASSWORD
          ========================================== */}

          <div className="rounded-2xl border border-[#E8E3DC] bg-white p-8 shadow">
            <SecurityForm />
          </div>

          {/* ==========================================
              DELETE ACCOUNT
          ========================================== */}

          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 shadow">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                <Trash2
                  size={21}
                  className="text-red-600"
                />
              </div>

              <div className="flex-1">

                <h2 className="text-xl font-semibold text-[#2E2E2E]">
                  Delete My Account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Permanently delete your account and
                  remove your personal account information.
                </p>

                <p className="mt-2 text-sm leading-6 text-red-500">
                  This action cannot be undone.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setPassword("");
                    setShowDeleteModal(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <Trash2 size={16} />

                  Delete My Account
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleting
            ) {
              closeDeleteModal();
            }
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* Header */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle
                    size={22}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#2E2E2E]">
                    Delete Account?
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    This action is permanent.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>

            </div>

            {/* Warning */}

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm leading-6 text-red-700">
                Your account will be permanently deleted.
                You will no longer be able to sign in to
                this account.
              </p>
            </div>

            {/* Password */}

            <div className="mt-6">

              <label
                htmlFor="delete-account-password"
                className="mb-2 block text-sm font-semibold text-[#2E2E2E]"
              >
                Enter your current password
              </label>

              <input
                id="delete-account-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Current password"
                autoComplete="current-password"
                disabled={deleting}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-gray-100"
              />

            </div>

            {/* Error */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Actions */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={
                  deleting ||
                  !password.trim()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />

                    Permanently Delete
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}