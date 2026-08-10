"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import Footer from "@/components/footer";

import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // ==============================
  // Total Items
  // ==============================
  const totalItems = cart.reduce(
    (sum: number, item: any) =>
      sum + Number(item.quantity || 0),
    0
  );

  // ==============================
  // Cart Total
  // ==============================
  const total = cart.reduce(
    (sum: number, item: any) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <>
      <main className="min-h-screen bg-[#FCFAF7] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* =========================
              PAGE HEADING
          ========================= */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
              Shopping Cart
            </h1>

            {cart.length > 0 && (
              <p className="mt-2 text-sm text-[#777]">
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"}
              </p>
            )}
          </div>

          {/* =========================
              EMPTY CART
          ========================= */}
          {cart.length === 0 ? (
            <div className="border border-[#E8DFD9] bg-white px-6 py-20 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F1EC] text-3xl">
                🛍️
              </div>

              <h2 className="mb-3 font-serif text-3xl text-[#2E2E2E]">
                Your Cart is Empty
              </h2>

              <p className="mb-7 text-sm text-[#777]">
                Looks like you haven't added anything yet.
              </p>

              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center bg-[#3A2528] px-8 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">

              {/* =========================
                  CART ITEMS
              ========================= */}
              <div className="space-y-4">

                {cart.map((item: any) => {
                  const variantKey = `${item._id}-${item.color || ""}-${item.size || ""}`;

                  return (
                    <div
                      key={variantKey}
                      className="relative flex min-h-[118px] items-center gap-4 border border-[#E8DFD9] bg-white p-4 sm:gap-5"
                    >

                      {/* =========================
                          PRODUCT IMAGE
                      ========================= */}
                      <Link
                        href={`/shop/${item._id}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#FAF7F4] sm:h-28 sm:w-28"
                      >
                        <Image
                          src={
                            item.image ||
                            "/placeholder.png"
                          }
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      </Link>

                      {/* =========================
                          PRODUCT DETAILS
                      ========================= */}
                      <div className="min-w-0 flex-1 pr-6">

                        <Link
                          href={`/shop/${item._id}`}
                          className="font-serif text-lg text-[#2E2E2E] transition hover:text-[#C78B7B] sm:text-xl"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-1 text-xs text-[#888] sm:text-sm">
                          Premium Artificial Jewellery
                        </p>

                        {/* =========================
                            COLOR + SIZE
                        ========================= */}
                        {(item.color || item.size) && (
                          <div className="mt-3 flex flex-wrap gap-2">

                            {item.color && (
                              <span className="inline-flex items-center gap-1 border border-[#E4DCD6] bg-[#FCFAF7] px-2.5 py-1 text-xs text-[#555]">
                                <span className="font-medium">
                                  Color:
                                </span>
                                <span>
                                  {item.color}
                                </span>
                              </span>
                            )}

                            {item.size && (
                              <span className="inline-flex items-center gap-1 border border-[#E4DCD6] bg-[#FCFAF7] px-2.5 py-1 text-xs text-[#555]">
                                <span className="font-medium">
                                  Size:
                                </span>
                                <span>
                                  {item.size}
                                </span>
                              </span>
                            )}

                          </div>
                        )}

                        {/* =========================
                            MOBILE PRICE
                        ========================= */}
                        <div className="mt-3 sm:hidden">
                          <span className="text-lg font-semibold text-[#2E2E2E]">
                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>

                      </div>

                      {/* =========================
                          DESKTOP PRICE
                      ========================= */}
                      <div className="hidden shrink-0 sm:block">
                        <span className="text-lg font-semibold text-[#2E2E2E]">
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* =========================
                          QUANTITY
                      ========================= */}
                      <div className="flex shrink-0 items-center border border-[#E1D8D2]">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item._id,
                              item.color,
                              item.size
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center text-lg text-[#3A2528] transition hover:bg-[#F5EFEB]"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="flex h-8 w-8 items-center justify-center border-x border-[#E1D8D2] text-sm font-medium">
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
                          className="flex h-8 w-8 items-center justify-center text-lg text-[#3A2528] transition hover:bg-[#F5EFEB]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>

                      </div>

                      {/* =========================
                          DELETE
                      ========================= */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item._id,
                            item.color,
                            item.size
                          )
                        }
                        className="absolute right-3 top-3 text-[#AAA] transition hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2
                          size={17}
                          strokeWidth={1.7}
                        />
                      </button>

                    </div>
                  );
                })}

              </div>

              {/* =========================
                  ORDER SUMMARY
              ========================= */}
              <aside className="lg:sticky lg:top-24">

                <div className="border border-[#E8DFD9] bg-white p-6">

                  <h2 className="mb-6 font-serif text-2xl text-[#2E2E2E]">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-[#555]">
                      Items
                    </span>

                    <span className="text-[#2E2E2E]">
                      {totalItems}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-[#555]">
                      Subtotal
                    </span>

                    <span className="text-[#2E2E2E]">
                      ₹
                      {total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="mb-5 flex items-center justify-between text-sm">
                    <span className="text-[#555]">
                      Shipping
                    </span>

                    <span className="font-semibold text-green-600">
                      FREE
                    </span>
                  </div>

                  <div className="border-t border-[#E5DDD7] pt-5">

                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xl font-semibold text-[#2E2E2E]">
                        Total
                      </span>

                      <span className="text-xl font-semibold text-[#2E2E2E]">
                        ₹
                        {total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      href="/checkout"
                      className="flex h-11 w-full items-center justify-center bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B]"
                    >
                      Proceed to Checkout
                    </Link>

                  </div>

                </div>

              </aside>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}