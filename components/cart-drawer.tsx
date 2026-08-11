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

import { useCart } from "@/context/cart-context";

export default function CartDrawer() {
  const router = useRouter();

  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

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
    router.push("/checkout");
  };

  return (
    <>
      {/* ======================================
          BACKDROP
      ====================================== */}

      {isCartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={closeCart}
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* ======================================
          DRAWER
      ====================================== */}

      <aside
        className={`fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[430px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E8E0DB] px-5 py-5">

          <div>

            <h2 className="font-serif text-2xl text-[#2E2E2E]">
              Your Cart
            </h2>

            <p className="mt-1 text-xs text-[#817671]">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </p>

          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#F7F2EF]"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>

        </div>

        {/* ====================================
            EMPTY CART
        ==================================== */}

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8EEE9]">
              <ShoppingBag
                size={30}
                className="text-[#C78B7B]"
              />
            </div>

            <h3 className="mt-6 font-serif text-2xl text-[#2E2E2E]">
              Your cart is empty
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-[#817671]">
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
              className="mt-7 rounded-full bg-[#3A2528] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#29181B]"
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

              <div className="space-y-5">

                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                    className="flex gap-4 border-b border-[#EEE7E2] pb-5"
                  >

                    {/* Image */}

                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F6F1EE]">

                      <Image
                        src={
                          item.image ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />

                    </div>

                    {/* Information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#332D2A]">
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
                          className="shrink-0 text-[#999] transition hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>

                      {/* Variant */}

                      {(item.color ||
                        item.size) && (
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#817671]">

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

                      <p className="mt-2 text-sm font-semibold text-[#3A2528]">
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      {/* Quantity */}

                      <div className="mt-3 flex items-center justify-between">

                        <div className="flex h-8 items-center rounded-full border border-[#DDD4CF]">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item._id,
                                item.color,
                                item.size
                              )
                            }
                            className="flex h-full w-8 items-center justify-center rounded-l-full transition hover:bg-[#F7F2EF]"
                          >
                            <Minus
                              size={12}
                            />
                          </button>

                          <span className="w-8 text-center text-xs font-semibold">
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
                            className="flex h-full w-8 items-center justify-center rounded-r-full transition hover:bg-[#F7F2EF]"
                          >
                            <Plus
                              size={12}
                            />
                          </button>

                        </div>

                        <span className="text-sm font-semibold text-[#332D2A]">
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

            <div className="shrink-0 border-t border-[#E8E0DB] bg-[#FCFAF8] px-5 pb-5 pt-4">

              {/* Free Shipping Message */}

              {subtotal > 0 &&
                subtotal < 499 && (
                  <p className="mb-4 rounded-xl bg-[#F5EDE8] px-4 py-3 text-xs leading-5 text-[#795E55]">
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
                <p className="mb-4 rounded-xl bg-[#EDF5E9] px-4 py-3 text-xs font-medium text-[#55734E]">
                  ✓ You qualify for free
                  shipping.
                </p>
              )}

              {/* Subtotal */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-[#6D625E]">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-[#6D625E]">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>

                </div>

                <div className="h-px bg-[#E2DAD5]" />

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-[#302725]">
                    Total
                  </span>

                  <span className="font-serif text-xl font-semibold text-[#302725]">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-5 grid gap-2">

                <button
                  type="button"
                  onClick={
                    handleCheckout
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B]"
                >
                  Checkout

                  <ArrowRight
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  onClick={
                    handleViewCart
                  }
                  className="h-11 rounded-xl border border-[#3A2528] bg-white text-sm font-semibold text-[#3A2528] transition hover:bg-[#F7F2EF]"
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