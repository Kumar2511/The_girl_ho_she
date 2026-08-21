"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Necklaces",
    slug: "Necklaces",
    image: "/products/necklace-1.png",
  },
  {
    name: "Earrings",
    slug: "Earrings",
    image: "/products/earrings-1.png",
  },
  {
    name: "Rings",
    slug: "Rings",
    image: "/products/ring-1.png",
  },
  {
    name: "Bangles",
    slug: "Bangles",
    image: "/products/bracelet-1.png",
  },
  {
    name: "Bracelets",
    slug: "Bracelets",
    image: "/products/bracelet-1.png",
  },
  {
    name: "Jewellery Sets",
    slug: "Jewellery Sets",
    image: "/products/chain-1.png",
  },
];

export default function DesignerCollections() {
  return (
    <section className="w-full bg-[#FFFCF8] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ==========================================
            SECTION HEADING
        ========================================== */}

        <div className="mb-8 text-center sm:mb-10 lg:mb-12">

          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#9A7568] sm:text-xs">
            Shop
          </p>

          <h2 className="font-luxury mt-2 text-3xl leading-tight text-[#2E2E2E] sm:text-4xl lg:text-5xl">
            Shop by Categories
          </h2>

        </div>

        {/* ==========================================
            CATEGORY GRID
        ========================================== */}

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${encodeURIComponent(
                category.slug
              )}`}
              className="
                group
                relative
                block
                overflow-hidden
                rounded-[3px]
                bg-[#F3E8E1]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
            >

              {/* ==========================================
                  IMAGE
              ========================================== */}

              <div className="relative aspect-[0.82] w-full overflow-hidden">

                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="
                    (max-width: 639px) 50vw,
                    (max-width: 1023px) 33vw,
                    16vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.04]
                  "
                />

                {/* Soft image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              </div>

              {/* ==========================================
                  CATEGORY NAME
              ========================================== */}

              <div className="flex min-h-[52px] items-center justify-between bg-[#CC8769] px-3 sm:min-h-[58px] sm:px-4">

                <span className="font-serif text-[13px] text-[#2E211D] sm:text-sm lg:text-[15px]">
                  {category.name}
                </span>

                <span
                  aria-hidden="true"
                  className="
                    text-base
                    text-[#2E211D]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}