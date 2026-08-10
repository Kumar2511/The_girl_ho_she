"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  QrCode,
} from "lucide-react";

// ==========================================
// Filter Option
// ==========================================

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// ==========================================
// Filter Values
// ==========================================

export interface FilterSidebarValues {
  categories: string[];
  collections: string[];
  priceRange: [number, number];
  productTypes: string[];
  materials: string[];
  colors: string[];
  availability: string[];

  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  discount: boolean;
}

// ==========================================
// Props
// ==========================================

export interface FilterSidebarProps {
  categories?: FilterOption[];
  collections?: FilterOption[];
  productTypes?: FilterOption[];
  materials?: FilterOption[];
  colors?: FilterOption[];
  availability?: FilterOption[];

  values?: FilterSidebarValues;

  minPrice?: number;
  maxPrice?: number;

  setMinPrice?: (value: number) => void;
  setMaxPrice?: (value: number) => void;

  inStockOnly?: boolean;
  setInStockOnly?: (value: boolean) => void;

  onChange?: (
    values: FilterSidebarValues
  ) => void;

  onClear?: () => void;

  priceRange?: {
    min: number;
    max: number;
    step: number;
  };

  compact?: boolean;
}

// ==========================================
// Component
// ==========================================

export function FilterSidebar({
  values,
  onChange,
  onClear,
  priceRange = {
    min: 0,
    max: 10000,
    step: 100,
  },
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
}: FilterSidebarProps) {
  const router = useRouter();

  // ========================================
  // Find Product
  // ========================================

  const [showFindProduct, setShowFindProduct] =
    useState(false);

  const [productLink, setProductLink] =
    useState("");

  const [findError, setFindError] =
    useState("");

  // ========================================
  // Find Product
  // ========================================

  const handleFindProduct = () => {
    setFindError("");

    const value = productLink.trim();

    if (!value) {
      setFindError(
        "Please paste a product link."
      );
      return;
    }

    try {
      let productId = "";

      // ====================================
      // Full URL
      // ====================================

      if (
        value.startsWith("http://") ||
        value.startsWith("https://")
      ) {
        const url = new URL(value);

        const parts = url.pathname
          .split("/")
          .filter(Boolean);

        /*
          Expected product URL:

          /shop/PRODUCT_ID
        */

        if (
          parts.length >= 2 &&
          parts[0] === "shop"
        ) {
          productId =
            parts[parts.length - 1];
        }
      }

      // ====================================
      // Relative URL
      // ====================================

      else if (
        value.startsWith("/shop/")
      ) {
        productId =
          value
            .split("/")
            .filter(Boolean)
            .pop() || "";
      }

      // ====================================
      // Direct Product ID
      // ====================================

      else {
        productId = value;
      }

      if (!productId) {
        setFindError(
          "We couldn't find a product in this link."
        );
        return;
      }

      // ====================================
      // Open Product
      // ====================================

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

  // ========================================
  // New Filter System
  // ========================================

  if (values && onChange) {
    const currentMin =
      values.priceRange[0];

    const currentMax =
      values.priceRange[1];

    const minPercent =
      ((currentMin - priceRange.min) /
        (priceRange.max -
          priceRange.min)) *
      100;

    const maxPercent =
      ((currentMax - priceRange.min) /
        (priceRange.max -
          priceRange.min)) *
      100;

    const updatePriceMin = (
      value: number
    ) => {
      if (value <= currentMax) {
        onChange({
          ...values,
          priceRange: [
            value,
            currentMax,
          ],
        });
      }
    };

    const updatePriceMax = (
      value: number
    ) => {
      if (value >= currentMin) {
        onChange({
          ...values,
          priceRange: [
            currentMin,
            value,
          ],
        });
      }
    };

    return (
      <>
        <div className="flex flex-col gap-6">

          {/* =================================
              Price Range
          ================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <SlidersHorizontal
                  size={14}
                  className="text-[#C78B7B]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#555]">
                  Price Range
                </span>

              </div>

              <span className="text-[10px] text-[#777]">
                ₹
                {currentMin.toLocaleString(
                  "en-IN"
                )}
                {" - "}
                ₹
                {currentMax.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Slider */}

            <div className="relative h-6">

              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#E7DED9]" />

              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#8D4E67]"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`,
                }}
              />

              {/* Minimum */}

              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={priceRange.step}
                value={currentMin}
                onChange={(e) =>
                  updatePriceMin(
                    Number(
                      e.target.value
                    )
                  )
                }
                aria-label="Minimum price"
                className="pointer-events-none absolute inset-0 z-20 h-6 w-full appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:bg-[#8D4E67]
                [&::-webkit-slider-thumb]:shadow-md"
              />

              {/* Maximum */}

              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={priceRange.step}
                value={currentMax}
                onChange={(e) =>
                  updatePriceMax(
                    Number(
                      e.target.value
                    )
                  )
                }
                aria-label="Maximum price"
                className="pointer-events-none absolute inset-0 z-10 h-6 w-full appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:bg-[#C78B7B]
                [&::-webkit-slider-thumb]:shadow-md"
              />

            </div>

            <div className="flex justify-between text-[9px] text-[#888]">

              <span>
                ₹
                {priceRange.min.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span>
                ₹
                {priceRange.max.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

          {/* =================================
              Availability
          ================================== */}

          <label className="flex cursor-pointer items-center gap-2.5 border-t border-[#E8E0DB] pt-4">

            <input
              type="checkbox"
              checked={
                values.availability.includes(
                  "instock"
                )
              }
              onChange={(e) => {

                const checked =
                  e.target.checked;

                onChange({
                  ...values,
                  availability:
                    checked
                      ? ["instock"]
                      : [],
                });

              }}
              className="h-4 w-4 cursor-pointer accent-[#8D4E67]"
            />

            <span className="text-xs text-[#555]">
              In Stock Only
            </span>

          </label>

          {/* =================================
              Find This Product
          ================================== */}

          <div className="border-t border-[#E8E0DB] pt-5">

            <button
              type="button"
              onClick={() => {
                setShowFindProduct(true);
                setFindError("");
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-[#E8DDD8]
                bg-[#FCF8F5]
                px-4
                py-3
                text-left
                transition
                hover:border-[#C78B7B]
                hover:bg-[#F9F1ED]
              "
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3A2528] text-white">

                <Search size={16} />

              </div>

              <div>

               <p className="text-base font-bold text-red-500">
  FIND THIS PRODUCT TEST
</p>

                <p className="mt-0.5 text-[10px] text-[#777]">
                  Found it on Instagram?
                </p>

              </div>

            </button>

          </div>

          {/* =================================
              Clear Filters
          ================================== */}

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-left text-xs font-medium text-[#8D4E67] hover:underline"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* =================================
            Find Product Modal
        ================================== */}

        {showFindProduct && (
          <div
            className="
              fixed
              inset-0
              z-[9999]
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
                max-w-md
                rounded-2xl
                bg-white
                p-6
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
                  right-4
                  top-4
                  rounded-full
                  p-2
                  text-gray-500
                  hover:bg-gray-100
                "
              >
                <X size={18} />
              </button>

              {/* Heading */}

              <div className="pr-8">

                <h2 className="font-serif text-2xl text-[#2E2024]">
                  Find This Product
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Found a jewellery product
                  on Instagram? Use one of
                  the options below.
                </p>

              </div>

              {/* =================================
                  Link Search
              ================================== */}

              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2">

                  <LinkIcon
                    size={16}
                    className="text-[#C78B7B]"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#555]">
                    Product Link
                  </span>

                </div>

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
                  placeholder="/shop/product-id"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E5DDD8]
                    px-4
                    text-sm
                    text-[#2E2024]
                    outline-none
                    focus:border-[#C78B7B]
                  "
                />

                {findError && (
                  <p className="mt-2 text-xs text-red-500">
                    {findError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={
                    handleFindProduct
                  }
                  className="
                    mt-3
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#3A2528]
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#29181B]
                  "
                >
                  <Search size={16} />
                  Find Product
                </button>

              </div>

              {/* =================================
                  Future Search Methods
              ================================== */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  disabled
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-[#DDD2CC]
                    p-4
                    text-center
                    opacity-60
                  "
                >

                  <ImageIcon
                    size={20}
                    className="mx-auto text-[#8D4E67]"
                  />

                  <p className="mt-2 text-xs font-semibold text-[#2E2024]">
                    Upload Screenshot
                  </p>

                  <p className="mt-1 text-[9px] text-gray-500">
                    Coming next
                  </p>

                </button>

                <button
                  type="button"
                  disabled
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-[#DDD2CC]
                    p-4
                    text-center
                    opacity-60
                  "
                >

                  <QrCode
                    size={20}
                    className="mx-auto text-[#8D4E67]"
                  />

                  <p className="mt-2 text-xs font-semibold text-[#2E2024]">
                    Scan QR Code
                  </p>

                  <p className="mt-1 text-[9px] text-gray-500">
                    Coming next
                  </p>

                </button>

              </div>

            </div>

          </div>
        )}

      </>
    );
  }

  // ========================================
  // Legacy Price Filter
  // ========================================

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    setMinPrice &&
    setMaxPrice
  ) {
    const MAX_PRICE = 10000;

    const minPercent =
      (minPrice / MAX_PRICE) * 100;

    const maxPercent =
      (maxPrice / MAX_PRICE) * 100;

    return (
      <div className="flex flex-col gap-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={14}
              className="text-[#C78B7B]"
            />

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#555]">
              Price Range
            </p>

          </div>

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

        <div className="relative h-6">

          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#E7DED9]" />

          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#8D4E67]"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={100}
            value={minPrice}
            onChange={(e) => {
              const value =
                Number(
                  e.target.value
                );

              if (value <= maxPrice) {
                setMinPrice(value);
              }
            }}
            aria-label="Minimum price"
            className="pointer-events-none absolute inset-0 z-20 h-6 w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:bg-[#8D4E67]"
          />

          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={100}
            value={maxPrice}
            onChange={(e) => {
              const value =
                Number(
                  e.target.value
                );

              if (value >= minPrice) {
                setMaxPrice(value);
              }
            }}
            aria-label="Maximum price"
            className="pointer-events-none absolute inset-0 z-10 h-6 w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:bg-[#C78B7B]"
          />

        </div>

        <div className="flex justify-between text-[9px] text-[#888]">

          <span>₹0</span>

          <span>
            ₹
            {MAX_PRICE.toLocaleString(
              "en-IN"
            )}
          </span>

        </div>

        {setInStockOnly && (
          <div className="mt-5 border-t border-[#E8E0DB] pt-4">

            <label className="flex cursor-pointer items-center gap-2.5">

              <input
                type="checkbox"
                checked={
                  inStockOnly ?? false
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

          </div>
        )}

      </div>
    );
  }

  return null;
}

export default FilterSidebar;