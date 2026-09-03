import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, FileText, ShoppingBag, Truck, RefreshCcw } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the_girl_ho_se jewellery store.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E]">
      <Navbar />

      {/* ========================================
          Hero
      ======================================== */}
      <section className="border-b border-[#E8E0DB] bg-[#F8F3EF]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-10 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C78B7B]">
            Customer Information
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#2E2E2E] sm:text-5xl lg:text-6xl">
            Terms of Service
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B6B6B] sm:text-lg">
            Terms and conditions governing purchases and usage of the_girl_ho_se storefront.
          </p>
        </div>
      </section>

      {/* ========================================
          Main Content
      ======================================== */}
      <section className="mx-auto max-w-4xl px-6 py-14 sm:px-10 lg:py-20">

        {/* General Terms */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <FileText size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Terms
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Store Terms &amp; Usage
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                By browsing or placing an order on the_girl_ho_se storefront, you agree to comply with our general terms of service.
                All product pricing, product availability, and promotional offers are subject to market conditions and stock availability.
              </p>
            </div>
          </div>
        </div>

        {/* Orders & Pricing */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <ShoppingBag size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Purchases
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Orders &amp; Pricing
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                Orders placed through our website are subject to confirmation and item verification.
                We reserve the right to cancel or adjust orders in cases of pricing errors, out-of-stock items, or unauthorized transaction activities.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Links */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <Truck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Fulfillment
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Shipping &amp; Delivery
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                Delivery estimates provided at checkout are calculated based on pincode serviceability.
                For complete details regarding shipping costs and delivery schedules, please visit our <Link href="/shipping" className="font-semibold text-[#3A2528] underline">Shipping Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Returns & Exchanges */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-[#F8F3EF] p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C78B7B]">
              <RefreshCcw size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Policies
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E] sm:text-3xl">
                Exchanges &amp; Cancellations
              </h2>

              <p className="mt-4 leading-7 text-[#666]">
                All returns, exchanges, and damaged item claims are governed by our <Link href="/returns" className="font-semibold text-[#3A2528] underline">Return &amp; Exchange Policy</Link>.
                Please review our policy requirements, including the 24-hour claim window and unboxing video requirement for damaged items.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[#2E2024] bg-[#2E2024] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#4A3439]"
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
