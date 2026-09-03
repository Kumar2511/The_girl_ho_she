"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

type CategoryItem = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export default function DesignerCollections() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const list = Array.isArray(response.data?.categories)
          ? response.data.categories.filter((c: any) => c.isActive !== false)
          : [];
        if (mounted) {
          setCategories(list);
        }
      } catch (err) {
        console.error("DesignerCollections categories fetch error:", err);
        if (mounted) {
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !categories.length) {
    return null;
  }

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
          {categories.map((category, idx) => (
            <Link
              key={category._id || category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative block overflow-hidden rounded-[3px] bg-[#F3E8E1] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* ==========================================
                  IMAGE
              ========================================== */}

              <div className="relative aspect-[0.82] w-full overflow-hidden">
                <Image
                  src={category.image || `/products/necklace-${(idx % 4) + 1}.jpg`}
                  alt={category.name}
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
                  className="text-base text-[#2E211D] transition-transform duration-300 group-hover:translate-x-1"
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