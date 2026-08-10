import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  RefreshCcw,
  Video,
  Clock3,
  PackageCheck,
} from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy",
  description:
    "Return and exchange policy for the_girl_ho_se jewellery orders.",
};

export default function ReturnsPage() {
  return (
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
            Return &amp; Exchange Policy
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
            Please read our return and exchange conditions carefully before
            placing your order.
          </p>
        </div>
      </section>

      {/* ========================================
          Main Content
      ======================================== */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:py-24">
        {/* Return Policy */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <PackageCheck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Return Policy
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Returns
              </h2>

              <p className="mt-5 leading-7 text-[#6B6B6B]">
                We do not accept returns once the order is placed, except for
                cases covered under our exchange policy.
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <RefreshCcw size={22} />
            </div>

            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Exchange Policy
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Exchanges
              </h2>

              <p className="mt-5 leading-7 text-[#6B6B6B]">
                Exchange is available only for damaged or defective products
                received by the customer.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {/* Damaged / Defective */}
                <div className="rounded-xl border border-[#EEE5DF] bg-[#FCFAF7] p-6">
                  <AlertCircle
                    size={22}
                    className="mb-4 text-[#C78B7B]"
                  />

                  <h3 className="text-sm font-semibold text-[#2E2E2E]">
                    Damaged or Defective Products
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#777]">
                    Exchange is available only when the product received is
                    damaged or defective.
                  </p>
                </div>

                {/* Unboxing Video */}
                <div className="rounded-xl border border-[#EEE5DF] bg-[#FCFAF7] p-6">
                  <Video size={22} className="mb-4 text-[#C78B7B]" />

                  <h3 className="text-sm font-semibold text-[#2E2E2E]">
                    Unboxing Video Required
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#777]">
                    Customers must share an unboxing video from start to
                    finish, without cuts or edits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 24 Hour Claim */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-[#F8F3EF] p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C78B7B]">
              <Clock3 size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Important
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                24-Hour Exchange Claim
              </h2>

              <p className="mt-5 leading-7 text-[#666]">
                In case of damage, the customer must raise the exchange claim
                within 24 hours of delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Resolution */}
        <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
              <RefreshCcw size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                Resolution
              </p>

              <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                Exchange or Store Credit
              </h2>

              <p className="mt-5 leading-7 text-[#6B6B6B]">
                In case of damage, we will arrange an exchange of the same
                product or provide store credit, as per stock availability.
              </p>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
            Exchange Process
          </p>

          <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
            What You Need to Do
          </h2>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E2024] text-xs font-semibold text-white">
                1
              </span>

              <p className="pt-1 text-sm leading-6 text-[#666]">
                Record an unboxing video from start to finish without cuts or
                edits.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E2024] text-xs font-semibold text-white">
                2
              </span>

              <p className="pt-1 text-sm leading-6 text-[#666]">
                If the product is damaged or defective, raise your claim
                within 24 hours of delivery.
              </p>
            </div>

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E2024] text-xs font-semibold text-white">
                3
              </span>

              <p className="pt-1 text-sm leading-6 text-[#666]">
                Depending on product availability, an exchange or store credit
                will be arranged.
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
    </main>
  );
}