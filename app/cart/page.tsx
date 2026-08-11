"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Package,
} from "lucide-react";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

import { useCart } from "@/context/cart-context";
import api from "@/lib/api";

type ShippingSettings = {
  freeShippingEnabled: boolean;
  freeShippingMinimum: number;
  shippingCharge: number;
  codCharge: number;
  estimatedDelivery: string;
  deliveryMessage: string;
};

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // ==========================================
  // SHIPPING SETTINGS
  // ==========================================

  const [shippingSettings, setShippingSettings] =
    useState<ShippingSettings>({
      freeShippingEnabled: true,
      freeShippingMinimum: 999,
      shippingCharge: 80,
      codCharge: 0,
      estimatedDelivery: "3-7 Business Days",
      deliveryMessage:
        "Orders are delivered within 3-7 business days.",
    });

  const [shippingLoading, setShippingLoading] =
    useState(true);

  // ==========================================
  // FETCH SHIPPING SETTINGS
  // ==========================================

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        setShippingLoading(true);

        const res = await api.get("/shipping");

        if (res.data?.settings) {
          setShippingSettings({
            freeShippingEnabled:
              res.data.settings
                .freeShippingEnabled ?? true,

            freeShippingMinimum:
              Number(
                res.data.settings
                  .freeShippingMinimum
              ) || 999,

            shippingCharge:
              Number(
                res.data.settings
                  .shippingCharge
              ) || 80,

            codCharge:
              Number(
                res.data.settings
                  .codCharge
              ) || 0,

            estimatedDelivery:
              res.data.settings
                .estimatedDelivery ||
              "3-7 Business Days",

            deliveryMessage:
              res.data.settings
                .deliveryMessage ||
              "Orders are delivered within 3-7 business days.",
          });
        }
      } catch (error) {
        console.error(
          "Failed to load shipping settings:",
          error
        );

        // Keep safe default values
        setShippingSettings({
          freeShippingEnabled: true,
          freeShippingMinimum: 999,
          shippingCharge: 80,
          codCharge: 0,
          estimatedDelivery:
            "3-7 Business Days",
          deliveryMessage:
            "Orders are delivered within 3-7 business days.",
        });
      } finally {
        setShippingLoading(false);
      }
    };

    fetchShippingSettings();
  }, []);

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ==========================================
  // SHIPPING
  // ==========================================

  const FREE_SHIPPING_LIMIT =
    Number(
      shippingSettings.freeShippingMinimum
    ) || 999;

  const SHIPPING_CHARGE =
    Number(
      shippingSettings.shippingCharge
    ) || 80;

  const freeShippingEnabled =
    shippingSettings.freeShippingEnabled;

  const qualifiesForFreeShipping =
    freeShippingEnabled &&
    subtotal >= FREE_SHIPPING_LIMIT;

  const shipping =
    subtotal === 0
      ? 0
      : qualifiesForFreeShipping
      ? 0
      : SHIPPING_CHARGE;

  const total = subtotal + shipping;

  // ==========================================
  // FREE SHIPPING PROGRESS
  // ==========================================

  const remainingForFreeShipping =
    Math.max(
      FREE_SHIPPING_LIMIT - subtotal,
      0
    );

  const shippingProgress =
    freeShippingEnabled
      ? Math.min(
          (subtotal /
            FREE_SHIPPING_LIMIT) *
            100,
          100
        )
      : 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFAF7]">

        {/* ======================================
            BREADCRUMB
        ====================================== */}

        <div className="border-b border-[#EDE5E0] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-2 text-xs text-[#817671]">

              <Link
                href="/"
                className="transition hover:text-[#C78B7B]"
              >
                Home
              </Link>

              <ChevronRight size={13} />

              <span className="font-medium text-[#3A2528]">
                Cart
              </span>

            </div>

          </div>

        </div>

        {/* ======================================
            PAGE
        ====================================== */}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          {/* ====================================
              HEADING
          ==================================== */}

          <div className="mb-8">

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
              Your Selection
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
              Shopping Cart
            </h1>

            {cart.length > 0 && (
              <p className="mt-2 text-sm text-[#817671]">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}{" "}
                selected
              </p>
            )}

          </div>

          {/* ======================================
              EMPTY CART
          ====================================== */}

          {cart.length === 0 ? (

            <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white">

              <div className="flex min-h-[480px] flex-col items-center justify-center px-6 py-16 text-center">

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F8F1EC]">

                  <ShoppingBag
                    size={36}
                    strokeWidth={1.5}
                    className="text-[#C78B7B]"
                  />

                </div>

                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Your jewellery journey
                  starts here
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                  Your Cart is Empty
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#817671]">
                  Discover our collection of
                  beautiful jewellery pieces and
                  find something special for
                  yourself or someone you love.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-8 text-sm font-semibold text-white transition hover:bg-[#29181B]"
                >
                  Continue Shopping

                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          ) : (

            <>

              {/* =================================
                  FREE SHIPPING MESSAGE
              ================================= */}

              {freeShippingEnabled && (
                <div className="mb-7 rounded-2xl border border-[#E8DFD9] bg-white p-5">

                  {qualifiesForFreeShipping ? (

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDF5E9]">

                        <Truck
                          size={17}
                          className="text-[#55734E]"
                        />

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-[#55734E]">
                          You've unlocked free
                          shipping!
                        </p>

                        <p className="mt-0.5 text-xs text-[#817671]">
                          Your order qualifies for
                          complimentary delivery.
                        </p>

                      </div>

                    </div>

                  ) : (

                    <div>

                      <div className="flex items-center justify-between gap-4">

                        <p className="text-sm text-[#5E5551]">

                          Add{" "}

                          <span className="font-semibold text-[#3A2528]">
                            ₹
                            {remainingForFreeShipping.toLocaleString(
                              "en-IN"
                            )}
                          </span>{" "}
                          more for free shipping

                        </p>

                        <Truck
                          size={18}
                          className="shrink-0 text-[#C78B7B]"
                        />

                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEE6E1]">

                        <div
                          className="h-full rounded-full bg-[#C78B7B] transition-all duration-500"
                          style={{
                            width: `${shippingProgress}%`,
                          }}
                        />

                      </div>

                    </div>

                  )}

                </div>
              )}

              {/* =================================
                  MAIN GRID
              ================================= */}

              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

                {/* =================================
                    CART ITEMS
                ================================= */}

                <div className="space-y-4">

                  {cart.map((item) => {

                    const variantKey =
                      `${item._id}-${item.color || ""}-${item.size || ""}`;

                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <div
                        key={variantKey}
                        className="group relative overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white p-4 transition hover:shadow-md sm:p-5"
                      >

                        <div className="flex gap-4 sm:gap-5">

                          {/* =========================
                              IMAGE
                          ========================= */}

                          <Link
                            href={`/shop/${item._id}`}
                            className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F4] sm:h-32 sm:w-28"
                          >

                            <Image
                              src={
                                item.image ||
                                "/placeholder.png"
                              }
                              alt={item.name}
                              fill
                              sizes="112px"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />

                          </Link>

                          {/* =========================
                              PRODUCT DETAILS
                          ========================= */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <Link
                                  href={`/shop/${item._id}`}
                                  className="line-clamp-2 font-serif text-lg leading-6 text-[#2E2E2E] transition hover:text-[#C78B7B] sm:text-xl"
                                >
                                  {item.name}
                                </Link>

                                <p className="mt-1 text-xs text-[#918681]">
                                  Premium Artificial
                                  Jewellery
                                </p>

                              </div>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item._id,
                                    item.color,
                                    item.size
                                  )
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#AAA] transition hover:bg-red-50 hover:text-red-500"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2
                                  size={16}
                                  strokeWidth={1.7}
                                />
                              </button>

                            </div>

                            {/* VARIANTS */}

                            {(item.color ||
                              item.size) && (

                              <div className="mt-3 flex flex-wrap gap-2">

                                {item.color && (
                                  <span className="rounded-full bg-[#FCF7F4] px-3 py-1 text-[11px] text-[#655A55]">

                                    <span className="font-medium">
                                      Color:
                                    </span>{" "}
                                    {item.color}

                                  </span>
                                )}

                                {item.size && (
                                  <span className="rounded-full bg-[#FCF7F4] px-3 py-1 text-[11px] text-[#655A55]">

                                    <span className="font-medium">
                                      Size:
                                    </span>{" "}
                                    {item.size}

                                  </span>
                                )}

                              </div>
                            )}

                            {/* MOBILE PRICE */}

                            <div className="mt-4 sm:hidden">

                              <span className="text-lg font-semibold text-[#2E2E2E]">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                            {/* BOTTOM */}

                            <div className="mt-4 flex items-center justify-between gap-3">

                              {/* QUANTITY */}

                              <div className="flex h-9 items-center rounded-full border border-[#DED5D0]">

                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item._id,
                                      item.color,
                                      item.size
                                    )
                                  }
                                  className="flex h-full w-9 items-center justify-center rounded-l-full text-[#3A2528] transition hover:bg-[#F7F2EF]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="flex h-full w-9 items-center justify-center border-x border-[#DED5D0] text-xs font-semibold">
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
                                  className="flex h-full w-9 items-center justify-center rounded-r-full text-[#3A2528] transition hover:bg-[#F7F2EF]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>

                              </div>

                              {/* MOBILE TOTAL */}

                              <span className="text-sm font-semibold text-[#3A2528] sm:hidden">
                                ₹
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                          </div>

                          {/* DESKTOP PRICE */}

                          <div className="hidden shrink-0 text-right sm:block">

                            <p className="text-sm text-[#8A807B]">
                              Unit Price
                            </p>

                            <p className="mt-1 text-lg font-semibold text-[#2E2E2E]">
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <p className="mt-8 text-sm font-semibold text-[#3A2528]">
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                  {/* CONTINUE SHOPPING */}

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 pt-3 text-sm font-medium text-[#5D4C47] transition hover:text-[#C78B7B]"
                  >
                    <ArrowRight
                      size={15}
                      className="rotate-180"
                    />

                    Continue Shopping
                  </Link>

                </div>

                {/* =================================
                    ORDER SUMMARY
                ================================= */}

                <aside className="lg:sticky lg:top-24">

                  <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white">

                    {/* HEADER */}

                    <div className="border-b border-[#EEE6E1] px-6 py-5">

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                        Your Order
                      </p>

                      <h2 className="mt-1 font-serif text-2xl text-[#2E2E2E]">
                        Order Summary
                      </h2>

                    </div>

                    {/* SUMMARY */}

                    <div className="px-6 py-6">

                      <div className="space-y-4 text-sm">

                        <div className="flex justify-between">

                          <span className="text-[#655C57]">
                            Items
                          </span>

                          <span className="font-medium text-[#2E2E2E]">
                            {totalItems}
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-[#655C57]">
                            Subtotal
                          </span>

                          <span className="font-medium text-[#2E2E2E]">
                            ₹
                            {subtotal.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-[#655C57]">
                            Shipping
                          </span>

                          <span
                            className={
                              shipping === 0
                                ? "font-semibold text-[#55734E]"
                                : "font-medium text-[#2E2E2E]"
                            }
                          >
                            {shipping === 0
                              ? "FREE"
                              : `₹${shipping}`}
                          </span>

                        </div>

                      </div>

                      <div className="my-6 h-px bg-[#E5DDD7]" />

                      <div className="flex items-center justify-between">

                        <span className="text-lg font-semibold text-[#2E2E2E]">
                          Total
                        </span>

                        <span className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                      {/* CHECKOUT */}

                      <Link
                        href="/checkout"
                        className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] px-5 text-sm font-semibold text-white transition hover:bg-[#29181B]"
                      >
                        Proceed to Checkout

                        <ArrowRight size={16} />
                      </Link>

                      {/* ==================================
                          TRUST & SERVICE FEATURES
                      ================================== */}

                      <div className="mt-5 overflow-hidden rounded-2xl border border-[#E8DFD9] bg-[#FCFAF8]">

                        {/* Authenticity */}

                        <div className="flex gap-4 border-b border-[#E8DFD9] p-5">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

                            <ShieldCheck
                              size={20}
                              className="text-[#A66F61]"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-semibold text-[#3A302D]">
                              Authentic Jewellery
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#817772]">
                              Every piece is quality checked before
                              it is carefully prepared for dispatch.
                            </p>

                          </div>

                        </div>

                        {/* Packaging */}

                        <div className="flex gap-4 border-b border-[#E8DFD9] p-5">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

                            <Package
                              size={20}
                              className="text-[#A66F61]"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-semibold text-[#3A302D]">
                              Carefully Packed
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#817772]">
                              Your jewellery is securely packed to
                              help it reach you safely.
                            </p>

                          </div>

                        </div>

                        {/* Returns */}

                        <div className="flex gap-4 border-b border-[#E8DFD9] p-5">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

                            <RotateCcw
                              size={20}
                              className="text-[#A66F61]"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-semibold text-[#3A302D]">
                              Easy Returns
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#817772]">
                              Hassle-free return support for eligible
                              orders.
                            </p>

                          </div>

                        </div>

                        {/* Secure Payment */}

                        <div className="flex gap-4 p-5">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

                            <ShieldCheck
                              size={20}
                              className="text-[#A66F61]"
                            />

                          </div>

                          <div>

                            <h3 className="text-sm font-semibold text-[#3A302D]">
                              Secure Checkout
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#817772]">
                              Your payment information is handled
                              through secure checkout.
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </aside>

              </div>

            </>

          )}

        </div>

      </main>

      <Footer />
    </>
  );
}