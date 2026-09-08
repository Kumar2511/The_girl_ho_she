import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Bell } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for THE GIRL HOUSE jewellery store.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#4A3428]">
      <Navbar />

      {/* ========================================
          Hero
      ======================================== */}
      <section className="border-b border-[#EFE8DE] bg-[#FAF7F2]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-10 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C98C78]">
            Customer Information
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#4A3428] sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-[#7A685D] sm:text-lg">
            Information regarding how customer data and privacy are handled at THE GIRL HOUSE.
          </p>
        </div>
      </section>

      {/* ========================================
          Main Content
      ======================================== */}
      <section className="mx-auto max-w-4xl px-6 py-14 sm:px-10 lg:py-20">

        {/* Overview */}
        <div className="mb-8 rounded-2xl border border-[#EFE8DE] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#C98C78]">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C98C78]">
                Overview
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#4A3428] sm:text-3xl">
                Data &amp; Privacy Commitment
              </h2>

              <p className="mt-4 leading-7 text-[#7A685D]">
                At THE GIRL HOUSE, we value your trust and are committed to protecting your personal information.
                This Privacy Policy outlines how your personal details are collected, used, and safeguarded when visiting or making a purchase on our storefront.
              </p>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <Eye size={22} />
            </div>

            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Collection
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Information Collected
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                When you interact with our storefront or place an order, the following details may be collected to fulfill your purchase:
              </p>

              <ul className="mt-4 space-y-3 text-sm text-[#6B6B6B]">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C78B7B]" />
                  Contact details such as name, email address, phone number, and delivery address.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C78B7B]" />
                  Order history, purchase details, and shipping preferences.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C78B7B]" />
                  Session details for cart retention and secure account access.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <Lock size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Security
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Payment &amp; Account Protection
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                All online transactions and payment authentication data are processed securely through verified payment providers.
                Your session tokens are stored using secure HTTP-only cookies to prevent unauthorized access.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Updates Placeholder */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-[#F8F3EF] p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C78B7B]">
              <Bell size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Notice
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Policy Updates &amp; Contact
              </h2>

              <p className="mt-4 leading-7 text-[#666]">
                This Privacy Policy may be updated periodically to reflect operational changes or store policy updates.
                For any privacy questions or requests, please reach out through our <Link href="/contact" className="font-semibold text-[#3A2528] underline">Contact Support</Link> page.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
className="inline-flex items-center gap-2 rounded-md bg-[#C98C78] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#B5776B]"                          style={{ color: "#FFFFFF" }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
