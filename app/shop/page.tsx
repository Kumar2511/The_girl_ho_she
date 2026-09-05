"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";

import api from "@/lib/api";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductGrid from "./components/product-grid";
import EmptyState from "./components/empty-state";
import { useScrollLock } from "@/hooks/useScrollLock";

const sortLabels: Record<string, string> = {
  bestsellers: "Best selling",
  newest: "Date, new to old",
  oldest: "Date, old to new",
  "price-low": "Price, low to high",
  "price-high": "Price, high to low",
  "name-asc": "Alphabetical, A-Z",
  "name-desc": "Alphabetical, Z-A",
};

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

  const selectedCollection =
    searchParams.get("collection") || "";

  const search =
    searchParams.get("search") || "";

  // ==========================================
  // State & Refs
  // ==========================================

  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [sortBy, setSortBy] =
    useState("bestsellers");

  const [minPrice, setMinPrice] =
    useState(0);

  const [maxPrice, setMaxPrice] =
    useState(10000);

  const [priceLimit, setPriceLimit] =
    useState(10000);

  const [availabilityFilter, setAvailabilityFilter] =
    useState<"all" | "in-stock" | "out-of-stock">("all");

  const [activePopover, setActivePopover] =
    useState<"none" | "availability" | "price" | "sort">("none");

  const [showMobileFilterDrawer, setShowMobileFilterDrawer] =
    useState(false);

  const [isClosingDrawer, setIsClosingDrawer] =
    useState(false);

  const [mobileSection, setMobileSection] =
    useState<string | null>(null);

  const closeMobileFilterDrawer = () => {
    setIsClosingDrawer(true);
    setTimeout(() => {
      setShowMobileFilterDrawer(false);
      setIsClosingDrawer(false);
    }, 260);
  };

  const openMobileFilterDrawer = () => {
    setMobileSection(null);
    setIsClosingDrawer(false);
    setShowMobileFilterDrawer(true);
  };

  // ==========================================
  // Body Scroll Lock for Mobile Filter Drawer
  // ==========================================

  useScrollLock(showMobileFilterDrawer);

  // ==========================================
  // Popover Outside Click & Escape Handler
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActivePopover("none");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePopover("none");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ==========================================
  // Categories (Dynamic from DB)
  // ==========================================

  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        if (response.data?.categories && Array.isArray(response.data.categories)) {
          setDbCategories(response.data.categories.filter((c: any) => c.isActive !== false));
        }
      } catch (err) {
        console.error("Failed to load categories from API:", err);
      }
    };
    fetchCategories();
  }, []);

  const categories = useMemo(() => {
    return [
      { name: "All Products", icon: "💎" },
      ...dbCategories.map((c) => {
        const nameLower = String(c.name || "").toLowerCase();
        let icon = "✨";
        if (nameLower.includes("necklace")) icon = "📿";
        else if (nameLower.includes("earring")) icon = "✨";
        else if (nameLower.includes("bangle")) icon = "💫";
        else if (nameLower.includes("ring")) icon = "💍";
        else if (nameLower.includes("bracelet")) icon = "👑";
        else if (nameLower.includes("anklet")) icon = "🦶";
        else if (nameLower.includes("hair") || nameLower.includes("accessory")) icon = "🌸";
        else if (nameLower.includes("bridal") || nameLower.includes("wedding")) icon = "👰";
        return { name: c.name, icon };
      }),
    ];
  }, [dbCategories]);

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
            "Shop fetch error:",
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
        const normSelectedCat = selectedCategory.toLowerCase().trim();
        data = data.filter((product) => {
          const cat = String(product.category || "").toLowerCase().trim();
          return (
            cat === normSelectedCat ||
            cat === normSelectedCat.replace(/s$/, "") ||
            cat.replace(/s$/, "") === normSelectedCat.replace(/s$/, "")
          );
        });
      }

      // ----------------------------------------
      // Collection
      // ----------------------------------------

      if (selectedCollection) {
        const normCol = selectedCollection.toLowerCase().trim();

        data = data.filter((product) => {
          const productCols = Array.isArray(product.collections)
            ? product.collections.map((c: string) => String(c).toLowerCase().trim())
            : [];
          const singleCol = String(product.collection || "").toLowerCase().trim();
          const singleCat = String(product.category || "").toLowerCase().trim();
          return (
            productCols.includes(normCol) ||
            singleCol === normCol ||
            singleCat === normCol
          );
        });
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
      // Availability / Stock
      // ----------------------------------------

      if (availabilityFilter === "in-stock") {
        data = data.filter(
          (product) => Number(product.stock ?? 1) > 0
        );
      } else if (availabilityFilter === "out-of-stock") {
        data = data.filter(
          (product) => Number(product.stock ?? 1) <= 0
        );
      }

      // ----------------------------------------
      // Sorting
      // ----------------------------------------

      switch (sortBy) {
        case "price-low":
          data.sort(
            (a, b) => Number(a.price || 0) - Number(b.price || 0)
          );
          break;

        case "price-high":
          data.sort(
            (a, b) => Number(b.price || 0) - Number(a.price || 0)
          );
          break;

        case "name-asc":
          data.sort(
            (a, b) => String(a.name || "").localeCompare(String(b.name || ""))
          );
          break;

        case "name-desc":
          data.sort(
            (a, b) => String(b.name || "").localeCompare(String(a.name || ""))
          );
          break;

        case "oldest":
          data.sort(
            (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );
          break;

        case "bestsellers":
          data.sort(
            (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
          );
          break;

        case "newest":
        default:
          data.sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          break;
      }

      return data;
    }, [
      products,
      selectedCategory,
      selectedCollection,
      search,
      minPrice,
      maxPrice,
      availabilityFilter,
      sortBy,
    ]);

  // ==========================================
  // Check if filters are active
  // ==========================================

  const hasActiveFilters =
    minPrice > 0 ||
    maxPrice < priceLimit ||
    availabilityFilter !== "all" ||
    sortBy !== "bestsellers";

  // ==========================================
  // Clear Filters
  // ==========================================

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(priceLimit);
    setAvailabilityFilter("all");
    setSortBy("bestsellers");
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
  // Render
  // ==========================================

  return (
    <>
      <Navbar />

      {/* =====================================
          Hero
      ====================================== */}

      <section className="border-b border-[#E8E3DC] bg-[#FAF8F6] py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#2E2E2E] sm:text-4xl lg:text-5xl">
            {search
              ? `Search Results for "${search}"`
              : selectedCollection
                ? `${selectedCollection}`
                : selectedCategory !== "All Products"
                  ? `${selectedCategory}`
                  : "Antique Jewellery Catalogue"}
          </h1>
        </div>
      </section>

      {/* =====================================
          Shop
      ====================================== */}

<section className="mx-auto max-w-[1450px] px-[15px] py-8 lg:px-10">        {/* =====================================
            MOBILE TOOLBAR BAR (md:hidden)
        ====================================== */}

        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-neutral-200/80 bg-white p-3 shadow-xs md:hidden">
          <button
            type="button"
            onClick={openMobileFilterDrawer}
            aria-label="Open filter and sort drawer"
            className="flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-xs font-medium text-[#1F1F1F] transition hover:border-[#CB8161]/50 hover:bg-[#FAF8F5] active:scale-[0.98]"
          >
            <SlidersHorizontal size={14} className="text-[#CB8161]" />
            <span>Filter &amp; Sort</span>
            {hasActiveFilters && (
              <span className="flex h-2 w-2 rounded-full bg-[#CB8161]" />
            )}
          </button>

          <span className="text-xs font-medium text-[#666666]">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        </div>

        {/* =====================================
            DESKTOP CATALOGUE TOOLBAR (hidden md:block)
        ====================================== */}

        <div ref={toolbarRef} className="relative mb-8 hidden rounded-lg border border-neutral-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 md:block">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* LEFT SIDE: FILTERS */}
            <div className="flex items-center gap-3">
              <span className="font-semibold uppercase tracking-wider text-[#1F1F1F]">
                Filter:
              </span>

              {/* AVAILABILITY POPOVER */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActivePopover(activePopover === "availability" ? "none" : "availability")}
                  className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-xs font-medium transition ${
                    availabilityFilter !== "all" || activePopover === "availability"
                      ? "border-[#1F1F1F] bg-[#1F1F1F] text-white shadow-xs"
                      : "border-neutral-200/90 bg-white text-[#1F1F1F] hover:border-[#CB8161]"
                  }`}
                >
                  <span>Availability</span>
                  <span className={`text-[10px] transition-transform duration-200 ${activePopover === "availability" ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>

                {activePopover === "availability" && (
                  <div className="animate-dropdown-fade absolute left-0 top-full z-40 mt-2 w-56 rounded-md border border-neutral-200/90 bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#CB8161]">
                        Availability
                      </span>
                      {availabilityFilter !== "all" && (
                        <button
                          type="button"
                          onClick={() => setAvailabilityFilter("all")}
                          className="text-[10px] font-semibold text-[#CB8161] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 cursor-pointer py-1 text-xs text-[#1F1F1F] hover:text-[#CB8161]">
                        <input
                          type="radio"
                          name="availability"
                          checked={availabilityFilter === "all"}
                          onChange={() => setAvailabilityFilter("all")}
                          className="accent-[#1F1F1F]"
                        />
                        <span>All Items</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer py-1 text-xs text-[#1F1F1F] hover:text-[#CB8161]">
                        <input
                          type="radio"
                          name="availability"
                          checked={availabilityFilter === "in-stock"}
                          onChange={() => setAvailabilityFilter("in-stock")}
                          className="accent-[#1F1F1F]"
                        />
                        <span>In Stock Only</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer py-1 text-xs text-[#1F1F1F] hover:text-[#CB8161]">
                        <input
                          type="radio"
                          name="availability"
                          checked={availabilityFilter === "out-of-stock"}
                          onChange={() => setAvailabilityFilter("out-of-stock")}
                          className="accent-[#1F1F1F]"
                        />
                        <span>Out of Stock</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* PRICE POPOVER */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActivePopover(activePopover === "price" ? "none" : "price")}
                  className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-xs font-medium transition ${
                    minPrice > 0 || maxPrice < priceLimit || activePopover === "price"
                      ? "border-[#1F1F1F] bg-[#1F1F1F] text-white shadow-xs"
                      : "border-neutral-200/90 bg-white text-[#1F1F1F] hover:border-[#CB8161]"
                  }`}
                >
                  <span>Price</span>
                  <span className={`text-[10px] transition-transform duration-200 ${activePopover === "price" ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>

                {activePopover === "price" && (
                  <div className="animate-dropdown-fade absolute left-0 top-full z-40 mt-2 w-72 rounded-md border border-neutral-200/90 bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#CB8161]">
                        Price Range
                      </span>
                      {(minPrice > 0 || maxPrice < priceLimit) && (
                        <button
                          type="button"
                          onClick={() => {
                            setMinPrice(0);
                            setMaxPrice(priceLimit);
                          }}
                          className="text-[10px] font-semibold text-[#CB8161] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-[10px] font-semibold text-[#666666] block mb-1">From ₹</label>
                        <input
                          type="number"
                          min={0}
                          max={maxPrice}
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-full rounded-md border border-neutral-200 p-2 text-xs text-[#1F1F1F]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#666666] block mb-1">To ₹</label>
                        <input
                          type="number"
                          min={minPrice}
                          max={priceLimit}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full rounded-md border border-neutral-200 p-2 text-xs text-[#1F1F1F]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePopover("none")}
                      className="w-full rounded-md bg-[#1F1F1F] py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#CB8161]"
                    >
                      Apply Filter
                    </button>
                  </div>
                )}
              </div>

              {/* CLEAR ALL BUTTON */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-[#CB8161] hover:underline"
                >
                  <RotateCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* RIGHT SIDE: SORT BY + PRODUCT COUNT */}
            <div className="flex items-center gap-4">
              
              {/* SORT BY POPOVER */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#666666]">Sort by:</span>
                  <button
                    type="button"
                    onClick={() => setActivePopover(activePopover === "sort" ? "none" : "sort")}
                    className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-xs font-medium transition ${
                      activePopover === "sort"
                        ? "border-[#1F1F1F] bg-[#1F1F1F] text-white shadow-xs"
                        : "border-neutral-200/90 bg-white text-[#1F1F1F] hover:border-[#CB8161]"
                    }`}
                  >
                    <span>{sortLabels[sortBy] || "Best selling"}</span>
                    <span className={`text-[10px] transition-transform duration-200 ${activePopover === "sort" ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                </div>

                {activePopover === "sort" && (
                  <div className="animate-dropdown-fade absolute right-0 top-full z-40 mt-2 w-56 rounded-2xl border border-[#E8DFD9] bg-white p-3 shadow-xl">
                    <div className="space-y-1">
                      {[
                        { id: "bestsellers", label: "Best selling" },
                        { id: "newest", label: "Date, new to old" },
                        { id: "oldest", label: "Date, old to new" },
                        { id: "price-low", label: "Price, low to high" },
                        { id: "price-high", label: "Price, high to low" },
                        { id: "name-asc", label: "Alphabetical, A-Z" },
                        { id: "name-desc", label: "Alphabetical, Z-A" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setActivePopover("none");
                          }}
                          className={`w-full text-left rounded-lg px-3 py-2 text-xs transition ${
                            sortBy === opt.id
                              ? "bg-[#F5EBE6] font-bold text-[#3A2528]"
                              : "text-[#4A403D] hover:bg-[#FDFBF7] hover:text-[#C78B7B]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC PRODUCT COUNT */}
              <span className="font-semibold text-[#777] text-xs">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>

            </div>

          </div>
        </div>

        {/* =====================================
            MOBILE RIGHT-SIDE FILTER DRAWER
        ====================================== */}

        {showMobileFilterDrawer && (
          <div className="fixed inset-0 z-[100] flex justify-end md:hidden">
            {/* BACKDROP */}
            <div
              onClick={closeMobileFilterDrawer}
              className={`fixed inset-0 bg-black/50 backdrop-blur-xs ${
                isClosingDrawer ? "animate-backdrop-fade-out" : "animate-backdrop-fade"
              }`}
            />

            {/* RIGHT SLIDE-IN PANEL */}
            <div
              data-scrollable="true"
              className={`relative z-10 flex h-full w-[85%] max-w-[380px] flex-col bg-white shadow-2xl ${
                isClosingDrawer ? "animate-panel-out-right" : "animate-panel-in-right"
              }`}
            >
              {/* DRAWER HEADER */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#EEE5DE] px-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#3A2528]">Filter and sort</h3>
                  <p className="text-[11px] text-[#888]">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeMobileFilterDrawer}
                  aria-label="Close filter drawer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EBE6] text-[#3A2528] transition hover:bg-[#E8D9D1]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* DRAWER BODY (SCROLLABLE) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* ACCORDION 1: AVAILABILITY */}
                <div className="border-b border-[#F4EEE9] pb-5">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "availability" ? null : "availability")}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-[#3A2528]"
                  >
                    <span>Availability</span>
                    <span className={`text-xs text-[#C78B7B] transition-transform duration-200 ${mobileSection === "availability" ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {mobileSection === "availability" && (
                    <div className="mt-3 space-y-2.5 pl-2 animate-dropdown-fade">
                      <label className="flex items-center gap-3 text-xs text-[#4A403D] cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-availability"
                          checked={availabilityFilter === "all"}
                          onChange={() => setAvailabilityFilter("all")}
                          className="h-4 w-4 accent-[#3A2528]"
                        />
                        <span>All Items</span>
                      </label>
                      <label className="flex items-center gap-3 text-xs text-[#4A403D] cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-availability"
                          checked={availabilityFilter === "in-stock"}
                          onChange={() => setAvailabilityFilter("in-stock")}
                          className="h-4 w-4 accent-[#3A2528]"
                        />
                        <span>In Stock Only</span>
                      </label>
                      <label className="flex items-center gap-3 text-xs text-[#4A403D] cursor-pointer">
                        <input
                          type="radio"
                          name="mobile-availability"
                          checked={availabilityFilter === "out-of-stock"}
                          onChange={() => setAvailabilityFilter("out-of-stock")}
                          className="h-4 w-4 accent-[#3A2528]"
                        />
                        <span>Out of Stock</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* ACCORDION 2: PRICE RANGE */}
                <div className="border-b border-[#F4EEE9] pb-5">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "price" ? null : "price")}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-[#3A2528]"
                  >
                    <span>Price Range</span>
                    <span className={`text-xs text-[#C78B7B] transition-transform duration-200 ${mobileSection === "price" ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {mobileSection === "price" && (
                    <div className="mt-3 space-y-3 pl-2 animate-dropdown-fade">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-[#777] block mb-1">From ₹</label>
                          <input
                            type="number"
                            min={0}
                            max={maxPrice}
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                            className="w-full rounded-xl border border-[#E5DDD8] px-3 py-2.5 text-xs font-semibold text-[#3A2528] outline-none focus:border-[#C78B7B]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-[#777] block mb-1">To ₹</label>
                          <input
                            type="number"
                            min={minPrice}
                            max={priceLimit}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value) || priceLimit)}
                            className="w-full rounded-xl border border-[#E5DDD8] px-3 py-2.5 text-xs font-semibold text-[#3A2528] outline-none focus:border-[#C78B7B]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCORDION 3: SORT BY (COLLAPSED BY DEFAULT) */}
                <div className="border-b border-[#F4EEE9] pb-5">
                  <button
                    type="button"
                    onClick={() => setMobileSection(mobileSection === "sort" ? null : "sort")}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-[#3A2528]"
                  >
                    <span className="flex items-center gap-2">
                      <span>Sort By</span>
                      <span className="text-xs font-normal text-[#888]">({sortLabels[sortBy] || "Best selling"})</span>
                    </span>
                    <span className={`text-xs text-[#C78B7B] transition-transform duration-200 ${mobileSection === "sort" ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {mobileSection === "sort" && (
                    <div className="mt-3 space-y-1 pl-1 animate-dropdown-fade">
                      {[
                        { id: "bestsellers", label: "Best selling" },
                        { id: "newest", label: "Date, new to old" },
                        { id: "oldest", label: "Date, old to new" },
                        { id: "price-low", label: "Price, low to high" },
                        { id: "price-high", label: "Price, high to low" },
                        { id: "name-asc", label: "Alphabetical, A-Z" },
                        { id: "name-desc", label: "Alphabetical, Z-A" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSortBy(opt.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                            sortBy === opt.id
                              ? "bg-[#F5EBE6] font-bold text-[#3A2528]"
                              : "text-[#555] hover:bg-[#FAF8F6]"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.id && <Check size={14} className="text-[#C78B7B]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* DRAWER FOOTER (STICKY BOTTOM) */}
              <div className="shrink-0 border-t border-[#EEE5DE] bg-white p-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(priceLimit);
                    setAvailabilityFilter("all");
                    setSortBy("bestsellers");
                  }}
                  className="flex-1 rounded-xl border border-[#E5DDD8] py-3 text-xs font-bold text-[#3A2528] transition hover:bg-[#F5EBE6]"
                >
                  Remove all
                </button>
                <button
                  type="button"
                  onClick={closeMobileFilterDrawer}
                  className="flex-1 rounded-xl bg-[#3A2528] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#29181B]"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        )}

        {/* =====================================
            Products Grid Section
        ====================================== */}

        <div className="mt-8">
          {loading ? (
            <ProductSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#E8DFD9] bg-white p-8 text-center">
              <EmptyState />
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-[#3A2528] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#29181B]"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
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