"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCart } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import api from "@/lib/api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRatings, setReviewRatings] = useState<{
  [key: string]: number;
}>({});

const [reviewComments, setReviewComments] = useState<{
  [key: string]: string;
}>({});

const [reviewSubmitting, setReviewSubmitting] = useState<{
  [key: string]: boolean;
}>({});

  // ============================
  // Fetch Order
  // ============================

  useEffect(() => {
    if (!id) return;

    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(
        `/orders/my-orders/${id}`
      );

      console.log("ORDER DETAILS:", data);

      setOrder(data.order);
    } catch (error: any) {
      console.error(
        "ORDER DETAILS ERROR:",
        error
      );

      console.error(
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancelOrder = async () => {
  if (!order) return;

  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  try {
    const { data } = await api.put(
      `/orders/my-orders/${order._id}/cancel`
    );

    console.log(
      "CANCEL ORDER RESPONSE:",
      data
    );

    setOrder(data.order);

    alert(
      "Order cancelled successfully."
    );
  } catch (error: any) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to cancel order."
    );
  }
};
const handleBuyAgain = async () => {
  if (!order?.products?.length) {
    alert("No products found in this order.");
    return;
  }

  try {
    for (const item of order.products) {
      const { data } = await api.get(
        `/products/${item.productId}`
      );

      const product = data.product;

      if (!product) {
        console.warn(
          `Product ${item.name} is no longer available.`
        );
        continue;
      }

      const currentStock =
        Number(product.stock) || 0;

      if (currentStock <= 0) {
        alert(
          `${item.name} is currently out of stock.`
        );
        continue;
      }

      const quantity = Math.min(
        Number(item.quantity) || 1,
        currentStock
      );

      addToCart({
        _id: product._id,
        name: product.name,
        image:
          product.image ||
          item.image ||
          "/placeholder.jpg",
        price:
          Number(product.discountPrice) ||
          Number(product.price) ||
          Number(item.price) ||
          0,
        stock: currentStock,
        quantity,
        color: item.color || "",
        size: item.size || "",
        colors: product.colors || [],
        sizes: product.sizes || [],
      });
    }

    alert(
      "Available products have been added to your cart!"
    );

    window.location.href = "/cart";
  } catch (error: any) {
    console.error(
      "BUY AGAIN ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to add products to cart."
    );
  }
};
const handleSubmitReview = async (
  productId: string
) => {
  const rating =
    reviewRatings[productId] || 0;

  const comment =
    reviewComments[productId]?.trim() || "";

  if (rating < 1) {
    alert("Please select a rating.");
    return;
  }

  if (!comment) {
    alert("Please write a review.");
    return;
  }

  try {
    setReviewSubmitting((prev) => ({
      ...prev,
      [productId]: true,
    }));

    const { data } = await api.post(
      "/reviews",
      {
        orderId: order._id,
        productId,
        rating,
        comment,
      }
    );

    console.log(
      "REVIEW RESPONSE:",
      data
    );

    alert(
      "Review submitted successfully! It will appear after approval."
    );

    setReviewRatings((prev) => ({
      ...prev,
      [productId]: 0,
    }));

    setReviewComments((prev) => ({
      ...prev,
      [productId]: "",
    }));
  } catch (error: any) {
    console.error(
      "REVIEW ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to submit review."
    );
  } finally {
    setReviewSubmitting((prev) => ({
      ...prev,
      [productId]: false,
    }));
  }
};
  // ============================
  // Loading
  // ============================

  if (loading) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
            <div className="luxury-card p-10 text-center">

              <div className="w-14 h-14 mx-auto border-4 border-[#C78B7B] border-t-transparent rounded-full animate-spin mb-6"></div>

              <h2 className="text-2xl font-semibold">
                Loading Order...
              </h2>

            </div>
          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ============================
  // Order Not Found
  // ============================

  if (!order) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
            <div className="luxury-card p-10 text-center">

              <div className="text-5xl mb-5">
                📦
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Order Not Found
              </h2>

              <p className="text-gray-500 mb-6">
                We couldn't find this order.
              </p>

              <Link
                href="/account/orders"
                className="btn-primary inline-block"
              >
                Back to My Orders
              </Link>

            </div>
          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ============================
  // Tracking Status
  // ============================

  const trackingSteps = [
    {
      key: "Pending",
      title: "Order Placed",
      description:
        "Your order has been received.",
      icon: "🛒",
    },
    {
      key: "Confirmed",
      title: "Confirmed",
      description:
        "Your order has been confirmed.",
      icon: "✓",
    },
    {
      key: "Packed",
      title: "Packed",
      description:
        "Your order has been packed.",
      icon: "📦",
    },
    {
      key: "Shipped",
      title: "Shipped",
      description: order.courierName
        ? `Shipped via ${order.courierName}.`
        : "Your order has been shipped.",
      icon: "🚚",
    },
    {
      key: "Out for Delivery",
      title: "Out for Delivery",
      description:
        "Your order is on the way.",
      icon: "🏍️",
    },
    {
      key: "Delivered",
      title: "Delivered",
      description:
        "Your order has been delivered.",
      icon: "🏠",
    },
  ];

  const statusOrder = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatusIndex =
    statusOrder.indexOf(
      order.orderStatus
    );

  // ============================
  // Status Color
  // ============================

  const getStatusClass = () => {
    switch (order.orderStatus) {
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

  // ============================
  // Main UI
  // ============================

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7] py-12">

          <div className="max-w-6xl mx-auto px-6">

            {/* ============================
                Header
            ============================ */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-8">

              <div>

                <Link
                  href="/account/orders"
                  className="text-sm font-semibold text-[#C78B7B] hover:underline"
                >
                  ← Back to My Orders
                </Link>

                <h1 className="page-title mt-4">
                  Order Details
                </h1>

              </div>

              <span
                className={`w-fit px-5 py-2 rounded-full font-semibold ${getStatusClass()}`}
              >
                {order.orderStatus}
              </span>

            </div>

            {/* ============================
                Order Summary
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="luxury-card p-5 text-center">

                  <div className="text-4xl mb-3">
                    🧾
                  </div>

                  <h3 className="font-semibold">
                    Order ID
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    #{order._id
                      .slice(-8)
                      .toUpperCase()}
                  </p>

                </div>

                <div className="luxury-card p-5 text-center">

                  <div className="text-4xl mb-3">
                    📅
                  </div>

                  <h3 className="font-semibold">
                    Ordered
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
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

                <div className="luxury-card p-5 text-center">

                  <div className="text-4xl mb-3">
                    💳
                  </div>

                  <h3 className="font-semibold">
                    Payment
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.paymentStatus}
                  </p>

                </div>

                <div className="luxury-card p-5 text-center">

                  <div className="text-4xl mb-3">
                    💰
                  </div>

                  <h3 className="font-semibold">
                    Total
                  </h3>

                  <p className="mt-1 font-bold text-[#C78B7B]">
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* ============================
                Tracking
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <div className="flex flex-col gap-2 mb-8">

                <h2 className="text-2xl font-bold">
                  Track Your Order
                </h2>

                <p className="text-gray-500">
                  Follow your order from placement
                  to delivery.
                </p>

              </div>

              {order.orderStatus ===
              "Cancelled" ? (

                <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">

                  <div className="text-5xl mb-4">
                    ❌
                  </div>

                  <h3 className="text-xl font-bold text-red-700">
                    Order Cancelled
                  </h3>

                  <p className="mt-2 text-red-600">
                    This order has been cancelled.
                  </p>

                </div>

              ) : (

                <div>

                  {trackingSteps.map(
                    (
                      step,
                      index
                    ) => {

                      const stepIndex =
                        statusOrder.indexOf(
                          step.key
                        );

                      const completed =
                        stepIndex <=
                        currentStatusIndex;

                      const current =
                        stepIndex ===
                        currentStatusIndex;

                      return (
                        <div
                          key={step.key}
                          className="relative"
                        >

                          <div className="flex gap-5">

                            {/* Circle */}

                            <div
                              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                                completed
                                  ? "bg-[#C78B7B] text-white"
                                  : "bg-gray-200 text-gray-400"
                              } ${
                                current
                                  ? "ring-4 ring-[#C78B7B]/20"
                                  : ""
                              }`}
                            >
                              {completed
                                ? step.icon
                                : "○"}
                            </div>

                            {/* Content */}

                            <div className="flex-1 pb-8">

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <h3
                                  className={`text-lg font-semibold ${
                                    completed
                                      ? "text-[#2E2E2E]"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.title}
                                </h3>

                                {current && (
                                  <span className="w-fit rounded-full bg-[#F4EEE8] px-3 py-1 text-xs font-semibold text-[#C78B7B]">
                                    Current Status
                                  </span>
                                )}

                              </div>

                              <p
                                className={`mt-1 text-sm ${
                                  completed
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.description}
                              </p>

                              {/* Tracking Number */}

                              {step.key ===
                                "Shipped" &&
                                order.trackingNumber && (

                                  <div className="mt-4 rounded-xl bg-[#FCFAF7] border border-[#ECE6E1] p-4">

                                    <p className="text-sm text-gray-500">
                                      Tracking Number
                                    </p>

                                    <p className="mt-1 font-semibold text-[#2E2E2E]">
                                      {
                                        order.trackingNumber
                                      }
                                    </p>

                                  </div>

                                )}

                              {/* Courier */}

                              {step.key ===
                                "Shipped" &&
                                order.courierName && (

                                  <p className="mt-3 text-sm text-gray-500">
                                    Courier:{" "}
                                    <span className="font-semibold text-[#2E2E2E]">
                                      {
                                        order.courierName
                                      }
                                    </span>
                                  </p>

                                )}

                              {/* Estimated Delivery */}

                              {order.estimatedDelivery &&
                                (
                                  step.key ===
                                    "Shipped" ||
                                  step.key ===
                                    "Out for Delivery"
                                ) && (

                                  <p className="mt-3 text-sm font-medium text-[#C78B7B]">
                                    Estimated Delivery:{" "}
                                    {new Date(
                                      order.estimatedDelivery
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )}
                                  </p>

                                )}

                            </div>

                          </div>

                          {/* Connector */}

                          {index <
                            trackingSteps.length -
                              1 && (

                            <div
                              className={`absolute left-[23px] top-12 h-[calc(100%-12px)] border-l-2 ${
                                stepIndex <
                                currentStatusIndex
                                  ? "border-[#C78B7B]"
                                  : "border-gray-200"
                              }`}
                            />

                          )}

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

            {/* ============================
                Ordered Products
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <h2 className="text-2xl font-bold mb-6">
                Ordered Products
              </h2>

              <div className="space-y-5">

                {order.products?.map(
                  (
                    item: any,
                    index: number
                  ) => (

                    <div
                      key={
                        item.productId ||
                        index
                      }
                      className="flex flex-col gap-5 sm:flex-row sm:justify-between py-5 border-b border-[#F4EEE8] last:border-b-0"
                    >

                      <div className="flex items-center gap-5">

                        <img
                          src={
                            item.image ||
                            "/placeholder.jpg"
                          }
                          alt={
                            item.name ||
                            "Product"
                          }
                          className="w-24 h-24 rounded-xl object-cover border border-[#E8E3DC]"
                        />

                        <div>

                          <p className="font-semibold text-lg">
                            {item.name}
                          </p>

                          <p className="text-gray-500 mt-1">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          {item.color && (
                            <p className="text-sm text-gray-500 mt-1">
                              Color:{" "}
                              {item.color}
                            </p>
                          )}

                          {item.size && (
                            <p className="text-sm text-gray-500 mt-1">
                              Size:{" "}
                              {item.size}
                            </p>
                          )}

                          <p className="text-[#C78B7B] font-semibold mt-2">
                            ₹
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-sm text-gray-500">
                          Subtotal
                        </p>

                        <p className="text-lg font-bold text-[#2E2E2E]">
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
                        </p>

                                          </div>

                      {/* ============================
                          Product Review
                      ============================ */}

                      {order.orderStatus === "Delivered" && (
                        <div className="mt-5 rounded-2xl bg-[#FCFAF7] border border-[#ECE6E1] p-5">

                          <h3 className="font-semibold text-lg text-[#2E2E2E]">
                            ⭐ Review this product
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            How was your purchase?
                          </p>

                          {/* Rating */}

                          <div className="mt-4 flex gap-2">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setReviewRatings(
                                      (prev) => ({
                                        ...prev,
                                        [item.productId]:
                                          star,
                                      })
                                    )
                                  }
                                  className={`text-3xl transition ${
                                    (reviewRatings[
                                      item.productId
                                    ] || 0) >= star
                                      ? "text-[#D6B36A]"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </button>
                              )
                            )}

                          </div>

                          {/* Comment */}

                          <textarea
                            value={
                              reviewComments[
                                item.productId
                              ] || ""
                            }
                            onChange={(e) =>
                              setReviewComments(
                                (prev) => ({
                                  ...prev,
                                  [item.productId]:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="Write your review..."
                            rows={4}
                            className="mt-4 w-full rounded-xl border border-[#E8E3DC] bg-white p-4 outline-none focus:border-[#C78B7B]"
                          />

                          {/* Submit */}

                          <button
                            type="button"
                            disabled={
                              reviewSubmitting[
                                item.productId
                              ]
                            }
                            onClick={() =>
                              handleSubmitReview(
                                item.productId
                              )
                            }
                            className="mt-4 rounded-full bg-[#3A2528] px-6 py-3 font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {reviewSubmitting[
                              item.productId
                            ]
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>

                        </div>
                      )}

                    </div>

                  )
                )}

              </div>

            </div>

            {/* ============================
                Shipping Address
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <h2 className="text-2xl font-bold mb-5">
                Shipping Address
              </h2>

              <div className="space-y-1 text-gray-600">

                <p className="font-semibold text-[#2E2E2E]">
                  {order.customerName}
                </p>

                <p>
                  {order.phone}
                </p>

                {order.email && (
                  <p>
                    {order.email}
                  </p>
                )}

                <p className="mt-3">
                  {order.address}
                </p>

                <p>
                  {order.city},{" "}
                  {order.state}
                </p>

                <p>
                  {order.pincode}
                </p>

              </div>

            </div>

            {/* ============================
                Delivery Information
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <h2 className="text-2xl font-bold mb-5">
                Delivery Information
              </h2>

              <div className="space-y-4">

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                  <span className="text-gray-500">
                    🚚 Courier
                  </span>

                  <strong>
                    {order.courierName ||
                      "Not Assigned"}
                  </strong>

                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                  <span className="text-gray-500">
                    📦 Tracking Number
                  </span>

                  <strong>
                    {order.trackingNumber ||
                      "Not Available"}
                  </strong>

                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                  <span className="text-gray-500">
                    📅 Estimated Delivery
                  </span>

                  <strong>
                    {order.estimatedDelivery
                      ? new Date(
                          order.estimatedDelivery
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "To Be Updated"}
                  </strong>

                </div>

              </div>

            </div>

            {/* ============================
                Payment Details
            ============================ */}

            <div className="luxury-card p-8 mb-8">

              <h2 className="text-2xl font-bold mb-5">
                Payment Details
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="font-semibold">
                    {order.paymentMethod}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span
                    className={`font-semibold ${
                      order.paymentStatus ===
                      "Paid"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>

                </div>

                {order.razorpayPaymentId && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

                    <span className="text-gray-500">
                      Payment ID
                    </span>

                    <span className="font-mono text-sm">
                      {
                        order.razorpayPaymentId
                      }
                    </span>

                  </div>
                )}

              </div>

            </div>

            {/* ============================
    Total + Actions
============================ */}

<div className="luxury-card p-8 mb-8">

  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

    <div>

      <p className="text-gray-500">
        Total Amount
      </p>

      <p className="text-3xl font-bold text-[#C78B7B]">
        ₹
        {Number(
          order.totalAmount
        ).toLocaleString("en-IN")}
      </p>

    </div>

    <div className="flex flex-wrap gap-3">

      <Link
        href="/account/orders"
        className="btn-secondary"
      >
        Back to Orders
      </Link>

      <button
        type="button"
        className="btn-primary"
        onClick={() => window.print()}
      >
        Download Invoice
      </button>

      {/* Cancel Order */}

      {(order.orderStatus === "Pending" ||
        order.orderStatus === "Confirmed") && (
        <button
          type="button"
          onClick={handleCancelOrder}
          className="rounded-full border border-red-300 bg-red-50 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          Cancel Order
        </button>
      )}

      {/* Buy Again */}

      {order.orderStatus === "Delivered" && (
        <button
          type="button"
          onClick={handleBuyAgain}
          className="rounded-full bg-[#C78B7B] px-6 py-3 font-semibold text-white transition hover:bg-[#A96F62]"
        >
          🛒 Buy Again
        </button>
      )}

    </div>

  </div>

</div>
            {/* ============================
                Delivered CTA
            ============================ */}

            {order.orderStatus ===
              "Delivered" && (

              <div className="luxury-card p-8 mb-8 text-center">

                <div className="text-5xl mb-4">
                  🎉
                </div>

                <h2 className="text-2xl font-bold text-[#2E2E2E]">
                  Your order has been delivered!
                </h2>

                <p className="mt-2 text-gray-500">
                  We hope you love your jewellery.
                </p>

                <div className="mt-6">

                  <Link
                    href="/share-your-look"
                    className="btn-primary inline-block"
                  >
                    ✨ Share Your Look
                  </Link>

                </div>

              </div>

            )}

          </div>

        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}