import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Globe2,
  PackageCheck,
  Truck,
  Info,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Shipping & Delivery",
  description:
    "Shipping and delivery information for the_girl_ho_se jewellery orders.",
};

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E]">
      {/* ========================================
          Hero
      ======================================== */}
      <section className="border-b border-[#E8E0DB] bg-[#F8F3EF]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C78B7B]">
            Customer Information
          </p>

          <h1 className="font-luxury mt-5 text-5xl leading-tight text-[#2E2E2E] sm:text-6xl lg:text-7xl">
            Shipping &amp; Delivery
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
            Everything you need to know about dispatch and delivery of your
            jewellery order.
          </p>
        </div>
      </section>

      {/* ========================================
          Main Content
      ======================================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:py-24">
        {/* Dispatch */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-9">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <PackageCheck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Dispatch
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Order Processing
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                Dispatch within 1 or 2 days.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Times */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-9">
          <div className="mb-8 flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <Truck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Delivery
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Delivery Timelines
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Tamil Nadu */}
            <div className="rounded-xl border border-[#EEE5DF] bg-[#FCFAF7] p-6">
              <MapPin className="mb-4 text-[#C78B7B]" size={22} />

              <p className="text-sm font-semibold text-[#2E2E2E]">
                Tamil Nadu
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#C78B7B]">
                3–5
              </p>

              <p className="mt-1 text-sm text-[#777]">
                business days
              </p>
            </div>

            {/* Rest of India */}
            <div className="rounded-xl border border-[#EEE5DF] bg-[#FCFAF7] p-6">
              <MapPin className="mb-4 text-[#C78B7B]" size={22} />

              <p className="text-sm font-semibold text-[#2E2E2E]">
                Rest of India
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#C78B7B]">
                5–10
              </p>

              <p className="mt-1 text-sm text-[#777]">
                business days
              </p>
            </div>

            {/* International */}
            <div className="rounded-xl border border-[#EEE5DF] bg-[#FCFAF7] p-6">
              <Globe2 className="mb-4 text-[#C78B7B]" size={22} />

              <p className="text-sm font-semibold text-[#2E2E2E]">
                International
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#C78B7B]">
                5–10
              </p>

              <p className="mt-1 text-sm text-[#777]">
                business days
              </p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-[#F8F3EF] p-7 sm:p-9">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C78B7B]">
              <Info size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Please Note
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Important Delivery Information
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[#666] sm:text-base">
                <p>
                  International delivery time may vary due to customs
                  clearance.
                </p>

                <p>
                  Delivery time does not include holidays and festival dates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <div className="rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-9">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <Clock3 size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Tracking
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Track Your Order
              </h2>

              <p className="mt-4 leading-7 text-[#6B6B6B]">
                You will get the tracking details via your phone number
                through Indian Post.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-md bg-[#1F1F1F] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#CB8161]"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}