"use client";

import Confetti from "react-confetti";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import api from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface OrderProduct {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

interface Order {
  _id: string;
  customerName?: string;
  phone?: string;
  email?: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  products?: OrderProduct[];

  totalAmount: number;

  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;

  createdAt?: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("id");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showConfetti, setShowConfetti] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  // ==========================================
  // CONFETTI
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3500);

    return () =>
      clearTimeout(timer);
  }, []);

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError(
        "Order information is missing."
      );
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const { data } =
          await api.get(
            `/orders/my-orders/${orderId}`
          );

        if (!data?.order) {
          throw new Error(
            "Order not found."
          );
        }

        setOrder(data.order);
      } catch (err: any) {
        console.error(
          "Fetch Order Error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Unable to load your order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ==========================================
  // COPY ORDER ID
  // ==========================================

  const copyOrderId = async () => {
    if (!order?._id) return;

    try {
      await navigator.clipboard.writeText(
        order._id
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // PAYMENT STATUS
  // ==========================================

  const isPaymentComplete =
    order?.paymentMethod ===
      "COD"
      ? true
      : order?.paymentStatus
          ?.toLowerCase()
          .includes("paid");

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="flex min-h-[75vh] items-center justify-center bg-[#FCFAF7] px-4">

            <div className="text-center">

              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

              <p className="mt-5 text-sm text-[#777]">
                Preparing your order
                confirmation...
              </p>

            </div>

          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="flex min-h-[75vh] items-center justify-center bg-[#FCFAF7] px-4 py-16">

            <div className="w-full max-w-lg rounded-3xl border border-[#E8DFD9] bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F0]">

                <PackageCheck
                  size={28}
                  className="text-[#C76B6B]"
                />

              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                Order Confirmation
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                Something went wrong
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777]">
                {error ||
                  "We couldn't find this order."}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

                <Link
                  href="/account/orders"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#3A2528] px-7 text-sm font-semibold text-white transition hover:bg-[#29181B]"
                >
                  View My Orders
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#DCCFC8] bg-white px-7 text-sm font-semibold text-[#3A2528] transition hover:bg-[#FCF8F5]"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ==========================================
  // SUCCESS PAGE
  // ==========================================

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7]">

          {/* ==================================
              CONFETTI
          ================================== */}

          {showConfetti && (
            <Confetti
              recycle={false}
              numberOfPieces={220}
              gravity={0.16}
            />
          )}

          {/* ==================================
              HERO
          ================================== */}

          <section className="relative overflow-hidden border-b border-[#EAE1DB] bg-white">

            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#F8EDE8] opacity-60 blur-3xl" />

            <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-20">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#E6D8D1] bg-[#FBF3EF] shadow-sm">

                <CheckCircle2
                  size={54}
                  strokeWidth={1.5}
                  className="text-[#78966F]"
                />

              </div>

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C78B7B]">

                <Sparkles
                  size={13}
                />

                Thank You

                <Sparkles
                  size={13}
                />

              </div>

              <h1 className="mt-3 font-serif text-4xl font-semibold text-[#2E2E2E] sm:text-5xl lg:text-6xl">
                Your Order is Confirmed
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#777] sm:text-base">
                Thank you for choosing
                Mahalakshmi Jewellery.
                Your order has been
                successfully placed and
                our team will carefully
                prepare your pieces.
              </p>

              {/* ORDER ID */}

              <div className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-full border border-[#E5DAD4] bg-[#FCF8F5] px-4 py-2.5">

                <span className="text-xs text-[#817671]">
                  Order
                </span>

                <span className="font-mono text-xs font-semibold text-[#3A2528]">
                  #
                  {order._id
                    .slice(-8)
                    .toUpperCase()}
                </span>

                <button
                  type="button"
                  onClick={
                    copyOrderId
                  }
                  className="rounded-full p-1.5 text-[#817671] transition hover:bg-white hover:text-[#C78B7B]"
                  title="Copy order ID"
                >
                  {copied ? (
                    <CheckCircle2
                      size={14}
                    />
                  ) : (
                    <Copy
                      size={14}
                    />
                  )}
                </button>

              </div>

              {copied && (
                <p className="mt-2 text-[10px] text-green-600">
                  Order ID copied
                </p>
              )}

            </div>

          </section>

          {/* ==================================
              CONTENT
          ================================== */}

          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

              {/* =================================
                  LEFT
              ================================= */}

              <div className="space-y-6">

                {/* ORDER STATUS */}

                <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm sm:p-7">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                        Order Status
                      </p>

                      <h2 className="mt-1 font-serif text-2xl text-[#2E2E2E]">
                        We're preparing your order
                      </h2>

                    </div>

                    <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#F4F8F2] sm:flex">

                      <PackageCheck
                        size={21}
                        className="text-[#78966F]"
                      />

                    </div>

                  </div>

                  {/* STATUS STEPS */}

                  <div className="mt-7 grid grid-cols-3">

                    <div className="relative text-center">

                      <div className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#3A2528] text-white">

                        <CheckCircle2
                          size={17}
                        />

                      </div>

                      <p className="mt-3 text-xs font-semibold text-[#3A2528]">
                        Confirmed
                      </p>

                      <p className="mt-1 text-[10px] text-[#999]">
                        Order placed
                      </p>

                    </div>

                    <div className="relative text-center">

                      <div className="absolute left-[-50%] right-[50%] top-4 h-px bg-[#D8CEC8]" />

                      <div className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CEC8] bg-white text-[#999]">

                        <PackageCheck
                          size={17}
                        />

                      </div>

                      <p className="mt-3 text-xs font-semibold text-[#6B625E]">
                        Preparing
                      </p>

                      <p className="mt-1 text-[10px] text-[#999]">
                        Carefully packed
                      </p>

                    </div>

                    <div className="relative text-center">

                      <div className="absolute left-[-50%] right-[50%] top-4 h-px bg-[#D8CEC8]" />

                      <div className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CEC8] bg-white text-[#999]">

                        <Truck
                          size={17}
                        />

                      </div>

                      <p className="mt-3 text-xs font-semibold text-[#6B625E]">
                        Delivered
                      </p>

                      <p className="mt-1 text-[10px] text-[#999]">
                        On its way to you
                      </p>

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">

                  <div className="border-b border-[#EEE6E1] px-5 py-5 sm:px-7">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">

                        <ShoppingBag
                          size={18}
                          className="text-[#C78B7B]"
                        />

                      </div>

                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                          Your Jewellery
                        </p>

                        <h2 className="font-serif text-2xl text-[#2E2E2E]">
                          Order Items
                        </h2>

                      </div>

                    </div>

                  </div>

                  <div className="divide-y divide-[#EEE6E1]">

                    {(order.products ||
                      []).map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={`${item.productId || item.name}-${index}`}
                          className="flex gap-4 p-5 sm:p-6"
                        >

                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F4] sm:h-24 sm:w-24">

                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag
                                  size={22}
                                  className="text-[#C8B8AF]"
                                />
                              </div>
                            )}

                          </div>

                          <div className="min-w-0 flex-1">

                            <h3 className="font-serif text-base text-[#2E2E2E] sm:text-lg">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-[#888]">
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </p>

                            {(item.color ||
                              item.size) && (
                              <p className="mt-1 text-xs text-[#888]">

                                {item.color &&
                                  `Color: ${item.color}`}

                                {item.color &&
                                  item.size &&
                                  " • "}

                                {item.size &&
                                  `Size: ${item.size}`}

                              </p>
                            )}

                          </div>

                          <div className="text-right">

                            <p className="text-sm font-semibold text-[#3A2528] sm:text-base">
                              ₹
                              {(
                                Number(
                                  item.price ||
                                    0
                                ) *
                                Number(
                                  item.quantity ||
                                    0
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <p className="mt-1 text-[10px] text-[#999]">
                              ₹
                              {Number(
                                item.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
                              each
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* DELIVERY ADDRESS */}

                <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm sm:p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">

                      <MapPin
                        size={18}
                        className="text-[#C78B7B]"
                      />

                    </div>

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                        Shipping
                      </p>

                      <h2 className="font-serif text-2xl text-[#2E2E2E]">
                        Delivery Address
                      </h2>

                    </div>

                  </div>

                  <div className="mt-5 rounded-xl bg-[#FCF9F6] p-5">

                    <p className="text-sm font-semibold text-[#3D3532]">
                      {order.customerName ||
                        "Customer"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#706762]">
                      {order.address ||
                        "—"}
                      <br />
                      {order.city ||
                        "—"}
                      ,{" "}
                      {order.state ||
                        "—"}{" "}
                      -{" "}
                      {order.pincode ||
                        "—"}
                    </p>

                    {order.phone && (
                      <p className="mt-3 text-xs text-[#888]">
                        Mobile:{" "}
                        {order.phone}
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================
                  RIGHT
              ================================= */}

              <aside className="lg:sticky lg:top-24">

                <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">

                  <div className="border-b border-[#EEE6E1] px-5 py-5">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                      Order Details
                    </p>

                    <h2 className="mt-1 font-serif text-2xl text-[#2E2E2E]">
                      Summary
                    </h2>

                  </div>

                  <div className="p-5">

                    <div className="space-y-4 text-sm">

                      <div className="flex justify-between gap-4">

                        <span className="text-[#777]">
                          Order Date
                        </span>

                        <span className="text-right font-medium text-[#3A3330]">
                          {formatDate(
                            order.createdAt
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-[#777]">
                          Payment
                        </span>

                        <span className="font-medium text-[#3A3330]">
                          {order.paymentMethod ||
                            "—"}
                        </span>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-[#777]">
                          Payment Status
                        </span>

                        <span
                          className={
                            isPaymentComplete
                              ? "font-semibold text-green-600"
                              : "font-semibold text-amber-600"
                          }
                        >
                          {order.paymentStatus ||
                            "Pending"}
                        </span>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-[#777]">
                          Order Status
                        </span>

                        <span className="font-semibold text-[#C78B7B]">
                          {order.orderStatus ||
                            "Confirmed"}
                        </span>

                      </div>

                    </div>

                    <div className="my-5 h-px bg-[#E8DFD9]" />

                    <div className="flex items-center justify-between">

                      <span className="font-semibold text-[#2E2E2E]">
                        Total Paid
                      </span>

                      <span className="font-serif text-2xl font-semibold text-[#3A2528]">
                        ₹
                        {Number(
                          order.totalAmount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    {/* DELIVERY */}

                    <div className="mt-6 rounded-xl border border-[#E4EBDD] bg-[#F6F9F4] p-4">

                      <div className="flex gap-3">

                        <Truck
                          size={18}
                          className="mt-0.5 shrink-0 text-[#6E8965]"
                        />

                        <div>

                          <p className="text-sm font-semibold text-[#4C6247]">
                            Estimated Delivery
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#6C7A68]">
                            Your order is
                            expected to
                            arrive within
                            3–5 business
                            days.
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-6 space-y-3">

                      <Link
                        href="/account/orders"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B]"
                      >
                        View My Orders

                        <ArrowRight
                          size={15}
                        />
                      </Link>

                      <Link
                        href="/shop"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DCCFC8] bg-white text-sm font-semibold text-[#3A2528] transition hover:bg-[#FCF8F5]"
                      >
                        Continue Shopping
                      </Link>

                    </div>

                  </div>

                </div>

                {/* TRUST */}

                <div className="mt-4 rounded-2xl border border-[#E8DFD9] bg-white p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F0EC]">

                      <Clock3
                        size={17}
                        className="text-[#C78B7B]"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-[#3E3734]">
                        What's next?
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-[#888]">
                        We'll keep you updated
                        as your order moves
                        through each stage.
                      </p>

                    </div>

                  </div>

                </div>

              </aside>

            </div>

          </section>

          {/* ==================================
              BOTTOM CTA
          ================================== */}

          <section className="border-t border-[#EAE1DB] bg-white">

            <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C78B7B]">
                Made With Care
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E]">
                Thank you for shopping with us.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#777]">
                Every piece is prepared
                with care so your jewellery
                reaches you beautifully
                packed and ready to wear.
              </p>

            </div>

          </section>

        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}