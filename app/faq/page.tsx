import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Truck,
  RefreshCcw,
  PackageCheck,
  Video,
  Clock3,
} from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Frequently asked questions about shipping, delivery, returns and exchanges at the_girl_ho_se.",
};

const faqs = [
  {
    question: "How long does it take to dispatch my order?",
    answer: "Orders are dispatched within 1 or 2 days.",
    icon: PackageCheck,
  },
  {
    question: "How long does delivery take in Tamil Nadu?",
    answer: "Delivery within Tamil Nadu takes approximately 3–5 business days.",
    icon: Truck,
  },
  {
    question: "How long does delivery take to the rest of India?",
    answer:
      "Delivery to the rest of India takes approximately 5–10 business days.",
    icon: Truck,
  },
  {
    question: "How long does international delivery take?",
    answer:
      "International orders generally take 5–10 business days. Delivery time may vary due to customs clearance.",
    icon: Truck,
  },
  {
    question: "Do holidays and festival dates affect delivery time?",
    answer:
      "Yes. Delivery time does not include holidays and festival dates.",
    icon: Clock3,
  },
  {
    question: "How will I receive my tracking details?",
    answer:
      "Tracking details will be provided via your phone number through Indian Post.",
    icon: PackageCheck,
  },
  {
    question: "Can I return my order after placing it?",
    answer:
      "Returns are not accepted once the order is placed, except for cases covered under the exchange policy.",
    icon: RefreshCcw,
  },
  {
    question: "When is an exchange available?",
    answer:
      "Exchange is available only for damaged or defective products received by the customer.",
    icon: RefreshCcw,
  },
  {
    question: "Is an unboxing video required for an exchange?",
    answer:
      "Yes. Customers must share an unboxing video from start to finish without cuts or edits.",
    icon: Video,
  },
  {
    question: "How soon should I report a damaged product?",
    answer:
      "An exchange claim for a damaged product must be made within 24 hours of delivery.",
    icon: Clock3,
  },
  {
    question: "What happens after an exchange claim?",
    answer:
      "In case of damage, an exchange of the same product will be arranged, or store credit may be provided depending on stock availability.",
    icon: RefreshCcw,
  },
];

function FAQItem({
  question,
  answer,
  icon: Icon,
}: {
  question: string;
  answer: string;
  icon: typeof Truck;
}) {
  return (
    <details className="group border-b border-[#E8E0DB]">
      <summary className="flex cursor-pointer list-none items-center gap-4 py-6 [&::-webkit-details-marker]:hidden">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7ECE7] text-[#C78B7B]">
          <Icon size={18} />
        </span>

        <span className="flex-1 pr-4 text-sm font-semibold text-[#2E2E2E] sm:text-base">
          {question}
        </span>

        <ChevronDown
          size={18}
          className="shrink-0 text-[#C78B7B] transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <div className="pb-6 pl-14 pr-8">
        <p className="text-sm leading-7 text-[#6B6B6B]">
          {answer}
        </p>
      </div>
    </details>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E]">
      {/* ========================================
          Hero
      ======================================== */}
      <section className="border-b border-[#E8E0DB] bg-[#F8F3EF]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C78B7B]">
            Customer Support
          </p>

          <h1 className="font-luxury mt-5 text-5xl leading-tight text-[#2E2E2E] sm:text-6xl lg:text-7xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
            Find answers to common questions about orders, delivery, returns
            and exchanges.
          </p>
        </div>
      </section>

      {/* ========================================
          FAQ Content
      ======================================== */}
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:py-24">
        <div className="rounded-2xl border border-[#E8E0DB] bg-white px-6 sm:px-10">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
            />
          ))}
        </div>

        {/* Policy Links */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/shipping"
            className="group rounded-2xl border border-[#E8E0DB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C78B7B] hover:shadow-sm"
          >
            <Truck
              size={22}
              className="mb-4 text-[#C78B7B]"
            />

            <h2 className="font-luxury text-2xl text-[#2E2E2E]">
              Shipping & Delivery
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              View dispatch, delivery timelines and tracking information.
            </p>
          </Link>

          <Link
            href="/returns"
            className="group rounded-2xl border border-[#E8E0DB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C78B7B] hover:shadow-sm"
          >
            <RefreshCcw
              size={22}
              className="mb-4 text-[#C78B7B]"
            />

            <h2 className="font-luxury text-2xl text-[#2E2E2E]">
              Returns & Exchanges
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              Read the complete return and exchange policy.
            </p>
          </Link>
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