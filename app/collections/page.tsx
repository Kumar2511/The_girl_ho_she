"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import api from "@/lib/api";

import Navbar from "@/components/navbar";
import ProductCard from "@/components/shop/ProductCard";
import Footer from "@/components/footer";

// ======================================================
// Collections Content
// ======================================================

function CollectionsContent() {
  const searchParams =
    useSearchParams();

  const selectedCollection =
    searchParams.get("collection");

  const [products, setProducts] =
    useState<any[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts =
    selectedCollection
      ? products.filter(
          (product: any) =>
            product.collection ===
            selectedCollection
        )
      : products;

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="border-b border-[#E8E3DC] bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-5xl text-[#2E2E2E]">
            Collections
          </h1>

          <p className="text-lg text-[#6B6B6B]">
            Curated collections of premium artificial
            jewelry for every style and occasion
          </p>
        </div>
      </section>

      {/* ==========================================
          COLLECTION PRODUCTS
      ========================================== */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Loading */}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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