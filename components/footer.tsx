"use client";

import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#DDD6D0] bg-[#F7F4F1] text-[#3B3633]">

      {/* ==========================================
          MAIN FOOTER
      ========================================== */}

      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-3 lg:gap-12">

          {/* ========================================
              BRAND / CONTACT
          ======================================== */}

          <div className="min-w-0">

            <Link
              href="/"
              className="inline-block"
            >
              <span className="font-serif text-2xl tracking-wide text-[#2E2927] sm:text-3xl">
                The Girl Ho She
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#665E59] sm:mt-5">
              Beautiful jewellery crafted to celebrate
              your style, your moments and every version
              of the girl Ho she is.
            </p>

            {/* Contact information */}

            <div className="mt-6 space-y-4 sm:mt-7">

              {/* Location */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#CB8161]"
                />

                <p className="min-w-0 text-sm leading-6 text-[#665E59]">
                  Velankanni, Nagapattinam,
                  <br />
                  Tamil Nadu.
                </p>

              </div>

              {/* Phone */}

              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#CB8161]"
                />

                <a
                  href="tel:+918870734341"
                  className="break-words text-sm text-[#665E59] transition-colors hover:text-[#CB8161]"
                >
                  +91 88707 34341
                </a>

              </div>

              {/* Email */}

              <div className="flex items-start gap-3">

                <Mail
                  size={18}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#CB8161]"
                />

                <a
                  href="mailto:thegirlhousecustomercare@gmail.com"
                  className="min-w-0 break-all text-sm leading-6 text-[#665E59] transition-colors hover:text-[#CB8161]"
                >
                  thegirlhousecustomercare@gmail.com
                </a>

              </div>

            </div>

          </div>


          {/* ========================================
              INFORMATION
          ======================================== */}

          <div className="min-w-0">

            <h3 className="font-serif text-xl text-[#2E2927] sm:text-2xl">
              Information
            </h3>

            <nav className="mt-5 flex flex-col gap-3.5 sm:mt-6 sm:gap-4">

              <Link
                href="/about"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                About Us
              </Link>

              <Link
                href="/privacy"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/shipping"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Shipping & Delivery
              </Link>

              <Link
                href="/returns"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Returns & Exchange
              </Link>

            </nav>

          </div>


          {/* ========================================
              QUICK LINKS
          ======================================== */}

          <div className="min-w-0">

            <h3 className="font-serif text-xl text-[#2E2927] sm:text-2xl">
              Quick links
            </h3>

            <nav className="mt-5 flex flex-col gap-3.5 sm:mt-6 sm:gap-4">

              <Link
                href="/"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Home
              </Link>

              <Link
                href="/collections"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Collections
              </Link>

              <Link
                href="/reviews"
                className="w-fit text-sm text-[#665E59] transition-colors hover:text-[#C78B7B]"
              >
                Reviews
              </Link>

            </nav>

          </div>

        </div>

      </div>


      {/* ==========================================
          BOTTOM BAR
      ========================================== */}

      <div className="border-t border-[#DDD6D0]">

        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-8 lg:px-10">

          <div className="flex flex-col gap-3 text-[10px] leading-5 text-[#766E69] sm:text-[11px]">

            {/* Copyright */}

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">

              <span>
                © {new Date().getFullYear()},{" "}
                <Link
                  href="/"
                  className="transition-colors hover:text-[#C78B7B]"
                >
                  The Girl House
                </Link>
              </span>

              <span aria-hidden="true">
                ·
              </span>

              <span>
                Powered by{" "}
                <a
                  href="https://senthill.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#5A514C] transition-colors hover:text-[#C78B7B]"
                >
                  Senthil Kumar
                </a>
              </span>

            </div>


            {/* Legal / navigation links */}

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">

              <Link
                href="/contact"
                className="transition-colors hover:text-[#C78B7B]"
              >
                Contact information
              </Link>

              <span aria-hidden="true">
                ·
              </span>

              <Link
                href="/privacy"
                className="transition-colors hover:text-[#C78B7B]"
              >
                Privacy policy
              </Link>

              <span aria-hidden="true">
                ·
              </span>

              <Link
                href="/terms"
                className="transition-colors hover:text-[#C78B7B]"
              >
                Terms of service
              </Link>

              <span aria-hidden="true">
                ·
              </span>

              <Link
                href="/shipping"
                className="transition-colors hover:text-[#C78B7B]"
              >
                Shipping policy
              </Link>

              <span aria-hidden="true">
                ·
              </span>

              <Link
                href="/returns"
                className="transition-colors hover:text-[#C78B7B]"
              >
                Refund policy
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}