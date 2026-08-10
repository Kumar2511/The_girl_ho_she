"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Gem,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Banner {
  _id?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  type?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroProps {
  banners?: Banner[];
}

export default function Hero({
  banners = [],
}: HeroProps) {
  // ============================
  // Hero Slideshow
  // ============================

  const [currentSlide, setCurrentSlide] = useState(0);

  // Only use active Hero banner images
  const heroBanners = banners
    .filter((banner) => banner.image)
    .slice(0, 3);

  const heroImages =
    heroBanners.length > 0
      ? heroBanners.map((banner) => banner.image!)
      : ["/hero-jewelry.png"];

  // Current banner
  const currentBanner =
    heroBanners[currentSlide] || heroBanners[0];

  // ============================
  // Auto Slide - Every 4 Seconds
  // ============================

  useEffect(() => {
    // No need to slide when there is only one image
    if (heroImages.length <= 1) {
      setCurrentSlide(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        return (prev + 1) % heroImages.length;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  // ============================
  // Reset slide when banners change
  // ============================

  useEffect(() => {
    if (currentSlide >= heroImages.length) {
      setCurrentSlide(0);
    }
  }, [heroImages.length, currentSlide]);

  return (
    <section className="relative overflow-hidden">

      {/* ============================
          Background
      ============================ */}

      <div className="absolute inset-0">

        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#F4D7CE]/40 blur-[150px]" />

        <div className="absolute bottom-0 right-0 w-[650px] h-[650px] rounded-full bg-[#EFD8CF]/40 blur-[180px]" />

      </div>

      <div className="relative max-w-[1450px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-14 items-center min-h-[720px]">

          {/* ============================
              LEFT SIDE
          ============================ */}

          <div>

            {/* Hero Label */}

            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6D8D0] bg-white px-5 py-2 shadow-sm">

              <Sparkles className="w-4 h-4 text-[#C78B7B]" />

              <span className="uppercase tracking-[0.25em] text-xs font-semibold text-[#8B5E4A]">
                {currentBanner?.type || "NEW ARRIVAL"}
              </span>

            </div>

            {/* Heading */}

            <h1 className="mt-8 font-serif text-5xl md:text-6xl xl:text-7xl leading-[1] text-[#2E2E2E]">

              Crafted To Shine.

              <span className="block mt-3 text-[#C78B7B]">
                Designed For You.
              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#6B6B6B]">

              {currentBanner?.subtitle ||
                "Premium artificial jewellery crafted for weddings, parties and everyday elegance."}

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href={currentBanner?.buttonLink || "/shop"}
                className="inline-flex items-center gap-2 rounded-full bg-[#C78B7B] px-8 py-4 text-white font-semibold transition hover:bg-[#B5776B]"
              >

                {currentBanner?.buttonText ||
                  "Shop Collection"}

                <ArrowRight className="w-5 h-5" />

              </Link>

              <a
                href="https://wa.me/+918870734341"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-[#DDD] bg-white px-8 py-4 font-semibold text-[#2E2E2E]"
              >
                WhatsApp Us
              </a>

            </div>

            {/* ============================
                Trust Features
            ============================ */}

            <div className="mt-12 grid grid-cols-2 gap-5">

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#C78B7B]" />
                <span className="text-[#6B6B6B]">
                  Secure Payments
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#C78B7B]" />
                <span className="text-[#6B6B6B]">
                  Fast Delivery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Gem className="w-6 h-6 text-[#C78B7B]" />
                <span className="text-[#6B6B6B]">
                  Premium Quality
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#C78B7B]" />
                <span className="text-[#6B6B6B]">
                  Luxury Collection
                </span>
              </div>

            </div>

            {/* ============================
                Statistics
            ============================ */}

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="rounded-3xl border border-[#EFE4DD] bg-white/80 p-5 shadow-lg">
                <h3 className="font-serif text-3xl text-[#C78B7B]">
                  50K+
                </h3>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Happy Customers
                </p>
              </div>

              <div className="rounded-3xl border border-[#EFE4DD] bg-white/80 p-5 shadow-lg">
                <h3 className="font-serif text-3xl text-[#C78B7B]">
                  4.9★
                </h3>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Customer Rating
                </p>
              </div>

              <div className="rounded-3xl border border-[#EFE4DD] bg-white/80 p-5 shadow-lg">
                <h3 className="font-serif text-3xl text-[#C78B7B]">
                  500+
                </h3>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Designs
                </p>
              </div>

              <div className="rounded-3xl border border-[#EFE4DD] bg-white/80 p-5 shadow-lg">
                <h3 className="font-serif text-3xl text-[#C78B7B]">
                  10+
                </h3>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Years Trust
                </p>
              </div>

            </div>

          </div>

          {/* ============================
              RIGHT SIDE
          ============================ */}

          <div className="relative flex justify-center lg:justify-end">

            {/* Background Glow */}

            <div className="absolute w-[650px] h-[650px] rounded-full bg-[#EFD8CF]/40 blur-[170px]" />

            {/* ============================
                SLIDESHOW CONTAINER
            ============================ */}

            <div className="relative z-20 overflow-hidden rounded-[38px] shadow-[0_40px_90px_rgba(0,0,0,0.18)] w-[760px] h-[620px]">

              {/* Slides */}

              <div
                className="flex h-full transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentSlide * 100
                  }%)`,
                }}
              >

                {heroImages.map((image, index) => (

                  <div
                    key={`${image}-${index}`}
                    className="relative min-w-full h-full"
                  >

                    <Image
                      src={image}
                      alt={
                        heroBanners[index]?.title ||
                        `Luxury Jewellery Slide ${
                          index + 1
                        }`
                      }
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover"
                    />

                  </div>

                ))}

              </div>

              {/* ============================
                  Floating Card
              ============================ */}

              <div className="absolute left-6 top-6 rounded-3xl bg-white/95 backdrop-blur-xl px-6 py-5 shadow-2xl">

                <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#C78B7B]">
                  {currentBanner?.type ||
                    "NEW ARRIVAL"}
                </p>

                <h3 className="mt-2 font-serif text-2xl text-[#2E2E2E]">
                  {currentBanner?.title ||
                    "Luxury Collection"}
                </h3>

                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Starting From ₹999
                </p>

              </div>

              {/* ============================
                  Rating Card
              ============================ */}

              <div className="absolute right-6 bottom-6 rounded-3xl bg-white/95 backdrop-blur-xl px-6 py-5 shadow-2xl">

                <h3 className="font-serif text-4xl text-[#D6B36A]">
                  ★ 4.9
                </h3>

                <p className="text-sm text-[#6B6B6B]">
                  Rated by 50,000+ Customers
                </p>

              </div>

              {/* ============================
                  Slide Indicators
              ============================ */}

              {heroImages.length > 1 && (

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">

                  {heroImages.map((_, index) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentSlide(index)
                      }
                      aria-label={`Go to slide ${
                        index + 1
                      }`}
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        currentSlide === index
                          ? "w-8 bg-[#C78B7B]"
                          : "w-2.5 bg-white/80"
                      }`}
                    />

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ============================
            Scroll Indicator
        ============================ */}

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:flex flex-col items-center">

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9E7D6E]">
            Scroll
          </span>

          <div className="mt-3 w-[2px] h-12 rounded-full bg-gradient-to-b from-[#C78B7B] to-transparent animate-pulse" />

        </div>

      </div>

    </section>
  );
}