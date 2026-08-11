"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import api from "@/lib/api";
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
  createdAt: string;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  products?: OrderProduct[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } =
          await api.get(
            "/orders/my-orders"
          );

        console.log(
          "MY ORDERS RESPONSE:",
          data
        );

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      } catch (error: any) {
        console.error(
          "MY ORDERS ERROR:",
          error
        );

        setError(
          error?.response?.data
            ?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ==========================================
  // STATUS CONFIG
  // ==========================================

  const getStatusConfig = (
    status?: string
  ) => {
    switch (status) {
      case "Delivered":
        return {
          label: "Delivered",
          className:
            "bg-[#F1F7EF] text-[#5E7D57] border-[#DCE8D8]",
          icon: CheckCircle2,
        };

      case "Shipped":
        return {
          label: "Shipped",
          className:
            "bg-[#F0F5FA] text-[#54718C] border-[#D9E4ED]",
          icon: Truck,
        };

      case "Out for Delivery":
        return {
          label: "Out for Delivery",
          className:
            "bg-[#F6F1FA] text-[#765B88] border-[#E6DAEC]",
          icon: Truck,
        };

      case "Packed":
        return {
          label: "Packed",
          className:
            "bg-[#F2F2FA] text-[#62658B] border-[#DEDFEC]",
          icon: Package,
        };

      case "Confirmed":
        return {
          label: "Confirmed",
          className:
            "bg-[#F1F8F3] text-[#52775D] border-[#D8E8DD]",
          icon: CheckCircle2,
        };

      case "Cancelled":
        return {
          label: "Cancelled",
          className:
            "bg-[#FFF2F1] text-[#A45D5D] border-[#F0D8D5]",
          icon: Clock3,
        };

      default:
        return {
          label:
            status || "Processing",
          className:
            "bg-[#FFF8EC] text-[#99743E] border-[#F0E1C6]",
          icon: Clock3,
        };
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const getTotalItems = (
    products?: OrderProduct[]
  ) => {
    return (
      products?.reduce(
        (total, product) =>
          total +
          Number(
            product.quantity || 0
          ),
        0
      ) || 0
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          {/* =================================
              HEADER
          ================================= */}

          <section className="mb-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C78B7B]">
                  Your Jewellery
                </p>

                <h1 className="mt-2 font-serif text-4xl font-semibold text-[#2E2E2E] sm:text-5xl">
                  My Orders
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#777]">
                  View your previous purchases,
                  track deliveries and manage
                  your jewellery orders.
                </p>

              </div>

              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-6 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Continue Shopping

                <ArrowRight
                  size={15}
                />
              </Link>

            </div>

            {/* SUMMARY */}

            {!loading &&
              !error &&
              orders.length > 0 && (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  <div className="rounded-2xl border border-[#E8DFD9] bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F0EC]">
                        <ShoppingBag
                          size={17}
                          className="text-[#C78B7B]"
                        />
                      </div>

                      <div>

                        <p className="text-xl font-semibold text-[#2E2E2E]">
                          {orders.length}
                        </p>

                        <p className="text-[10px] uppercase tracking-wide text-[#999]">
                          Orders
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-[#E8DFD9] bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F8F2]">
                        <Truck
                          size={17}
                          className="text-[#6D8965]"
                        />
                      </div>

                      <div>

                        <p className="text-xl font-semibold text-[#2E2E2E]">
                          {
                            orders.filter(
                              (order) =>
                                order.orderStatus !==
                                  "Delivered" &&
                                order.orderStatus !==
                                  "Cancelled"
                            ).length
                          }
                        </p>

                        <p className="text-[10px] uppercase tracking-wide text-[#999]">
                          Active
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="col-span-2 rounded-2xl border border-[#E8DFD9] bg-white p-4 shadow-sm sm:col-span-1">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F0EC]">
                        <Package
                          size={17}
                          className="text-[#C78B7B]"
                        />
                      </div>

                      <div>

                        <p className="text-xl font-semibold text-[#2E2E2E]">
                          {orders.reduce(
                            (
                              total,
                              order
                            ) =>
                              total +
                              getTotalItems(
                                order.products
                              ),
                            0
                          )}
                        </p>

                        <p className="text-[10px] uppercase tracking-wide text-[#999]">
                          Items Purchased
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              )}

          </section>

          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div className="space-y-5">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-[#E8DFD9] bg-white p-6"
                  >

                    <div className="h-5 w-40 rounded bg-[#EEE7E2]" />

                    <div className="mt-3 h-3 w-28 rounded bg-[#F1ECE8]" />

                    <div className="mt-7 flex gap-4">

                      <div className="h-20 w-20 rounded-xl bg-[#EEE7E2]" />

                      <div className="flex-1">

                        <div className="h-4 w-48 rounded bg-[#EEE7E2]" />

                        <div className="mt-3 h-3 w-28 rounded bg-[#F1ECE8]" />

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

          {/* =================================
              ERROR
          ================================= */}

          {!loading && error && (
            <div className="rounded-2xl border border-[#E8DFD9] bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF2F1]">

                <Package
                  size={28}
                  className="text-[#A45D5D]"
                />

              </div>

              <h2 className="mt-5 font-serif text-2xl text-[#2E2E2E]">
                Unable to load orders
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777]">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 rounded-full bg-[#3A2528] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================
              EMPTY
          ================================= */}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="rounded-3xl border border-[#E8DFD9] bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F0EC]">

                  <ShoppingBag
                    size={32}
                    className="text-[#C78B7B]"
                  />

                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Your Collection
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                  No Orders Yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777]">
                  Your beautiful jewellery
                  purchases will appear here
                  once you place your first
                  order.
                </p>

                <Link
                  href="/shop"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-8 text-sm font-semibold text-white transition hover:bg-[#29181B]"
                >
                  Explore Jewellery

                  <ArrowRight
                    size={16}
                  />
                </Link>

              </div>
            )}

          {/* =================================
              ORDERS
          ================================= */}

          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="space-y-6">

                {orders.map(
                  (order) => {
                    const status =
                      getStatusConfig(
                        order.orderStatus
                      );

                    const StatusIcon =
                      status.icon;

                    const totalItems =
                      getTotalItems(
                        order.products
                      );

                    return (
                      <article
                        key={
                          order._id
                        }
                        className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm transition duration-300 hover:shadow-md"
                      >

                        {/* ==================
                            ORDER HEADER
                        ================== */}

                        <div className="border-b border-[#EEE6E1] px-5 py-5 sm:px-7">

                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                              <div className="flex flex-wrap items-center gap-3">

                                <h2 className="font-serif text-xl text-[#2E2E2E] sm:text-2xl">
                                  Order #
                                  {order._id
                                    .slice(
                                      -8
                                    )
                                    .toUpperCase()}
                                </h2>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold ${status.className}`}
                                >
                                  <StatusIcon
                                    size={12}
                                  />

                                  {
                                    status.label
                                  }
                                </span>

                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#888]">

                                <span className="flex items-center gap-1.5">

                                  <CalendarDays
                                    size={13}
                                  />

                                  {formatDate(
                                    order.createdAt
                                  )}

                                </span>

                                <span className="flex items-center gap-1.5">

                                  <ShoppingBag
                                    size={13}
                                  />

                                  {totalItems}{" "}
                                  {totalItems ===
                                  1
                                    ? "item"
                                    : "items"}

                                </span>

                              </div>

                            </div>

                            <div className="flex items-center justify-between gap-5 lg:block lg:text-right">

                              <div>

                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#999]">
                                  Order Total
                                </p>

                                <p className="mt-1 font-serif text-2xl font-semibold text-[#3A2528]">
                                  ₹
                                  {Number(
                                    order.totalAmount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                              </div>

                              <p className="mt-1 text-xs text-[#888]">
                                {order.paymentMethod ||
                                  "Payment"}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* ==================
                            PRODUCTS
                        ================== */}

                        <div className="px-5 py-5 sm:px-7">

                          <div className="space-y-5">

                            {(
                              order.products ||
                              []
                            ).map(
                              (
                                product,
                                index
                              ) => (
                                <div
                                  key={`${product.productId || product.name}-${index}`}
                                  className="flex gap-4"
                                >

                                  {/* IMAGE */}

                                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#ECE4DE] bg-[#FAF7F4] sm:h-24 sm:w-24">

                                    {product.image ? (
                                      <img
                                        src={
                                          product.image
                                        }
                                        alt={
                                          product.name
                                        }
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <ShoppingBag
                                          size={
                                            22
                                          }
                                          className="text-[#C8B8AF]"
                                        />
                                      </div>
                                    )}

                                  </div>

                                  {/* INFO */}

                                  <div className="min-w-0 flex-1">

                                    <h3 className="line-clamp-2 font-serif text-base text-[#2E2E2E] sm:text-lg">
                                      {
                                        product.name
                                      }
                                    </h3>

                                    <div className="mt-2 space-y-1 text-xs text-[#888]">

                                      <p>
                                        Quantity:{" "}
                                        {
                                          product.quantity
                                        }
                                      </p>

                                      {product.color && (
                                        <p>
                                          Color:{" "}
                                          {
                                            product.color
                                          }
                                        </p>
                                      )}

                                      {product.size && (
                                        <p>
                                          Size:{" "}
                                          {
                                            product.size
                                          }
                                        </p>
                                      )}

                                    </div>

                                  </div>

                                  {/* PRICE */}

                                  <div className="shrink-0 text-right">

                                    <p className="text-sm font-semibold text-[#3A2528] sm:text-base">
                                      ₹
                                      {(
                                        Number(
                                          product.price ||
                                            0
                                        ) *
                                        Number(
                                          product.quantity ||
                                            0
                                        )
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>

                                    <p className="mt-1 text-[10px] text-[#999]">
                                      ₹
                                      {Number(
                                        product.price ||
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

                        {/* ==================
                            FOOTER
                        ================== */}

                        <div className="border-t border-[#EEE6E1] bg-[#FCFAF7] px-5 py-4 sm:px-7">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-2 text-xs text-[#777]">

                              <CheckCircle2
                                size={14}
                                className="text-[#78966F]"
                              />

                              <span>
                                Payment:{" "}
                                <strong className="text-[#4B423E]">
                                  {order.paymentStatus ||
                                    "Pending"}
                                </strong>
                              </span>

                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                              <Link
                                href={`/account/orders/${order._id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#3A2528] px-5 text-xs font-semibold text-[#3A2528] transition hover:bg-[#3A2528] hover:text-white"
                              >
                                View Order

                                <ArrowRight
                                  size={13}
                                />
                              </Link>

                              {(order.orderStatus ===
                                "Shipped" ||
                                order.orderStatus ===
                                  "Out for Delivery" ||
                                order.orderStatus ===
                                  "Delivered") && (
                                <Link
                                  href={`/account/orders/${order._id}`}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-5 text-xs font-semibold text-white transition hover:bg-[#29181B]"
                                >
                                  <Truck
                                    size={
                                      14
                                    }
                                  />

                                  Track Order
                                </Link>
                              )}

                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

        </div>

      </main>
    </ProtectedRoute>
  );
}