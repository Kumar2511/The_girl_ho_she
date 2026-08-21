"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import api from "@/lib/api";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Slider } from "@/components/ui/slider";
import ProductGrid from "./components/product-grid";
import EmptyState from "./components/empty-state";
import FindProductButton from "@/components/shop/FindProductButton";

// ======================================================
// SHOP CONTENT
// ======================================================

function ShopContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  // ==========================================
  // URL Parameters
  // ==========================================

  const selectedCategory =
    searchParams.get("category") ||
    "All Products";

  const search =
    searchParams.get("search") || "";

  // ==========================================
  // State
  // ==========================================

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [sortBy, setSortBy] =
    useState("newest");

  const [minPrice, setMinPrice] =
    useState(0);

  const [maxPrice, setMaxPrice] =
    useState(10000);

  const [priceLimit, setPriceLimit] =
    useState(10000);

  const [inStockOnly, setInStockOnly] =
    useState(false);

  const [
    showMobileFilters,
    setShowMobileFilters,
  ] = useState(false);

  // ==========================================
  // Categories
  // ==========================================

  const categories = [
    {
      name: "All Products",
      icon: "💎",
    },
    {
      name: "Necklace",
      icon: "📿",
    },
    {
      name: "Earrings",
      icon: "✨",
    },
    {
      name: "Bangles",
      icon: "💫",
    },
    {
      name: "Rings",
      icon: "💍",
    },
    {
      name: "Bracelets",
      icon: "👑",
    },
    {
      name: "Anklets",
      icon: "🦶",
    },
    {
      name: "Hair Accessories",
      icon: "🌸",
    },
    {
      name: "Bridal Collection",
      icon: "👰",
    },
  ];

  // ==========================================
  // Fetch Products
  // ==========================================

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          const response =
            await api.get(
              "/products"
            );

          const fetchedProducts =
            response.data?.products ||
            [];

          // Only show active products
          const activeProducts =
            fetchedProducts.filter(
              (product: any) =>
                product.status ===
                  undefined ||
                product.status ===
                  "active"
            );

          setProducts(
            activeProducts
          );

          // =====================================
          // Dynamic Price Limit
          // =====================================

          const prices =
            activeProducts
              .map(
                (product: any) =>
                  Number(
                    product.price
                  ) || 0
              )
              .filter(
                (price: number) =>
                  Number.isFinite(
                    price
                  )
              );

          const highestPrice =
            prices.length > 0
              ? Math.max(
                  ...prices
                )
              : 10000;

          // Round up to nearest ₹500
          const roundedPrice =
            Math.ceil(
              highestPrice / 500
            ) * 500;

          const finalPriceLimit =
            Math.max(
              10000,
              roundedPrice
            );

          setPriceLimit(
            finalPriceLimit
          );

          setMaxPrice(
            finalPriceLimit
          );
        } catch (error) {
          console.error(
            "Failed to load products:",
            error
          );

          setProducts([]);

          // Keep a safe fallback
          setPriceLimit(
            10000
          );

          setMaxPrice(
            10000
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  // ==========================================
  // Filter + Search + Sort
  // ==========================================

  const filteredProducts =
    useMemo(() => {
      let data = [...products];

      // ----------------------------------------
      // Category
      // ----------------------------------------

      if (
        selectedCategory !==
        "All Products"
      ) {
        data = data.filter(
          (product) =>
            product.category
              ?.toLowerCase()
              .trim() ===
            selectedCategory
              .toLowerCase()
              .trim()
        );
      }

      // ----------------------------------------
      // Search
      // ----------------------------------------

      if (search.trim()) {
        const searchTerm =
          search
            .toLowerCase()
            .trim();

        data = data.filter(
          (product) => {
            const name =
              product.name
                ?.toLowerCase()
                .trim() || "";

            const category =
              product.category
                ?.toLowerCase()
                .trim() || "";

            const description =
              product.description
                ?.toLowerCase()
                .trim() || "";

            return (
              name.includes(
                searchTerm
              ) ||
              category.includes(
                searchTerm
              ) ||
              description.includes(
                searchTerm
              )
            );
          }
        );
      }

      // ----------------------------------------
      // Price
      // ----------------------------------------

      data = data.filter(
        (product) => {
          const price =
            Number(
              product.price
            ) || 0;

          return (
            price >= minPrice &&
            price <= maxPrice
          );
        }
      );

      // ----------------------------------------
      // Stock
      // ----------------------------------------

      if (inStockOnly) {
        data = data.filter(
          (product) =>
            Number(
              product.stock
            ) > 0
        );
      }

      // ----------------------------------------
      // Sorting
      // ----------------------------------------

      switch (sortBy) {
        case "price-low":
          data.sort(
            (a, b) =>
              Number(
                a.price || 0
              ) -
              Number(
                b.price || 0
              )
          );
          break;

        case "price-high":
          data.sort(
            (a, b) =>
              Number(
                b.price || 0
              ) -
              Number(
                a.price || 0
              )
          );
          break;

        case "oldest":
          data.sort(
            (a, b) =>
              new Date(
                a.createdAt || 0
              ).getTime() -
              new Date(
                b.createdAt || 0
              ).getTime()
          );
          break;

        case "newest":
        default:
          data.sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ).getTime() -
              new Date(
                a.createdAt || 0
              ).getTime()
          );
          break;
      }

      return data;
    }, [
      products,
      selectedCategory,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy,
    ]);

  // ==========================================
  // Check if filters are active
  // ==========================================

  const hasActiveFilters =
    minPrice > 0 ||
    maxPrice < priceLimit ||
    inStockOnly ||
    sortBy !== "newest";

  // ==========================================
  // Clear Filters
  // ==========================================

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(priceLimit);
    setInStockOnly(false);
    setSortBy("newest");
  };

  // ==========================================
  // Category Change
  // ==========================================

  const handleCategoryChange = (
    category: string
  ) => {
    if (
      category ===
      "All Products"
    ) {
      router.push("/shop");
      return;
    }

    router.push(
      `/shop?category=${encodeURIComponent(
        category
      )}`
    );
  };

  // ==========================================
  // Loading Skeleton
  // ==========================================

  const ProductSkeleton = () => {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            {/* Image */}

            <div className="aspect-[4/5] w-full rounded-2xl bg-[#EEE9E5]" />

            {/* Content */}

            <div className="mt-4 space-y-3">
              <div className="h-3 w-20 rounded-full bg-[#E8E1DC]" />

              <div className="h-4 w-4/5 rounded-full bg-[#E8E1DC]" />

              <div className="h-4 w-1/3 rounded-full bg-[#E8E1DC]" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==========================================
  // Filter Controls
  // ==========================================

  const FilterControls = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => {
    return (
      <div
        className={
          mobile
            ? "space-y-6"
            : "flex flex-col gap-4 md:flex-row md:items-center"
        }
      >
        {/* Price Range */}

        <div
          className={
            mobile
              ? "w-full"
              : "w-full md:w-[240px]"
          }
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold tracking-wide text-[#2E2E2E]">
              Price Range
            </h4>

            <span className="text-[10px] text-[#777]">
              ₹
              {minPrice.toLocaleString(
                "en-IN"
              )}
              {" - "}
              ₹
              {maxPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <Slider
            min={0}
            max={priceLimit}
            step={100}
            value={[
              minPrice,
              maxPrice,
            ]}
            onValueChange={(
              value
            ) => {
              if (
                Array.isArray(
                  value
                ) &&
                value.length === 2
              ) {
                setMinPrice(
                  Number(
                    value[0]
                  )
                );

                setMaxPrice(
                  Number(
                    value[1]
                  )
                );
              }
            }}
            className="w-full"
          />

          <div className="mt-2 flex justify-between text-[9px] text-[#999]">
            <span>
              ₹0
            </span>

            <span>
              ₹
              {priceLimit.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>

        {/* Divider */}

        {!mobile && (
          <div className="hidden h-8 w-px bg-[#E7DFDA] md:block" />
        )}

        {/* Stock */}

        <label className="flex shrink-0 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={
              inStockOnly
            }
            onChange={(e) =>
              setInStockOnly(
                e.target.checked
              )
            }
            className="h-4 w-4 cursor-pointer accent-[#8D4E67]"
          />

          <span className="text-xs text-[#555]">
            In Stock Only
          </span>
        </label>

        {/* Clear */}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D4E67] transition hover:text-[#C78B7B]"
          >
            <X size={13} />
            Clear Filters
          </button>
        )}
      </div>
    );
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <>
      <Navbar />

      <FindProductButton />

      {/* =====================================
          Hero
      ====================================== */}

      <section className="border-b border-gray-200 bg-[#FAF8F6]">
        <div className="mx-auto max-w-[1450px] px-5 py-14 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-[#C78B7B]">
              Mahalaksmi Artificial Jewellery
            </p>

            <h1 className="font-serif text-5xl font-semibold text-[#222] lg:text-6xl">
              Shop Collection
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {search
                ? `Search Results for "${search}"`
                : selectedCategory !==
                    "All Products"
                  ? `${selectedCategory} Collection`
                  : "Discover premium artificial jewellery crafted for weddings, festivals and everyday elegance."}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================
          Shop
      ====================================== */}

      <section className="mx-auto max-w-[1450px] px-5 py-8 lg:px-10">
        {/* =====================================
            Category Pills
        ====================================== */}

        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(
              (category) => {
                const isActive =
                  selectedCategory ===
                  category.name;

                return (
                  <button
                    key={
                      category.name
                    }
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        category.name
                      )
                    }
                    className={`
                      flex shrink-0 items-center gap-1.5
                      rounded-full border
                      px-4 py-2
                      text-xs
                      font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "border-[#2E2024] bg-[#2E2024] text-white"
                          : "border-[#E5DDD8] bg-white text-[#555] hover:border-[#C78B7B] hover:text-[#C78B7B]"
                      }
                    `}
                  >
                    <span>
                      {
                        category.icon
                      }
                    </span>

                    <span>
                      {category.name ===
                      "All Products"
                        ? "All"
                        : category.name}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* =====================================
            Desktop Filters
        ====================================== */}

        <div className="hidden border-y border-[#E7DFDA] py-4 md:block">
          <div className="flex items-center justify-between gap-5">
            <FilterControls />

            <div className="shrink-0">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="
                  h-10
                  min-w-[165px]
                  rounded-lg
                  border
                  border-[#E5DDD8]
                  bg-white
                  px-3
                  text-xs
                  text-[#555]
                  outline-none
                  transition
                  focus:border-[#C78B7B]
                  focus:ring-2
                  focus:ring-[#C78B7B]/10
                "
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="oldest">
                  Oldest First
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* =====================================
            Mobile Filter Button
        ====================================== */}

        <div className="border-y border-[#E7DFDA] py-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setShowMobileFilters(
                  !showMobileFilters
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-[#E5DDD8]
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-[#2E2E2E]
              "
            >
              <SlidersHorizontal
                size={15}
              />

              Filters

              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2E2024] px-1 text-[10px] text-white">
                  !
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="
                h-10
                min-w-[150px]
                rounded-lg
                border
                border-[#E5DDD8]
                bg-white
                px-3
                text-xs
                text-[#555]
                outline-none
                focus:border-[#C78B7B]
              "
            >
              <option value="newest">
                Newest First
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>
          </div>

          {/* Mobile Filter Panel */}

          {showMobileFilters && (
            <div className="mt-4 rounded-xl border border-[#E7DFDA] bg-[#FAF8F6] p-4">
              <FilterControls mobile />
            </div>
          )}
        </div>

        {/* =====================================
            Products Toolbar
        ====================================== */}

        <div className="mt-7">
          <div>
            <p className="text-xs text-[#777]">
              Showing{" "}
              <span className="font-semibold text-[#2E2E2E]">
                {
                  filteredProducts.length
                }
              </span>{" "}
              Products
            </p>

            {search && (
              <p className="mt-1 text-xs text-[#999]">
                Search:
                <span className="ml-1 font-medium text-[#555]">
                  "{search}"
                </span>
              </p>
            )}
          </div>
        </div>

        {/* =====================================
            Products
        ====================================== */}

        <div className="mt-7">
          {loading ? (
            <ProductSkeleton />
          ) : filteredProducts.length ===
            0 ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="w-full">
                <EmptyState />
              </div>
            </div>
          ) : (
            <ProductGrid
              products={
                filteredProducts
              }
            />
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

// ======================================================
// SHOP PAGE
// Suspense Boundary for useSearchParams()
// ======================================================

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />

          <main className="min-h-[70vh] bg-[#FAF8F6]">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

                <p className="mt-5 text-sm text-[#777]">
                  Loading shop...
                </p>
              </div>
            </div>
          </main>

          <Footer />
        </>
      }
    >
      <ShopContent />
    </Suspense>
  );
}