"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SecurityForm from "@/components/account/SecurityForm";

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FCFAF7] py-10">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#2E2E2E] mb-2">
            Security
          </h1>

          <p className="text-gray-500 mb-8">
            Change your password
          </p>

          <div className="bg-white rounded-2xl shadow border border-[#E8E3DC] p-8">
            <SecurityForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}