"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Eye,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  X,
  Zap,
} from "lucide-react";

export interface ProductCardData {
  _id?: string;
  id?: string;

  name: string;
  description?: string;

  category?: string;
  collection?: string;

  price: number;
  discountPrice?: number;

  images?: string[];

  stock?: number;

  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  trending?: boolean;

  averageRating?: number;
  numReviews?: number;

  createdAt?: string;
}

export interface ProductCardProps {
  product: ProductCardData;

  onWishlistChange?: (
    product: ProductCardData,
    wishlisted: boolean
  ) => void;

  onQuickView?: (
    product: ProductCardData
  ) => void;

  onAddToCart?: (
    product: ProductCardData
  ) => void;

  onBuyNow?: (
    product: ProductCardData
  ) => void;
}

// ==========================================
// Price Formatter
// ==========================================

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

// ==========================================
// Rating
// ==========================================

function Rating({
  rating = 0,
  reviewCount = 0,
}: {
  rating?: number;
  reviewCount?: number;
}) {
  const safeRating = Number(rating) || 0;

  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${safeRating.toFixed(
        1
      )} out of 5 stars from ${reviewCount} reviews`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index <
                Math.round(safeRating)
                  ? "fill-[#D6B36A] text-[#D6B36A]"
                  : "text-[#D6B36A]/30"
              }
            />
          )
        )}
      </div>

      <span className="text-xs text-[#777]">
        {safeRating.toFixed(1)}{" "}
        ({reviewCount})
      </span>
    </div>
  );
}

// ==========================================
// Product Card
// ==========================================

export function ProductCard({
  product,
  onWishlistChange,
  onQuickView,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] =
    useState(false);

  const [isQuickViewOpen, setIsQuickViewOpen] =
    useState(false);

  const productId =
    product._id || product.id;

  const image =
    product.images?.[0] ||
    "/placeholder-product.jpg";

  const secondImage =
    product.images?.[1] || image;

  const originalPrice =
    Number(product.price) || 0;

  const salePrice =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) <
      originalPrice
      ? Number(product.discountPrice)
      : originalPrice;

  const hasDiscount =
    salePrice < originalPrice;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((originalPrice -
            salePrice) /
            originalPrice) *
            100
        )
      : 0;

  const stock =
    Number(product.stock) || 0;

  const isOutOfStock =
    stock <= 0;

  const isLowStock =
    stock > 0 && stock <= 5;

  // ========================================
  // Wishlist
  // ========================================

  const toggleWishlist = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const next = !wishlisted;

    setWishlisted(next);

    onWishlistChange?.(
      product,
      next
    );
  };

  // ========================================
  // Quick View
  // ========================================

  const openQuickView = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsQuickViewOpen(true);

    onQuickView?.(product);
  };

  // ========================================
  // Add Cart
  // ========================================

  const handleAddToCart = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    onAddToCart?.(product);
  };

  // ========================================
  // Buy Now
  // ========================================

  const handleBuyNow = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    onBuyNow?.(product);
  };

  return (
    <article className="group flex h-full flex-col">

      {/* ====================================
          Product Image
      ===================================== */}

      <div className="relative aspect-[4/5] overflow-hidden rounded-[25px] bg-[#FCFAF7]">

        <Link
          href={
            productId
              ? `/shop/${productId}`
              : "/shop"
          }
          className="absolute inset-0"
        >

          {/* Main Image */}

          <Image
            src={image}
            alt={
              product.name
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
          />

          {/* Hover Image */}

          <Image
            src={secondImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />

          {/* Luxury Overlay */}

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_40%,rgba(199,139,123,0.12))]" />

        </Link>

        {/* =================================
            Badges
        ================================== */}

        <div className="absolute left-4 top-4 z-10 flex max-w-[75%] flex-wrap gap-2">

          {hasDiscount && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C78B7B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
              <Tag size={12} />
              {discountPercentage}% OFF
            </span>
          )}

          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D6B36A] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2E2E2E] shadow-lg">
              <Sparkles size={12} />
              Bestseller
            </span>
          )}

          {product.newArrival && (
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C78B7B] shadow-lg backdrop-blur-md">
              New
            </span>
          )}

        </div>

        {/* =================================
            Wishlist / Quick View
        ================================== */}

        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">

          <button
            type="button"
            onClick={
              toggleWishlist
            }
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={
              wishlisted
            }
            className="flex size-10 items-center justify-center rounded-full border border-white/65 bg-white/85 text-[#2E2E2E] shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#C78B7B]"
          >
            <Heart
              size={18}
              className={
                wishlisted
                  ? "fill-[#C78B7B] text-[#C78B7B]"
                  : ""
              }
            />
          </button>

          <button
            type="button"
            onClick={
              openQuickView
            }
            aria-label={`Quick view ${product.name}`}
            className="flex size-10 items-center justify-center rounded-full border border-white/65 bg-white/85 text-[#2E2E2E] shadow-lg backdrop-blur-md transition hover:bg-white hover:text-[#C78B7B]"
          >
            <Eye size={18} />
          </button>

        </div>

        {/* =================================
            Stock Status
        ================================== */}

        {isLowStock && (
          <div className="absolute bottom-4 left-4 z-10 rounded-full bg-[#2E2E2E]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
            Only {stock} left
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <span className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#2E2E2E] shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* =================================
            Add To Cart
        ================================== */}

        {!isOutOfStock && (
          <button
            type="button"
            onClick={
              handleAddToCart
            }
            className="absolute bottom-4 left-4 right-4 z-10 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2E2E2E] opacity-0 shadow-xl backdrop-blur-md transition-all duration-500 hover:bg-[#C78B7B] hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBag
              size={16}
            />
            Add to Cart
          </button>
        )}

      </div>

      {/* ====================================
          Product Information
      ===================================== */}

      <div className="flex flex-1 flex-col gap-3 px-2 pb-2 pt-5">

        {/* Collection */}

        {product.collection && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
            {product.collection}
          </p>
        )}

        {/* Product Name */}

        <Link
          href={
            productId
              ? `/shop/${productId}`
              : "/shop"
          }
          className="font-serif text-xl leading-7 text-[#2E2E2E] transition hover:text-[#C78B7B]"
        >
          {product.name}
        </Link>

        {/* Rating */}

        <Rating
          rating={
            product.averageRating
          }
          reviewCount={
            product.numReviews
          }
        />

        {/* Price */}

        <div className="flex items-baseline gap-2">

          <span className="font-serif text-lg font-semibold text-[#2E2E2E]">
            {formatPrice(
              salePrice
            )}
          </span>

          {hasDiscount && (
            <span className="text-sm text-[#2E2E2E]/40 line-through">
              {formatPrice(
                originalPrice
              )}
            </span>
          )}

        </div>

        {/* Buy Now */}

        {!isOutOfStock && (
          <button
            type="button"
            onClick={
              handleBuyNow
            }
            className="mt-auto flex items-center justify-center gap-2 rounded-full border border-[#D6B36A]/60 bg-[#FCFAF7] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2E2E2E] transition-all hover:border-[#C78B7B] hover:bg-[#C78B7B] hover:text-white"
          >
            <Zap size={15} />
            Buy Now
          </button>
        )}

      </div>

      {/* ====================================
          Quick View Modal
      ===================================== */}

      {isQuickViewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
          onClick={() =>
            setIsQuickViewOpen(false)
          }
        >

          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                  Quick View
                </p>

                <h4 className="font-serif text-2xl text-[#2E2E2E]">
                  {product.name}
                </h4>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsQuickViewOpen(
                    false
                  )
                }
                className="flex size-9 items-center justify-center rounded-full bg-[#FCFAF7] text-[#2E2E2E] hover:text-[#C78B7B]"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">

              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#FCFAF7]">

                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />

              </div>

              <div className="flex flex-col">

                <Rating
                  rating={
                    product.averageRating
                  }
                  reviewCount={
                    product.numReviews
                  }
                />

                <p className="mt-4 text-sm leading-6 text-[#2E2E2E]/65">
                  {product.description ||
                    "A beautiful piece from the Mahalaksmi Jewellery collection."}
                </p>

                <div className="mt-5 flex items-baseline gap-2">

                  <span className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {formatPrice(
                      salePrice
                    )}
                  </span>

                  {hasDiscount && (
                    <span className="text-sm text-[#2E2E2E]/40 line-through">
                      {formatPrice(
                        originalPrice
                      )}
                    </span>
                  )}

                </div>

                <p className="mt-3 text-sm text-[#777]">
                  Category:{" "}
                  <span className="font-medium text-[#2E2E2E]">
                    {product.category ||
                      "Jewellery"}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    isOutOfStock
                  }
                  className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#2E2E2E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#C78B7B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag
                    size={16}
                  />
                  {isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </article>
  );
}

export default ProductCard;