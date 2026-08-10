"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#2E2E2E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-4 flex flex-col items-start gap-1">
              <span className="text-lg">💎</span>

              <span className="font-serif text-2xl font-bold">
                Mahalakshmi
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/70">
              Beautiful jewellery inspired by tradition and crafted
              for everyday elegance. Discover necklaces, earrings,
              bangles, rings and more.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 font-semibold tracking-wide">
              Shop
            </h4>

            <div className="flex flex-col gap-2 text-sm text-white/70">

              <Link
                href="/shop"
                className="transition hover:text-white"
              >
                Shop All
              </Link>

              <Link
                href="/shop?category=Necklace"
                className="transition hover:text-white"
              >
                Necklaces
              </Link>

              <Link
                href="/shop?category=Earrings"
                className="transition hover:text-white"
              >
                Earrings
              </Link>

              <Link
                href="/shop?category=Bangles"
                className="transition hover:text-white"
              >
                Bangles
              </Link>

              <Link
                href="/shop?category=Rings"
                className="transition hover:text-white"
              >
                Rings
              </Link>

              <Link
                href="/shop?category=Bracelets"
                className="transition hover:text-white"
              >
                Bracelets
              </Link>

            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-3 font-semibold tracking-wide">
              Help
            </h4>

            <div className="flex flex-col gap-2 text-sm text-white/70">

              <Link
                href="/about"
                className="transition hover:text-white"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/shipping"
                className="transition hover:text-white"
              >
                Shipping & Delivery
              </Link>

              <Link
                href="/returns"
                className="transition hover:text-white"
              >
                Returns & Exchanges
              </Link>

              <Link
                href="/faq"
                className="transition hover:text-white"
              >
                FAQ
              </Link>

            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="mb-3 font-semibold tracking-wide">
              Follow Us
            </h4>

            <div className="flex gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold transition hover:bg-[#C78B7B]"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold transition hover:bg-[#C78B7B]"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold transition hover:bg-[#C78B7B]"
              >
                ▶
              </a>

            </div>

            <p className="mt-4 text-sm text-white/50">
              Free shipping on orders above ₹5,000
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-4 text-center">
          <p className="text-sm text-white/50">
            © 2026 Mahalakshmi. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}