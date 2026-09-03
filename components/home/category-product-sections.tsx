"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import  api  from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  discountPrice?: number;
  images?: string[];
  image?: string;
  stock?: number;
};

const normalizeCategory = (value?: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getProductImage = (product: Product) =>
  product.images?.[0] ||
  product.image ||
  "/placeholder.jpg";

const getSellingPrice = (product: Product) =>
  Number(product.discountPrice ?? product.price ?? 0);

export default function CategoryProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [prodsRes, catsRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        const prods = prodsRes.data?.products || prodsRes.data || [];
        const cats = catsRes.data?.categories || [];

        if (mounted) {
          setProducts(Array.isArray(prods) ? prods : []);
          setDbCategories(Array.isArray(cats) ? cats.filter((c: any) => c.isActive !== false) : []);
        }
      } catch (error) {
        console.error(
          "Homepage category products error:",
          error
        );

        if (mounted) {
          setProducts([]);
          setDbCategories([]);
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
      const category = String(
        product.category || ""
      ).trim();

      if (!category) return;

      const existing =
        groups.get(normalizeCategory(category)) || [];

      groups.set(
        normalizeCategory(category),
        [...existing, product]
      );
    });

    return groups;
  }, [products]);

  const categories = useMemo(() => {
    const ordered: string[] = [];

    // Order according to DB categories first.
    dbCategories.forEach((catObj) => {
      const catName = catObj.name;
      const match = Array.from(groupedCategories.keys()).find(
        (key) => key === normalizeCategory(catName)
      );

      if (match && !ordered.includes(catName)) {
        ordered.push(catName);
      }
    });

    // Then include any remaining categories found in products.
    groupedCategories.forEach((_items, normalizedCategory) => {
      const originalProduct = products.find(
        (product) =>
          normalizeCategory(product.category) === normalizedCategory
      );

      if (
        originalProduct?.category &&
        !ordered.some((o) => normalizeCategory(o) === normalizedCategory)
      ) {
        ordered.push(originalProduct.category);
      }
    });

    return ordered;
  }, [dbCategories, groupedCategories, products]);

  if (loading) {
    return (
      <section className="bg-[#FDF9F5] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="mx-auto h-3 w-24 animate-pulse rounded bg-[#E8DCD4]" />
            <div className="mx-auto mt-4 h-8 w-56 animate-pulse rounded bg-[#E8DCD4]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5">
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

  if (!categories.length) {
    return null;
  }

  return (
    <section className="bg-[#FDF9F5] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* =========================================
            CATEGORY PRODUCT SECTIONS
        ========================================== */}

        {categories.map((category) => {
          const categoryProducts =
            groupedCategories.get(
              normalizeCategory(category)
            ) || [];

          if (!categoryProducts.length) {
            return null;
          }

          const visibleProducts =
            categoryProducts;

          return (
            <CategorySection
              key={category}
              category={category}
              products={visibleProducts}
              totalProducts={categoryProducts.length}
            />
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   CATEGORY SECTION
========================================================= */

function CategorySection({
  category,
  products,
  totalProducts,
}: {
  category: string;
  products: Product[];
  totalProducts: number;
}) {
  const productsRef =
    useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  /*
   * Keep the selected number synchronized
   * with the horizontal scroll position.
   */
  useEffect(() => {
    const container =
      productsRef.current;

    if (!container) return;

    const handleScroll = () => {
      const cards =
        Array.from(
          container.children
        ) as HTMLElement[];

      if (!cards.length) return;

      const containerLeft =
        container.getBoundingClientRect()
          .left;

      let closestIndex = 0;
      let closestDistance =
        Infinity;

      cards.forEach(
        (card, index) => {
          const distance = Math.abs(
            card.getBoundingClientRect()
              .left - containerLeft
          );

          if (
            distance < closestDistance
          ) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      );

      setActiveIndex(closestIndex);
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [products.length]);

  /*
   * Scroll to a specific product.
   */
  const scrollToProduct = (
    index: number
  ) => {
    const container =
      productsRef.current;

    if (!container) return;

    const card =
      container.children[
        index
      ] as HTMLElement | undefined;

    if (!card) return;

    container.scrollTo({
      left:
        card.offsetLeft -
        container.offsetLeft,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  /*
   * Previous product.
   */
  const handlePrevious = () => {
    const nextIndex =
      Math.max(
        activeIndex - 1,
        0
      );

    scrollToProduct(nextIndex);
  };

  /*
   * Next product.
   */
  const handleNext = () => {
    const nextIndex =
      Math.min(
        activeIndex + 1,
        products.length - 1
      );

    scrollToProduct(nextIndex);
  };

  return (
    <section className="mb-16 last:mb-0 sm:mb-20">

      {/* =========================================
          CATEGORY HEADER
      ========================================== */}

      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#C78B7B] sm:text-xs">
            The Girl Ho She
          </p>

          <h2 className="font-serif text-2xl font-medium text-[#2E2E2E] sm:text-3xl lg:text-4xl">
            {category}
          </h2>
        </div>

        {/* VIEW ALL */}

        <Link
          href={`/shop?category=${encodeURIComponent(
            category
          )}`}
          className="
            group
            flex
            shrink-0
            items-center
            gap-1.5
            border-b
            border-[#C78B7B]
            pb-1
            text-xs
            font-medium
            text-[#3A2528]
            transition-all
            hover:gap-2.5
            sm:text-sm
          "
        >
          View All

          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

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
        {products.map((product) => (
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
              product={product}
            />
          </div>
        ))}
      </div>

      {/* =========================================
          NUMBER PAGINATION
      ========================================== */}

      <div className="mt-5 flex items-center justify-center gap-2">

        {/* PREVIOUS */}

        <button
          type="button"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          aria-label={`Previous ${category} product`}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-[#E5D9D2]
            text-[#5A4742]
            transition-all
            hover:border-[#C78B7B]
            hover:text-[#C78B7B]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronLeft
            size={15}
          />
        </button>

        {/* PRODUCT NUMBERS */}

        <div className="flex max-w-[70vw] items-center gap-1 overflow-x-auto px-1 scrollbar-hide">

          {products.map(
            (_product, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  scrollToProduct(
                    index
                  )
                }
                aria-label={`View ${category} product ${
                  index + 1
                }`}
                aria-current={
                  activeIndex === index
                    ? "true"
                    : undefined
                }
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
                      ? "bg-[#C78B7B] text-white shadow-sm"
                      : "text-[#6E625D] hover:bg-[#F4EAE4]"
                  }
                `}
              >
                {index + 1}
              </button>
            )
          )}

        </div>

        {/* NEXT */}

        <button
          type="button"
          onClick={handleNext}
          disabled={
            activeIndex ===
            products.length - 1
          }
          aria-label={`Next ${category} product`}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-[#E5D9D2]
            text-[#5A4742]
            transition-all
            hover:border-[#C78B7B]
            hover:text-[#C78B7B]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          <ChevronRight
            size={15}
          />
        </button>

      </div>

      {/* =========================================
          PRODUCT COUNT
      ========================================== */}

      <p className="mt-3 text-center text-[9px] uppercase tracking-[0.2em] text-[#A49791]">
        {activeIndex + 1} of{" "}
        {totalProducts}
      </p>

    </section>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const originalPrice = Number(product.price || 0);

  const sellingPrice = getSellingPrice(product);

  const hasDiscount =
    Number(product.discountPrice || 0) > 0 &&
    Number(product.discountPrice) <
      originalPrice;

  return (
    <Link
      href={`/shop/${product._id}`}
      className="
        group
        min-w-0
        overflow-hidden
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_35px_rgba(58,37,40,0.10)]
      "
    >

      {/* IMAGE */}

      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3ECE7]">

        <img
          src={getProductImage(product)}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.04]
          "
        />

        {/* SALE */}

        {hasDiscount && (
          <span
            className="
              absolute
              left-2
              top-2
              rounded-full
              bg-white
              px-2.5
              py-1
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-[#3A2528]
              shadow-sm
              sm:left-3
              sm:top-3
            "
          >
            Sale
          </span>
        )}

        {/* OUT OF STOCK */}

        {Number(product.stock ?? 1) <= 0 && (
          <span
            className="
              absolute
              bottom-2
              left-2
              rounded-full
              bg-[#3A2528]
              px-2.5
              py-1
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-white
              sm:bottom-3
              sm:left-3
            "
          >
            Sold Out
          </span>
        )}

      </div>

      {/* DETAILS */}

      <div className="p-3 sm:p-4">

        <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#C78B7B]">
          {product.category}
        </p>

        <h3
          className="
            line-clamp-2
            min-h-[34px]
            font-serif
            text-sm
            leading-5
            text-[#2E2E2E]
            sm:text-base
          "
        >
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">

          <span className="text-sm font-semibold text-[#2E2E2E] sm:text-base">
            ₹{sellingPrice.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="text-[10px] text-[#999] line-through sm:text-xs">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}

        </div>

      </div>

    </Link>
  );
}