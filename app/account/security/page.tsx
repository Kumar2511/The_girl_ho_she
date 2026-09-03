"use client";

import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SecurityForm from "@/components/account/SecurityForm";

export default function SecurityPage() {
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
                <ShieldCheck size={20} />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                  Password & Security
                </h1>
                <p className="text-xs text-[#777]">
                  Change your account password to stay secure
                </p>
              </div>
            </div>

            <SecurityForm />
          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}