"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  X,
  Bell,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

interface Product {
  _id: string;
  id?: string;

  name: string;
  category?: string;

  image?: string;
  images?: string[];
  hoverImage?: string;

  price: number;
  discountPrice?: number;
  originalPrice?: number;

  badge?: string;

  averageRating?: number;
  numReviews?: number;

  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [isHovered, setIsHovered] =
    useState(false);

  const [showNotifyModal, setShowNotifyModal] =
    useState(false);

  const [notifyEmail, setNotifyEmail] =
    useState("");

  const [notifyLoading, setNotifyLoading] =
    useState(false);

  const [notifySuccess, setNotifySuccess] =
    useState(false);

  const [notifyError, setNotifyError] =
    useState("");

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  // ======================================
  // Product Data
  // ======================================

  const id =
    product._id || product.id || "";

  const name =
    product.name || "Unnamed Product";

  const category =
    product.category || "Jewellery";

  const image =
    product.image ||
    product.images?.[0] ||
    "/placeholder-product.jpg";

  const hoverImage =
    product.hoverImage ||
    product.images?.[1];

  const price =
    Number(
      product.discountPrice &&
        product.discountPrice > 0
        ? product.discountPrice
        : product.price
    ) || 0;

  const originalPrice =
    Number(
      product.discountPrice &&
        product.discountPrice > 0
        ? product.price
        : product.originalPrice || 0
    ) || 0;

  const averageRating =
    Number(
      product.averageRating ?? 4.8
    );

  const numReviews =
    Number(
      product.numReviews ?? 0
    );

  // ======================================
  // Stock
  // ======================================

  const currentStock =
    Number(product.stock ?? 0);

  const isOutOfStock =
    currentStock <= 0;

  const isLowStock =
    currentStock > 0 &&
    currentStock <= 3;

  // ======================================
  // Wishlist
  // ======================================

  const favorite =
    isInWishlist(id);

  // ======================================
  // Discount
  // ======================================

  const discount =
    originalPrice > price &&
    originalPrice > 0
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;

  // ======================================
  // Add To Cart
  // ======================================

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    addToCart({
      _id: id,
      name,
      image,
      price,
      stock: currentStock,
      quantity: 1,
    });
  };

  // ======================================
  // Open Notify Modal
  // ======================================

  const handleOpenNotify = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setNotifyError("");
    setNotifySuccess(false);

    setShowNotifyModal(true);
  };

  // ======================================
  // Close Notify Modal
  // ======================================

  const handleCloseNotify = () => {
    if (notifyLoading) {
      return;
    }

    setShowNotifyModal(false);
    setNotifyError("");
    setNotifySuccess(false);
  };

  // ======================================
  // Submit Notification Request
  // ======================================

  const handleNotifySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setNotifyError("");
    setNotifySuccess(false);

    const email =
      notifyEmail.trim().toLowerCase();

    // ======================================
    // Email Validation
    // ======================================

    if (!email) {
      setNotifyError(
        "Please enter your email address."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setNotifyError(
        "Please enter a valid email address."
      );
      return;
    }

    // ======================================
    // Product Availability Check
    // ======================================

    if (!isOutOfStock) {
      setNotifyError(
        "This product is already available."
      );
      return;
    }

    try {
      setNotifyLoading(true);

      const response =
        await fetch(
          `${
            process.env
              .NEXT_PUBLIC_API_URL ||
            "http://localhost:5000/api"
          }/stock-notifications`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productId: id,
              email,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to subscribe for notification."
        );
      }

      setNotifySuccess(true);

      setNotifyEmail("");
    } catch (error) {
      console.error(
        "Notify Me Error:",
        error
      );

      setNotifyError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <>
      {/* ======================================
          PRODUCT CARD
      ====================================== */}

      <div className="group overflow-hidden rounded-lg border border-[#E8E3DC] bg-white transition duration-300 hover:shadow-xl">

        {/* ======================================
            IMAGE
        ====================================== */}

        <Link href={`/shop/${id}`}>
          <div
            className="relative aspect-square overflow-hidden bg-[#FAF7F4]"
            onMouseEnter={() =>
              setIsHovered(true)
            }
            onMouseLeave={() =>
              setIsHovered(false)
            }
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width:768px)100vw,25vw"
              className={`object-cover transition-all duration-700 ${
                isOutOfStock
                  ? "grayscale-[35%]"
                  : "group-hover:scale-110"
              }`}
            />

            {/* Hover Image */}

            {hoverImage && (
              <Image
                src={hoverImage}
                alt={name}
                fill
                sizes="(max-width:768px)100vw,25vw"
                className={`absolute inset-0 object-cover transition-opacity duration-300 ${
                  isHovered &&
                  !isOutOfStock
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            )}

            {/* Badge */}

            {product.badge &&
  !isOutOfStock && (
    <span className="absolute left-4 top-4 rounded bg-[#8B4A5A] px-2 py-1 text-xs font-semibold text-white">
      {product.badge}
    </span>
  )}

            {/* Discount */}

            {discount > 0 &&
              !isOutOfStock && (
                <span className="absolute left-4 top-4 rounded bg-[#8B4A5A] px-2 py-1 text-xs font-semibold text-white">
                  -{discount}%
                </span>
              )}

            {/* ======================================
                OUT OF STOCK OVERLAY
            ====================================== */}

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="rounded-md bg-[#3A2528]/95 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Low Stock */}

            {isLowStock && (
              <span className="absolute bottom-4 left-4 rounded-md bg-[#C78B7B] px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                Only {currentStock} left
              </span>
            )}

            {/* Wishlist */}

            <button
              type="button"
              aria-label={
                favorite
                  ? `Remove ${name} from wishlist`
                  : `Add ${name} to wishlist`
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                favorite
                  ? removeFromWishlist(id)
                  : addToWishlist({
                      _id: id,
                      name,
                      image,
                      price,
                    });
              }}
              className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md transition duration-300 hover:scale-110"
            >
              <Heart
                className={`h-4 w-4 ${
                  favorite
                    ? "fill-[#C78B7B] text-[#C78B7B]"
                    : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </Link>

        {/* ======================================
            PRODUCT INFO
        ====================================== */}

        <div className="space-y-3 p-5">

          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#B68C7A]">
            {category}
          </p>

          <Link href={`/shop/${id}`}>
            <h3 className="line-clamp-2 font-serif text-[22px] leading-8 text-[#2E2E2E] transition hover:text-[#C78B7B]">
              {name}
            </h3>
          </Link>

          {/* Rating */}

          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)}
            </span>

            <span className="text-sm text-gray-500">
              ({numReviews})
            </span>
          </div>

          {/* Price */}

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#2E2E2E]">
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </span>

            {originalPrice > price && (
              <span className="text-base text-gray-400 line-through">
                ₹
                {originalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
          </div>

          {/* ======================================
              STOCK STATUS
          ====================================== */}

          <div className="min-h-[20px]">
            {isOutOfStock ? (
              <p className="text-sm font-semibold text-[#8B4A5A]">
                Currently unavailable
              </p>
            ) : isLowStock ? (
              <p className="text-sm font-medium text-[#C78B7B]">
                Hurry! Only{" "}
                {currentStock} left
                in stock
              </p>
            ) : (
              <p className="text-sm font-medium text-green-700">
                In Stock
              </p>
            )}
          </div>

          {/* ======================================
              BUTTON
          ====================================== */}

          <div className="mt-5">

            {isOutOfStock ? (
              <button
                type="button"
                onClick={
                  handleOpenNotify
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#3A2528] bg-white text-sm font-semibold tracking-wide text-[#3A2528] transition-all duration-300 hover:bg-[#3A2528] hover:text-white"
              >
                <Bell className="h-4 w-4" />

                NOTIFY ME WHEN AVAILABLE
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#3A2528] text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#281719]"
              >
                <ShoppingCart className="h-4 w-4" />

                ADD TO CART
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ======================================
          NOTIFY MODAL
      ====================================== */}

      {showNotifyModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleCloseNotify}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`notify-title-${id}`}
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={
                handleCloseNotify
              }
              disabled={notifyLoading}
              aria-label="Close notification dialog"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {!notifySuccess ? (
              <>
                {/* Icon */}

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F8ECE8]">
                  <Bell className="h-5 w-5 text-[#8B4A5A]" />
                </div>

                <h2
                  id={`notify-title-${id}`}
                  className="font-serif text-2xl text-[#2E2E2E]"
                >
                  Notify Me When Available
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  <strong>
                    {name}
                  </strong>{" "}
                  is currently out of
                  stock. Enter your email
                  and we'll let you know
                  when it's available
                  again.
                </p>

                {/* Form */}

                <form
                  onSubmit={
                    handleNotifySubmit
                  }
                  className="mt-6"
                >

                  <label
                    htmlFor={`notify-email-${id}`}
                    className="mb-2 block text-sm font-medium text-[#2E2E2E]"
                  >
                    Email Address
                  </label>

                  <input
                    id={`notify-email-${id}`}
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => {
                      setNotifyEmail(
                        e.target.value
                      );
                      setNotifyError(
                        ""
                      );
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={
                      notifyLoading
                    }
                    className="h-11 w-full rounded-md border border-[#DDD5CF] px-4 text-sm outline-none transition focus:border-[#8B4A5A] focus:ring-2 focus:ring-[#8B4A5A]/10 disabled:bg-gray-100"
                  />

                  {/* Error */}

                  {notifyError && (
                    <p
                      role="alert"
                      className="mt-2 text-sm text-red-600"
                    >
                      {notifyError}
                    </p>
                  )}

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={
                      notifyLoading
                    }
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#281719] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {notifyLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        Notify Me
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-gray-500">
                  We’ll only use your email
                  to send the back-in-stock
                  notification.
                </p>
              </>
            ) : (
              /* ======================================
                 SUCCESS
              ====================================== */

              <div className="py-6 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>

                <h2 className="mt-5 font-serif text-2xl text-[#2E2E2E]">
                  You're on the list!
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
                  We'll send a notification
                  to your email when{" "}
                  <strong>
                    {name}
                  </strong>{" "}
                  is back in stock.
                </p>

                <button
                  type="button"
                  onClick={
                    handleCloseNotify
                  }
                  className="mt-6 h-11 rounded-md bg-[#3A2528] px-7 text-sm font-semibold text-white transition hover:bg-[#281719]"
                >
                  Done
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}