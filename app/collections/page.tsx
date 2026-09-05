"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";

import api from "@/lib/api";

import Navbar from "@/components/navbar";
import ProductCard from "@/components/shop/ProductCard";
import Footer from "@/components/footer";
import useScrollLock from "@/hooks/useScrollLock";

// ======================================================
// Collections Content
// ======================================================

function CollectionsContent() {
  const searchParams =
    useSearchParams();

  const selectedCollection =
    searchParams.get("collection");

  const [currentCollection, setCurrentCollection] = useState<string>(selectedCollection || "");

  const [isFilterMounted, setIsFilterMounted] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const openFilter = () => {
    setIsFilterMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsFilterVisible(true);
      });
    });
  };

  const closeFilter = () => {
    setIsFilterVisible(false);
    setTimeout(() => {
      setIsFilterMounted(false);
    }, 280);
  };

  const toggleFilter = () => {
    if (isFilterVisible) {
      closeFilter();
    } else {
      openFilter();
    }
  };

  useScrollLock(isFilterVisible);

  const [products, setProducts] =
    useState<any[]>([]);

  const [dbCollections, setDbCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS & COLLECTIONS
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await api.get("/collections");
      if (response.data?.collections && Array.isArray(response.data.collections)) {
        setDbCollections(response.data.collections.filter((c: any) => c.isActive !== false));
      }
    } catch (err) {
      console.error("Collections fetch error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response =
        await api.get("/products");

      setProducts(
        Array.isArray(
          response.data?.products
        )
          ? response.data.products
          : []
      );
    } catch (error) {
      console.error(
        "Collections Product Fetch Error:",
        error
      );

      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // FILTER COLLECTION
  // ==========================================

  const filteredProducts = currentCollection
    ? products.filter((product: any) => {
        const normSelected = currentCollection.toLowerCase().trim();
        const productCols = Array.isArray(product.collections)
          ? product.collections.map((c: string) => String(c).toLowerCase().trim())
          : [];
        const singleCol = String(product.collection || "").toLowerCase().trim();
        const singleCat = String(product.category || "").toLowerCase().trim();
        return (
          productCols.includes(normSelected) ||
          singleCol === normSelected ||
          singleCat === normSelected
        );
      })
    : products;

  const collectionCards = dbCollections.map((c) => {
    const titleLower = String(c.name || "").toLowerCase();
    let icon = "✨";
    if (titleLower.includes("lakshmi")) icon = "👑";
    else if (titleLower.includes("temple")) icon = "🏛️";
    else if (titleLower.includes("peacock")) icon = "🦚";
    else if (titleLower.includes("bridal")) icon = "👰";
    else if (titleLower.includes("kemp") || titleLower.includes("stone")) icon = "💎";
    else if (titleLower.includes("victorian")) icon = "🌟";
    return { title: c.name, query: c.name, icon };
  });

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="border-b border-[#E8E3DC] bg-[#F8F3EF] py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#2E2E2E] sm:text-4xl lg:text-5xl">
            {currentCollection ? currentCollection : "Curated Antique Collections"}
          </h1>
        </div>
      </section>

      {/* ==========================================
          COLLECTION FILTER CONTROL BAR
      ========================================== */}

      <section className="border-b border-[#E8E3DC] bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-[#2E2E2E] sm:text-2xl">
              {currentCollection || "All Collections"}
            </h2>
            <p className="text-xs text-[#777]">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {/* FILTER BUTTON & DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleFilter}
              aria-expanded={isFilterVisible}
              className="flex items-center gap-2 rounded-xl border border-[#D5CCC4] bg-[#FCFAF8] px-4 py-2.5 text-xs font-semibold text-[#3A2528] shadow-sm transition hover:border-[#C78B7B] hover:bg-white"
            >
              <SlidersHorizontal size={15} className="text-[#C78B7B]" />
              <span>Filter Collections</span>
              {currentCollection && (
                <span className="rounded-full bg-[#C78B7B] px-2 py-0.5 text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </button>

            {/* FILTER DROPDOWN / MODAL */}
            {isFilterMounted && (
              <>
                <div
                  className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-280 ease-out ${
                    isFilterVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={closeFilter}
                />
                <div
                  data-scrollable="true"
                  className={`fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-[#E8E0DB] bg-white p-4 shadow-2xl transition-all duration-280 ease-out sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:translate-y-0 sm:p-3 ${
                    isFilterVisible
                      ? "translate-x-0 opacity-100 scale-100"
                      : "translate-x-full opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#F3ECE7] pb-3 px-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#252525]">
                      Select Collection
                    </span>
                    <button
                      type="button"
                      onClick={closeFilter}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#505655] transition hover:bg-[#F5F1EF] hover:text-[#252525]"
                      aria-label="Close filter"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div
                    data-scrollable="true"
                    className="mt-3 max-h-[65dvh] space-y-1.5 overflow-y-auto overscroll-contain touch-pan-y pr-1"
                  >
                    {/* ALL COLLECTIONS */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentCollection("");
                        closeFilter();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition ${
                        !currentCollection
                          ? "bg-[#3A2528] font-semibold text-white shadow-sm"
                          : "text-[#4A403D] hover:bg-[#F8F3EF]"
                      }`}
                    >
                      <span>✨ All Collections</span>
                      {!currentCollection && <Check size={15} />}
                    </button>

                    {/* LIVE COLLECTIONS */}
                    {dbCollections.map((col: any) => {
                      const isSelected =
                        currentCollection.toLowerCase() === String(col.name).toLowerCase();

                      return (
                        <button
                          key={col._id || col.name}
                          type="button"
                          onClick={() => {
                            setCurrentCollection(col.name);
                            closeFilter();
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition ${
                            isSelected
                              ? "bg-[#3A2528] font-semibold text-white shadow-sm"
                              : "text-[#4A403D] hover:bg-[#F8F3EF]"
                          }`}
                        >
                          <span>👑 {col.name}</span>
                          {isSelected && <Check size={15} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          COLLECTION PRODUCTS
      ========================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Loading */}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-lg bg-[#EEE8E3]"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (

            /* Products */

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {filteredProducts.map(
                (product: any) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      badge:
                        product.featured
                          ? "Featured"
                          : product.badge ||
                            "",
                    }}
                  />
                )
              )}
            </div>

          ) : (

            /* Empty State */

            <div className="py-20 text-center">
              <h2 className="text-3xl font-bold text-[#2E2E2E]">
                No Products Found
              </h2>

              <p className="mt-2 text-gray-500">
                No products available in this
                collection.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          TRENDING THIS SEASON
      ========================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <h2 className="mb-12 text-center font-serif text-4xl text-[#2E2E2E]">
            Trending This Season
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              {
                trend:
                  "Layered Necklaces",
                description:
                  "Mix and match delicate chains for a sophisticated look",
                icon: "✨",
              },
              {
                trend:
                  "Statement Rings",
                description:
                  "Bold and beautiful rings that make a statement",
                icon: "💎",
              },
              {
                trend:
                  "Stacked Bracelets",
                description:
                  "Combine our bracelet styles for a personalized aesthetic",
                icon: "🌟",
              },
            ].map((trend) => (
              <div
                key={trend.trend}
                className="rounded-lg border border-[#E8E3DC] bg-white p-8 text-center"
              >
                <div className="mb-4 text-5xl">
                  {trend.icon}
                </div>

                <h3 className="mb-3 font-serif text-2xl text-[#2E2E2E]">
                  {trend.trend}
                </h3>

                <p className="mb-6 text-[#6B6B6B]">
                  {trend.description}
                </p>

                <a
                  href="/shop"
                  className="font-semibold text-[#C78B7B] transition-colors hover:text-[#B5776B]"
                >
                  Explore →
                </a>
              </div>
            ))}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ======================================================
// Collections Page
// Suspense Boundary for useSearchParams()
// ======================================================

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FCFAF7]">
          <Navbar />

          <section className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

              <p className="mt-5 text-sm text-[#777]">
                Loading collections...
              </p>
            </div>
          </section>

          <Footer />
        </main>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}