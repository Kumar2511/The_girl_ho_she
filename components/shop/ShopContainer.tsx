"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Link as LinkIcon } from "lucide-react";

import api from "@/lib/api";

import ShopPage from "./ShopPage";
import ProductCard from "./ProductCard";

import type {
  FilterSidebarValues,
  FilterOption,
} from "./FilterSidebar";

export default function ShopContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const search = searchParams.get("search");

  // ==========================
  // Loading
  // ==========================

  const [loading, setLoading] = useState(false);

  // ==========================
  // Products
  // ==========================

  const [products, setProducts] = useState<any[]>([]);

  // ==========================
  // Sorting
  // ==========================

  const [sortBy, setSortBy] = useState("newest");

  // ==========================
  // Mobile Filters
  // ==========================

  const [showFilters, setShowFilters] = useState(false);

  // ==========================
  // Find Product Modal
  // ==========================

  const [showFindProduct, setShowFindProduct] = useState(false);
  const [productLink, setProductLink] = useState("");
  const [findError, setFindError] = useState("");

  // ==========================
  // Filter Values
  // ==========================

  const [filterValues, setFilterValues] =
    useState<FilterSidebarValues>({
      categories: [],
      collections: [],
      priceRange: [0, 10000],
      productTypes: [],
      materials: [],
      colors: [],
      availability: [],
      featured: false,
      trending: false,
      bestSeller: false,
      newArrival: false,
      discount: false,
    });

  // ==========================
  // Filter Options
  // ==========================

  const [categories, setCategories] =
    useState<FilterOption[]>([]);

  const [collections, setCollections] =
    useState<FilterOption[]>([]);

  const [productTypes, setProductTypes] =
    useState<FilterOption[]>([]);

  const [materials, setMaterials] =
    useState<FilterOption[]>([]);

  const [colors, setColors] =
    useState<FilterOption[]>([]);

  const [availability] =
    useState<FilterOption[]>([
      {
        label: "In Stock",
        value: "instock",
      },
    ]);

  // ==========================
  // Fetch Products
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: {
          search,
          category: selectedCategory,
          sort: sortBy,
        },
      });

      console.log(response.data.products);

      const data = response.data.products.map(
        (product: any) => ({
          id: product._id,

          name: product.name,

          image:
            product.images?.length > 0
              ? product.images[0]
              : "/hero-jewelry.png",

          imageAlt: product.name,

          price: product.price,

          discountPrice:
            product.discountPrice,

          currency: "INR",

          rating: 4.8,

          reviewCount: 125,

          isBestseller:
            product.bestSeller,

          isNew:
            product.newArrival,

          subtitle:
            product.category,

          stock:
            product.stock,

          category:
            product.category,

          featured:
            product.featured,

          trending:
            product.trending,
        })
      );

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    search,
    selectedCategory,
    sortBy,
  ]);

  // ==========================
  // Filter Options
  // ==========================

  useEffect(() => {
    const categoryMap =
      new Map<string, number>();

    products.forEach(
      (product: any) => {
        if (
          !categoryMap.has(
            product.category
          )
        ) {
          categoryMap.set(
            product.category,
            1
          );
        } else {
          categoryMap.set(
            product.category,
            categoryMap.get(
              product.category
            )! + 1
          );
        }
      }
    );

    const categoryOptions:
      FilterOption[] =
      Array.from(categoryMap).map(
        ([label, count]) => ({
          label,
          value: label,
          count,
        })
      );

    setCategories(categoryOptions);

    setCollections([]);
    setProductTypes([]);
    setMaterials([]);
    setColors([]);
  }, [products]);

  // ==========================
  // Handle Sidebar Changes
  // ==========================

  const handleFilterChange = (
    values: FilterSidebarValues
  ) => {
    setFilterValues(values);
  };

  // ==========================
  // Clear Filters
  // ==========================

  const clearFilters = () => {
    setFilterValues({
      categories: [],
      collections: [],
      priceRange: [0, 10000],
      productTypes: [],
      materials: [],
      colors: [],
      availability: [],
      featured: false,
      trending: false,
      bestSeller: false,
      newArrival: false,
      discount: false,
    });
  };

  // ==========================
  // Filter Products
  // ==========================

  const filteredProducts =
    products.filter(
      (product: any) => {

        // Category
        if (
          filterValues.categories
            .length > 0 &&
          !filterValues.categories.includes(
            product.category
          )
        ) {
          return false;
        }

        // Price
        if (
          product.price <
            filterValues.priceRange[0] ||
          product.price >
            filterValues.priceRange[1]
        ) {
          return false;
        }

        // Bestseller
        if (
          filterValues.bestSeller &&
          !product.isBestseller
        ) {
          return false;
        }

        // Trending
        if (
          filterValues.trending &&
          !product.trending
        ) {
          return false;
        }

        // Featured
        if (
          filterValues.featured &&
          !product.featured
        ) {
          return false;
        }

        // New Arrival
        if (
          filterValues.newArrival &&
          !product.isNew
        ) {
          return false;
        }

        return true;
      }
    );

  // ==========================
  // Find Product
  // ==========================

  const handleFindProduct = () => {
    setFindError("");

    const value =
      productLink.trim();

    if (!value) {
      setFindError(
        "Please paste a product link."
      );
      return;
    }

    try {
      let productId = "";

      // Full URL
      if (
        value.startsWith("http://") ||
        value.startsWith("https://")
      ) {
        const url =
          new URL(value);

        const parts =
          url.pathname
            .split("/")
            .filter(Boolean);

        // Expected:
        // /shop/productId
        if (
          parts.length >= 2 &&
          parts[0] === "shop"
        ) {
          productId =
            parts[parts.length - 1];
        }
      }

      // Relative URL
      else if (
        value.startsWith("/shop/")
      ) {
        productId =
          value
            .split("/")
            .filter(Boolean)
            .pop() || "";
      }

      // Direct product ID
      else {
        productId = value;
      }

      if (!productId) {
        setFindError(
          "We couldn't find a product ID in that link."
        );
        return;
      }

      setShowFindProduct(false);
      setProductLink("");

      router.push(
        `/shop/${productId}`
      );
    } catch (error) {
      console.error(
        "Find Product Error:",
        error
      );

      setFindError(
        "Please enter a valid product link."
      );
    }
  };

  // ==========================
  // Render
  // ==========================

  return (
    <>
      {/* =================================
          Find Product Button
      ================================== */}

      <div className="mx-auto max-w-[1450px] px-5 pt-6 lg:px-10">
        <button
          type="button"
          onClick={() =>
            setShowFindProduct(true)
          }
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-[#E5DDD8]
            bg-[#FAF8F6]
            px-5
            py-2.5
            text-sm
            font-medium
            text-[#2E2024]
            transition
            hover:border-[#C78B7B]
            hover:text-[#C78B7B]
          "
        >
          <Search size={17} />

          Can't find your product?
        </button>
      </div>

      {/* =================================
          Find Product Modal
      ================================== */}

      {showFindProduct && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            px-5
          "
          onClick={() =>
            setShowFindProduct(false)
          }
        >
          <div
            className="
              relative
              w-full
              max-w-lg
              rounded-2xl
              bg-white
              p-7
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setShowFindProduct(false)
              }
              className="
                absolute
                right-5
                top-5
                rounded-full
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <X size={20} />
            </button>

            {/* Heading */}

            <div className="pr-8">
              <h2 className="font-serif text-3xl text-[#2E2024]">
                Find Your Product
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Found something you love on
                Instagram? Paste its product
                link here and we'll take you
                directly to it.
              </p>
            </div>

            {/* Input */}

            <div className="mt-7">
              <label className="mb-2 block text-sm font-medium text-[#2E2024]">
                Product / Instagram Link
              </label>

              <div className="relative">
                <LinkIcon
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={productLink}
                  onChange={(e) => {
                    setProductLink(
                      e.target.value
                    );
                    setFindError("");
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleFindProduct();
                    }
                  }}
                  placeholder="https://mahalaksmi.com/shop/..."
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#E5DDD8]
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-[#2E2024]
                    outline-none
                    transition
                    focus:border-[#C78B7B]
                  "
                />
              </div>

              {findError && (
                <p className="mt-2 text-sm text-red-500">
                  {findError}
                </p>
              )}
            </div>

            {/* Button */}

            <button
              type="button"
              onClick={
                handleFindProduct
              }
              className="
                mt-5
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#2E2024]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#3D292E]
              "
            >
              <Search size={17} />

              Find Product
            </button>

            {/* Future Features */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-dashed border-[#E5DDD8] p-4 text-center">
                <p className="text-sm font-semibold text-[#2E2024]">
                  📷 Screenshot Search
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Coming next
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-[#E5DDD8] p-4 text-center">
                <p className="text-sm font-semibold text-[#2E2024]">
                  📱 QR Scanner
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Coming next
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          Existing Shop
      ================================== */}

      <ShopPage
        products={filteredProducts}
        ProductCard={ProductCard}
        isLoading={loading}
        filterProps={{
          values: filterValues,

          categories,

          collections,

          productTypes,

          materials,

          colors,

          availability,

          priceRange: {
            min: 0,
            max: 10000,
            step: 100,
          },

          onChange:
            handleFilterChange,

          onClear:
            clearFilters,
        }}
        paginationProps={{
          currentPage: 1,
          totalPages: 1,
          onPageChange: () => {},
        }}
      />
    </>
  );
}