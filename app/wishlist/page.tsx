"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Heart,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Toast from "@/components/toast";

import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

type ToastState = {
  message: string;
  type: "success" | "error";
};

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [addingProductId, setAddingProductId] =
    useState<string | null>(null);

  const [toast, setToast] =
    useState<ToastState | null>(null);

  // ==========================================
  // AUTO HIDE TOAST
  // ==========================================

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (
    item: any
  ) => {
    if (addingProductId) return;

    try {
      setAddingProductId(item._id);

      addToCart({
        _id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        stock: item.stock ?? 1,
        quantity: 1,
      });

      setToast({
        type: "success",
        message: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error(
        "Wishlist add to cart error:",
        error
      );

      setToast({
        type: "error",
        message:
          "We couldn't add this item to your cart. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setAddingProductId(null);
      }, 700);
    }
  };

  // ==========================================
  // REMOVE WISHLIST ITEM
  // ==========================================

  const handleRemove = (
    productId: string,
    productName: string
  ) => {
    removeFromWishlist(productId);

    setToast({
      type: "success",
      message: `${productName} was removed from your wishlist.`,
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFAF7] py-8">

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6">

          {/* ====================================
              HEADING
          ==================================== */}

          <div className="mb-7">

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
              Your Collection
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-[#777]">
              Save your favourite jewellery and
              purchase anytime.
            </p>

            {wishlist.length > 0 && (
              <p className="mt-2 text-xs text-[#9A8C86]">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "piece"
                  : "pieces"}{" "}
                saved
              </p>
            )}

          </div>

          {/* ====================================
              EMPTY WISHLIST
          ==================================== */}

          {wishlist.length === 0 ? (

            <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white">

              <div className="flex min-h-[460px] flex-col items-center justify-center px-6 py-20 text-center">

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F8F1EC]">

                  <Heart
                    className="text-[#C78B7B]"
                    size={42}
                    strokeWidth={1.5}
                  />

                </div>

                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Your favourites
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                  Your Wishlist is Empty
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#777]">
                  Save the jewellery pieces you
                  love and come back to them
                  whenever you're ready.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] px-8 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98]"
                >
                  Explore Jewellery

                  <ShoppingBag size={16} />
                </Link>

              </div>

            </div>

          ) : (

            /* ====================================
               WISHLIST GRID
            ==================================== */

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {wishlist.map((item) => {

                const isAdding =
                  addingProductId ===
                  item._id;

                return (
                  <div
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* =========================
                        IMAGE
                    ========================= */}

                    <div className="relative aspect-square overflow-hidden bg-[#FAF7F4]">

                      <Link
                        href={`/shop/${item._id}`}
                        aria-label={`View ${item.name}`}
                        className="absolute inset-0 z-0"
                      >
                        <Image
                          src={
                            item.image ||
                            "/placeholder.png"
                          }
                          alt={item.name}
                          fill
                          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Wishlist Heart */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item._id,
                            item.name
                          )
                        }
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 hover:bg-[#FFF8F6]"
                      >
                        <Heart
                          className="fill-red-500 text-red-500"
                          size={16}
                        />
                      </button>

                    </div>

                    {/* =========================
                        DETAILS
                    ========================= */}

                    <div className="p-3 sm:p-4">

                      <Link
                        href={`/shop/${item._id}`}
                        className="block"
                      >

                        <h2 className="line-clamp-2 min-h-[40px] font-serif text-base leading-5 text-[#2E2E2E] transition hover:text-[#C78B7B] sm:text-lg">
                          {item.name}
                        </h2>

                      </Link>

                      {/* Rating */}

                      <div
                        className="mt-1.5 flex items-center gap-1 text-xs text-[#777]"
                        aria-label="Product rating 4.5 out of 5"
                      >
                        <span
                          className="text-[#C96B4B]"
                          aria-hidden="true"
                        >
                          ★
                        </span>

                        <span>
                          4.5
                        </span>

                        <span className="text-[#AAA]">
                          ·
                        </span>

                        <span>
                          Customer favourite
                        </span>
                      </div>

                      {/* Price */}

                      <p className="mt-2 font-serif text-base font-bold text-[#2E2E2E] sm:text-lg">
                        {formatPrice(item.price || 0)}
                      </p>

                      {/* Add To Cart */}

                      <button
                        type="button"
                        disabled={isAdding}
                        onClick={() =>
                          handleAddToCart(
                            item
                          )
                        }
                        aria-label={
                          isAdding
                            ? `Adding ${item.name} to cart`
                            : `Add ${item.name} to cart`
                        }
                        className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#1F1F1F] text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#CB8161] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:text-xs"
                      >

                        {isAdding ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingBag
                              size={15}
                            />

                            Add to Cart
                          </>
                        )}

                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </main>

      <Footer />

      {/* ========================================
          TOAST
      ======================================== */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}

    </>
  );
}