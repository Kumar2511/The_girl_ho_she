"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { useScrollLock } from "@/hooks/useScrollLock";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();

  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    syncCartStock,
  } = useCart();

  const [isCartMounted, setIsCartMounted] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsCartMounted(true);
      if (syncCartStock && addToWishlist) {
        syncCartStock(addToWishlist, showToast);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsCartVisible(true);
        });
      });
    } else {
      setIsCartVisible(false);
      const timer = setTimeout(() => {
        setIsCartMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  useScrollLock(isCartVisible);

  // ==========================================
  // Totals
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  const shipping =
    subtotal >= 499 || subtotal === 0
      ? 0
      : 49;

  const total = subtotal + shipping;

  // ==========================================
  // Navigation
  // ==========================================

  const handleViewCart = () => {
    closeCart();
    router.push("/cart");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    closeCart();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkout_origin", "/cart");
    }

    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirect_after_login", "/checkout");
      }
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  if (!isCartMounted) return null;

  return (
    <>
      {/* ======================================
          BACKDROP
      ====================================== */}

      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`fixed inset-0 z-[255] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ======================================
          DRAWER
      ====================================== */}

      <aside
        data-scrollable="true"
        className={`fixed right-0 top-0 z-[260] flex h-screen w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isCartVisible
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        aria-hidden={!isCartVisible}
      >

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200/80 px-5 py-4">

          <div>

            <h2 className="font-serif text-2xl text-[#1F1F1F]">
              Your Cart
            </h2>

            <p className="mt-0.5 text-xs text-[#666666]">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </p>

          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-neutral-100 hover:text-black"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>

        </div>

        {/* ====================================
            EMPTY CART
        ==================================== */}

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF5F2]">
              <ShoppingBag
                size={28}
                className="text-[#CB8161]"
              />
            </div>

            <h3 className="mt-6 font-serif text-2xl text-[#1F1F1F]">
              Your cart is empty
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-[#666666]">
              Discover something beautiful
              and add your favourite jewellery
              pieces to your cart.
            </p>

            <button
              type="button"
              onClick={() => {
                closeCart();
                router.push("/shop");
              }}
              className="mt-7 rounded-md bg-[#CB8161] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#B56F50] active:scale-[0.98]"
            >
              Continue Shopping
            </button>

          </div>
        ) : (
          <>
            {/* ==================================
                CART ITEMS
            ================================== */}

            <div className="flex-1 overflow-y-auto px-5 py-5">

              <div className="space-y-4">

                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                    className="flex gap-4 border-b border-neutral-100 pb-4"
                  >

                    {/* Image */}

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#FAF7F4] border border-neutral-200/60">

                      <Image
                        src={
                          item.image ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />

                    </div>

                    {/* Information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[#1F1F1F]">
                          {item.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item._id,
                              item.color,
                              item.size
                            )
                          }
                          className="shrink-0 text-gray-400 transition hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>

                      {/* Variant */}

                      {(item.color ||
                        item.size) && (
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#666666]">

                          {item.color && (
                            <span>
                              Color:{" "}
                              {item.color}
                            </span>
                          )}

                          {item.size && (
                            <span>
                              Size:{" "}
                              {item.size}
                            </span>
                          )}

                        </div>
                      )}

                      {/* Price */}

                      <p className="mt-1 text-xs font-semibold text-[#1F1F1F]">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity */}

                      <div className="mt-2.5 flex items-center justify-between">

                        <div className="flex h-7 items-center rounded-md border border-neutral-200">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item._id,
                                item.color,
                                item.size
                              )
                            }
                            className="flex h-full w-7 items-center justify-center rounded-l-md transition hover:bg-neutral-100"
                          >
                            <Minus
                              size={11}
                            />
                          </button>

                          <span className="w-7 text-center text-xs font-semibold text-[#1F1F1F]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item._id,
                                item.color,
                                item.size
                              )
                            }
                            className="flex h-full w-7 items-center justify-center rounded-r-md transition hover:bg-neutral-100"
                          >
                            <Plus
                              size={11}
                            />
                          </button>

                        </div>

                        <span className="text-xs font-bold text-[#1F1F1F]">
                          ₹
                          {(
                            Number(
                              item.price
                            ) *
                            Number(
                              item.quantity
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="shrink-0 border-t border-neutral-200/80 bg-[#FAF8F5] px-5 pb-5 pt-4">

              {/* Free Shipping Message */}

              {subtotal > 0 &&
                subtotal < 499 && (
                  <p className="mb-3.5 rounded-md bg-[#FAF0EA] px-3.5 py-2.5 text-xs text-[#CB8161] font-medium border border-[#CB8161]/20">
                    Add ₹
                    {(
                      499 -
                      subtotal
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}
                    more to get free
                    shipping.
                  </p>
                )}

              {subtotal >= 499 && (
                <p className="mb-3.5 rounded-md bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                  ✓ You qualify for free
                  shipping.
                </p>
              )}

              {/* Subtotal */}

              <div className="space-y-2 text-xs">

                <div className="flex justify-between text-[#666666]">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(subtotal)}
                  </span>

                </div>

                <div className="flex justify-between text-[#666666]">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : formatPrice(shipping)}
                  </span>

                </div>

                <div className="h-px bg-neutral-200/80 my-2" />

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-[#1F1F1F]">
                    Total
                  </span>

                  <span className="font-serif text-lg font-bold text-[#1F1F1F]">
                    {formatPrice(total)}
                  </span>

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-4 grid gap-2">

                <button
                  type="button"
                  onClick={
                    handleCheckout
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#CB8161] active:scale-[0.98]"
                >
                  Checkout

                  <ArrowRight
                    size={15}
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    handleViewCart
                  }
                  className="h-10 rounded-md border border-[#1F1F1F] bg-white text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] transition hover:bg-[#1F1F1F] hover:text-white active:scale-[0.98]"
                >
                  View Cart
                </button>

              </div>

            </div>
          </>
        )}

      </aside>
    </>
  );
}