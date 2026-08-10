"use client";

import Link from "next/link";
import {
  Gem,
  Sparkles,
  CircleDollarSign,
  Crown,
  Diamond,
  Flower2,
} from "lucide-react";

const categories = [
  {
    name: "Necklaces",
    slug: "Necklaces",
    icon: Gem,
  },
  {
    name: "Earrings",
    slug: "Earrings",
    icon: Sparkles,
  },
  {
    name: "Rings",
    slug: "Rings",
    icon: CircleDollarSign,
  },
  {
    name: "Bangles",
    slug: "Bangles",
    icon: Diamond,
  },
  {
    name: "Bracelets",
    slug: "Bracelets",
    icon: Flower2,
  },
  {
    name: "Jewellery Sets",
    slug: "Jewellery Sets",
    icon: Crown,
  },
];

export default function DesignerCollections() {
  return (
    <section className="py-20 bg-[#FFFCF8]">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <p className="uppercase tracking-[0.3em] text-[#C78B7B] text-sm font-semibold">
            Collections
          </p>

          <h2 className="font-luxury mt-3 text-5xl text-[#2E2E2E]">
  Designer Collections
</h2>

          <p className="mt-4 text-[#777] text-lg">
            Discover timeless jewellery crafted for every occasion.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-14">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-3xl border border-[#EFE3DA] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
              >

                <Icon className="mx-auto w-10 h-10 text-[#C78B7B] group-hover:scale-110 transition" />

                <h3 className="mt-5 text-lg font-semibold text-[#2E2E2E]">
                  {category.name}
                </h3>

              </Link>
            );
          })}

        </div>

      </div>

    </section>
  );
}