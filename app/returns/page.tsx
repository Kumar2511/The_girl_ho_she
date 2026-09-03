import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  RefreshCcw,
  Video,
  Clock3,
  PackageCheck,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Return & Exchange Policy",
  description:
    "Return and exchange policy for the_girl_ho_se jewellery orders.",
};

export default function ReturnsPage() {
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
                  We perform multi-level quality inspections before sending every
                  order. Returns are accepted only if the product received is
                  damaged during transit or if an incorrect item was delivered.
                </p>
              </div>
            </div>
          </div>

          {/* Video Requirement */}
          <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
                <Video size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                  Mandatory Verification
                </p>

                <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                  360-Degree Unboxing Video
                </h2>

                <p className="mt-5 leading-7 text-[#6B6B6B]">
                  To claim a return or exchange for a damaged product, an
                  unedited, 360-degree unboxing video recorded from opening the
                  outer courier package is strictly mandatory. Claims without an
                  unboxing video will not be entertained under any circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* Non Returnable */}
          <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
                <AlertCircle size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                  Exclusions
                </p>

                <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                  Non-Returnable Items
                </h2>

                <p className="mt-5 leading-7 text-[#6B6B6B]">
                  Custom-made jewellery, bridal sets ordered on special request,
                  and items damaged due to improper handling by the customer are
                  strictly non-returnable and non-exchangeable.
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Timeline */}
          <div className="mb-8 rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
                <Clock3 size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                  Timeline
                </p>

                <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                  Reporting Window
                </h2>

                <p className="mt-5 leading-7 text-[#6B6B6B]">
                  Any issue regarding damage or wrong shipment must be reported to
                  our team within 24 hours of delivery. Requests submitted after
                  this 24-hour window will not be processed.
                </p>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="rounded-2xl border border-[#E8E0DB] bg-white p-7 sm:p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
                <RefreshCcw size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                  How It Works
                </p>

                <h2 className="font-luxury mt-2 text-3xl text-[#2E2E2E] sm:text-4xl">
                  Exchange Process
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-xs font-semibold text-white">
                  1
                </span>

                <p className="pt-1 text-sm leading-6 text-[#666]">
                  Contact our customer support via WhatsApp or email with your
                  Order ID and unboxing video.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-xs font-semibold text-white">
                  2
                </span>

                <p className="pt-1 text-sm leading-6 text-[#666]">
                  If the product is damaged or defective, raise your claim
                  within 24 hours of delivery.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] text-xs font-semibold text-white">
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