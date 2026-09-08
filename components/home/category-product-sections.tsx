"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/product-card";

type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  discountPrice?: number;
  originalPrice?: number;
  images?: string[];
  image?: string;
  hoverImage?: string;
  stock?: number;
  numReviews?: number;
  averageRating?: number;
  featured?: boolean;
};

const TARGET_BEST_SELLING_CATEGORIES = [
  { key: "necklaces", displayName: "Best Selling Necklaces", rawCategory: "Necklaces" },
  { key: "chains", displayName: "Best Selling Chains", rawCategory: "Chains" },
  { key: "bracelets", displayName: "Best Selling Bracelets", rawCategory: "Bracelets" },
  { key: "earrings", displayName: "Best Selling Earrings", rawCategory: "Earrings" },
  { key: "rings", displayName: "Best Selling Rings", rawCategory: "Rings" },
];

const normalizeCategory = (value?: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

export default function CategoryProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const response = await api.get("/products");
        const prods = response.data?.products || response.data || [];

        if (mounted) {
          setProducts(Array.isArray(prods) ? prods : []);
        }
      } catch (error) {
        console.error("Homepage category products error:", error);
        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const groupedCategories = useMemo(() => {
    const groups = new Map<string, Product[]>();

    products.forEach((product) => {
      const category = String(product.category || "").trim();
      if (!category) return;

      const norm = normalizeCategory(category);
      const existing = groups.get(norm) || [];
      groups.set(norm, [...existing, product]);
    });

    return groups;
  }, [products]);

  if (loading) {
    return (
      <section className="bg-[#FDF9F5] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="mx-auto h-3 w-24 animate-pulse rounded bg-[#E8DCD4]" />
            <div className="mx-auto mt-4 h-8 w-56 animate-pulse rounded bg-[#E8DCD4]" />
          </div>

          <div className="grid grid-cols-2 gap-[10px] px-[15px] sm:gap-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl bg-white"
              >
                <div className="aspect-[4/5] animate-pulse bg-[#EEE5DF]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[#EEE5DF]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FDF9F5] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* =========================================
            5 BEST SELLING CATEGORY SECTIONS
        ========================================== */}

        {TARGET_BEST_SELLING_CATEGORIES.map((catConfig) => {
          const matchingProducts =
            groupedCategories.get(catConfig.key) || [];

          const categoryProducts = matchingProducts.length
            ? matchingProducts
            : products.filter(
                (p) => normalizeCategory(p.category) === catConfig.key
              );

          if (!categoryProducts.length) {
            return null;
          }

          return (
            <CategorySection
              key={catConfig.key}
              displayName={catConfig.displayName}
              rawCategory={catConfig.rawCategory}
              products={categoryProducts}
            />
          );
        })}

        {/* =========================================
            VIEW ALL CATEGORIES PAGE CTA BUTTON
        ========================================== */}
        <div className="mt-14 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#C98C78] px-8 py-3.5 text-xs font-bold  tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#B5776B] hover:shadow-lg active:scale-95"
                                    style={{ color: "#FFFFFF" }}

          >
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   CATEGORY SECTION COMPONENT
========================================================= */

function CategorySection({
  displayName,
  rawCategory,
  products,
}: {
  displayName: string;
  rawCategory: string;
  products: Product[];
}) {
  const productsRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = productsRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.children) as HTMLElement[];
      if (!cards.length) return;

      const containerLeft = container.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - containerLeft
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [products.length]);

  const scrollToProduct = (index: number) => {
    const container = productsRef.current;
    if (!container) return;

    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  const handlePrevious = () => {
    const nextIndex = Math.max(activeIndex - 1, 0);
    scrollToProduct(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = Math.min(activeIndex + 1, products.length - 1);
    scrollToProduct(nextIndex);
  };

  return (
    <section className="mb-16 last:mb-0 sm:mb-20">

      {/* =========================================
          CENTERED CATEGORY HEADING
      ========================================== */}

      <div className="mb-8 text-center">
  
        <h2 className="font-serif mt-1.5 text-2xl font-normal text-[#4A3428] sm:text-3xl lg:text-4xl">
          {displayName}
        </h2>
      </div>

      {/* =========================================
          HORIZONTAL PRODUCT SCROLLER
      ========================================== */}

      <div
        ref={productsRef}
        className="
          flex
          gap-3
          overflow-x-auto
          overflow-y-hidden
          pb-3
          snap-x
          snap-mandatory
          scrollbar-hide
          sm:gap-4
        "
      >
        {products.map((product) => {
          const img =
            product.images?.[0] ||
            product.image ||
            "/placeholder-product.jpg";

          const hImg =
            product.images?.[1] ||
            product.hoverImage;

          const pPrice =
            product.discountPrice && product.discountPrice > 0
              ? product.discountPrice
              : product.price || 0;

          const origPrice =
            product.discountPrice && product.discountPrice > 0
              ? product.price || 0
              : product.originalPrice || 0;

          return (
            <div
              key={product._id}
              className="
                w-[72vw]
                shrink-0
                snap-start
                sm:w-[280px]
                lg:w-[300px]
              "
            >
              <ProductCard
                id={product._id}
                name={product.name}
                category={product.category || rawCategory}
                image={img}
                hoverImage={hImg}
                price={pPrice}
                originalPrice={origPrice}
                badge={product.featured ? "Featured" : undefined}
                numReviews={product.numReviews}
                averageRating={product.averageRating}
                stock={product.stock}
              />
            </div>
          );
        })}
      </div>

      {/* =========================================
          NUMBER PAGINATION
      ========================================== */}

      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          aria-label={`Previous ${displayName} product`}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-[#EFE8DE]
            text-[#4A3428]
            transition-all
            hover:border-[#C98C78]
            hover:text-[#C98C78]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex max-w-[70vw] items-center gap-1 overflow-x-auto px-1 scrollbar-hide">
          {products.map((_product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToProduct(index)}
              aria-label={`View product ${index + 1}`}
              className={`
                flex
                h-8
                min-w-8
                items-center
                justify-center
                rounded-full
                px-2
                text-[11px]
                font-medium
                transition-all
                ${
                  activeIndex === index
                    ? "bg-[#C98C78] text-white shadow-xs"
                    : "text-[#4A3428]/70 hover:bg-[#FAF7F2]"
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === products.length - 1}
          aria-label={`Next ${displayName} product`}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-[#EFE8DE]
            text-[#4A3428]
            transition-all
            hover:border-[#C98C78]
            hover:text-[#C98C78]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* =========================================
          CENTERED SECTION VIEW ALL BUTTON
      ========================================== */}
      <div className="mt-6 text-center">
        <Link
          href={`/shop?category=${encodeURIComponent(rawCategory)}`}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#C98C78]
            px-6
            py-2.5
            text-xs
            font-bold
            tracking-wider
            text-white
            shadow-xs
            transition-all
            duration-300
            hover:bg-[#B5776B]
            hover:shadow-md
            active:scale-95
          "
                                  style={{ color: "#FFFFFF" }}

        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </section>
  );
}