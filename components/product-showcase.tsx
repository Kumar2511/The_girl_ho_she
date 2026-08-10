"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Eye,
  X,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";

interface ProductShowcaseProps {
  _id: string;
  image: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;

  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  trending?: boolean;

  colors?: string[];
  sizes?: string[];
}

export function ProductShowcase({
  _id,
  image,
  name,
  price,
  discountPrice,
  stock,
  featured,
  bestSeller,
  newArrival,
  trending,
  colors = [],
  sizes = [],
}: ProductShowcaseProps) {
  const [hover, setHover] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const { showToast } = useToast();

  // ============================
  // Final Price
  // ============================

  const finalPrice = discountPrice || price;

  // ============================
  // Discount
  // ============================

  const discount =
    discountPrice && discountPrice < price
      ? Math.round(
          ((price - discountPrice) / price) * 100
        )
      : 0;

  // ============================
  // Product Badge
  // ============================

  let badge = "";

  if (bestSeller) {
    badge = "Best Seller";
  } else if (newArrival) {
    badge = "New Arrival";
  } else if (trending) {
    badge = "Trending";
  } else if (featured) {
    badge = "Featured";
  }

  // ============================
  // Wishlist
  // ============================

  const wishlistActive = isInWishlist(_id);

  // ============================
  // Add To Cart
  // ============================

  const handleAddToCart = () => {
    if (stock <= 0) {
      showToast(
        "This product is out of stock.",
        "error"
      );

      return;
    }

    addToCart({
      _id,
      name,
      image,
      price: finalPrice,
      stock,
      quantity: 1,
      colors,
      sizes,
    });

    showToast(
      "Added to cart successfully!",
      "success"
    );
  };

  // ============================
  // Wishlist
  // ============================

  const handleWishlist = () => {
    if (wishlistActive) {
      removeFromWishlist(_id);

      showToast(
        "Removed from wishlist.",
        "info"
      );

      return;
    }

    addToWishlist({
      _id,
      name,
      image,
      price: finalPrice,
    });

    showToast(
      "Added to wishlist successfully!",
      "success"
    );
  };

  // ============================
  // Quick View
  // ============================

  const handleQuickView = () => {
    setQuickView(true);
  };

  const closeQuickView = () => {
    setQuickView(false);
  };

  return (
    <>
      {/* ============================
          Product Card
      ============================ */}

      <div className="overflow-hidden rounded-lg border border-[#EDE6DF] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

        {/* ============================
            Product Image
        ============================ */}

        <div
          className="relative aspect-square overflow-hidden bg-[#F9F7F4]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={image}
            alt={name}
            className={`h-full w-full object-cover transition-all duration-700 ${
              hover
                ? "scale-110"
                : "scale-100"
            }`}
          />

          {/* Badge */}

          {badge && (
            <span className="absolute left-4 top-4 z-20 rounded-full bg-[#C78B7B] px-4 py-2 text-xs font-semibold text-white shadow-lg">
              {badge}
            </span>
          )}

          {/* Discount */}

          {discount > 0 && (
            <span className="absolute right-4 top-4 z-20 rounded-full bg-[#D6B36A] px-4 py-2 text-xs font-semibold text-white shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Wishlist */}

          <button
            type="button"
            onClick={handleWishlist}
            className="absolute bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110"
            aria-label={
              wishlistActive
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              size={21}
              className={
                wishlistActive
                  ? "fill-[#C78B7B] text-[#C78B7B]"
                  : "text-[#3A2528]"
              }
            />
          </button>

          {/* Out Of Stock */}

          {stock <= 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
              <span className="rounded-full bg-white px-6 py-3 font-semibold text-[#2E2E2E]">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Overlay */}

          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition-all duration-300 ${
              hover
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <div className="flex flex-col gap-3">

              {/* Quick View */}

              <button
                type="button"
                onClick={handleQuickView}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#2E2E2E] shadow-lg transition hover:bg-[#C78B7B] hover:text-white"
              >
                <Eye size={18} />

                Quick View
              </button>

              {/* Full Product */}

              <Link
                href={`/shop/${_id}`}
                className="flex items-center justify-center rounded-full border border-white bg-black/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#2E2E2E]"
              >
                View Details
              </Link>

            </div>
          </div>
        </div>

        {/* ============================
            Product Content
        ============================ */}

        <div className="p-6">

          {/* Product Name */}

          <h3 className="line-clamp-2 font-serif text-2xl leading-snug text-[#2E2E2E]">
            {name}
          </h3>

          {/* Price */}

          <div className="mt-4 flex items-center gap-3">

            <span className="text-2xl font-bold text-[#C78B7B]">
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>

            {discountPrice &&
              discountPrice < price && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              )}

          </div>

          {/* Stock */}

          <p className="mt-3 text-sm text-gray-500">
            {stock > 0
              ? `${stock} pieces available`
              : "Currently unavailable"}
          </p>

          {/* Add To Cart */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold transition-all duration-300 ${
              stock > 0
                ? "bg-[#F4EEE8] text-[#2E2E2E] hover:bg-[#C78B7B] hover:text-white"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <ShoppingCart size={18} />

            {stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

        </div>
      </div>

      {/* ============================
          QUICK VIEW MODAL
      ============================ */}

      {quickView && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeQuickView}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#FCFAF7] shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2E2E2E] shadow-lg transition hover:scale-105 hover:bg-[#C78B7B] hover:text-white"
              aria-label="Close quick view"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2">

              {/* Product Image */}

              <div className="aspect-square bg-[#F4EEE8]">
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Information */}

              <div className="flex flex-col justify-center p-8 md:p-12">

                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Premium Collection
                </span>

                <h2 className="mt-4 font-serif text-3xl text-[#2E2E2E] md:text-4xl">
                  {name}
                </h2>

                {/* Price */}

                <div className="mt-6 flex items-center gap-3">

                  <span className="text-3xl font-bold text-[#C78B7B]">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>

                  {discountPrice &&
                    discountPrice < price && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹{price.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                </div>

                {/* Discount */}

                {discount > 0 && (
                  <p className="mt-3 text-sm font-semibold text-[#8D6E63]">
                    You save{" "}
                    {discount}% on this product
                  </p>
                )}

                {/* Stock */}

                <p className="mt-5 text-sm text-gray-500">
                  {stock > 0
                    ? `${stock} pieces available`
                    : "Currently unavailable"}
                </p>

                {/* Add Cart */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#C78B7B] px-6 py-4 font-semibold text-white transition hover:bg-[#B5776B] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <ShoppingCart size={20} />

                  {stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

                {/* View Full Product */}

                <Link
                  href={`/shop/${_id}`}
                  onClick={closeQuickView}
                  className="mt-4 flex w-full items-center justify-center rounded-full border border-[#D8C8BE] px-6 py-4 font-semibold text-[#2E2E2E] transition hover:border-[#C78B7B] hover:text-[#C78B7B]"
                >
                  View Full Product
                </Link>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}