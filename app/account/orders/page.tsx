"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");

      console.log("MY ORDERS RESPONSE:", data);

      setOrders(data.orders || []);
    } catch (error) {
      console.error("MY ORDERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Packed":
        return "bg-indigo-100 text-indigo-700";

      case "Confirmed":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7] py-16">
        <div className="mx-auto max-w-6xl px-6">

          {/* =========================
              Page Header
          ========================= */}

          <div>
            <h1 className="text-4xl font-bold text-[#2E2E2E]">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              View your order history
            </p>
          </div>

          {/* =========================
              Loading
          ========================= */}

          {loading ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-md">
              <p className="text-gray-500">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (

            /* =========================
               No Orders
            ========================= */

            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-md">

              <div className="text-5xl">
                📦
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-[#2E2E2E]">
                No Orders Found
              </h2>

              <p className="mt-3 text-gray-500">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block rounded-full bg-[#3A2528] px-8 py-3 font-semibold text-white transition hover:bg-[#29181B]"
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            /* =========================
               Orders List
            ========================= */

            <div className="mt-10 space-y-6">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="rounded-2xl border border-[#ECE6E1] bg-white p-6 shadow-md transition hover:shadow-lg"
                >

                  {/* =========================
                      Order Header
                  ========================= */}

                  <div className="flex flex-col gap-5 border-b border-[#ECE6E1] pb-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <h2 className="text-xl font-bold text-[#2E2E2E]">
                        Order #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-2xl font-bold text-[#C78B7B]">
                        ₹
                        {Number(
                          order.totalAmount
                        ).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.paymentMethod}
                      </p>

                    </div>

                    {/* Status */}

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  {/* =========================
                      Products
                  ========================= */}

                  <div className="mt-6 space-y-5">

                    {order.products?.map(
                      (
                        product: any,
                        index: number
                      ) => (

                        <div
                          key={index}
                          className="flex items-center gap-4"
                        >

                          <img
                            src={
                              product.image ||
                              "/placeholder.jpg"
                            }
                            alt={
                              product.name ||
                              "Product"
                            }
                            className="h-20 w-20 rounded-xl border border-[#ECE6E1] object-cover"
                          />

                          <div className="flex-1">

                            <h3 className="font-semibold text-[#2E2E2E]">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{" "}
                              {product.quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {product.color && (
                              <p className="text-sm text-gray-500">
                                Color:{" "}
                                {product.color}
                              </p>
                            )}

                            {product.size && (
                              <p className="text-sm text-gray-500">
                                Size:{" "}
                                {product.size}
                              </p>
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* =========================
                      Order Actions
                  ========================= */}

                  <div className="mt-6 flex flex-col gap-3 border-t border-[#ECE6E1] pt-6 sm:flex-row sm:justify-end">

                    <Link
                      href={`/account/orders/${order._id}`}
                      className="rounded-full border border-[#3A2528] px-6 py-3 text-center font-semibold text-[#3A2528] transition hover:bg-[#3A2528] hover:text-white"
                    >
                      View Order
                    </Link>

                    {(order.orderStatus === "Shipped" ||
                      order.orderStatus ===
                        "Out for Delivery" ||
                      order.orderStatus ===
                        "Delivered") && (

                      <Link
                        href={`/account/orders/${order._id}`}
                        className="rounded-full bg-[#3A2528] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#29181B]"
                      >
                        Track Order
                      </Link>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </main>
    </ProtectedRoute>
  );
}