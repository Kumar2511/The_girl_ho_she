"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  CreditCard,
  Download,
  FileText,
  MapPin,
  Package,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
  XCircle,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCart } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import api from "@/lib/api";
import Toast from "@/components/toast";

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
  razorpayPaymentId?: string;

  orderStatus?: string;

  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

type CancellationFeedback = {
  reason: string;
  comment: string;
};

const cancellationReasons = [
  "Changed my mind",
  "Found a better price",
  "Delivery time is too long",
  "Product no longer needed",
  "Payment issue",
  "Ordered by mistake",
  "Other",
];

export default function OrderDetailsPage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const { addToCart } = useCart();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [reviewRatings, setReviewRatings] =
    useState<Record<string, number>>({});

  const [reviewComments, setReviewComments] =
    useState<Record<string, string>>({});

  const [reviewSubmitting, setReviewSubmitting] =
    useState<Record<string, boolean>>({});

  const [cancelling, setCancelling] =
    useState(false);

  const [buyingAgain, setBuyingAgain] =
    useState(false);

  const [toast, setToast] =
    useState<{
      message: string;
      type: "success" | "error";
    } | null>(null);

  const [showCancellationFeedback, setShowCancellationFeedback] =
    useState(false);

  const [cancellationFeedback, setCancellationFeedback] =
    useState<CancellationFeedback>({
      reason: "",
      comment: "",
    });

  const [submittingCancellationFeedback, setSubmittingCancellationFeedback] =
    useState(false);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // ==========================================
  // CANCELLATION FEEDBACK
  // ==========================================

  const closeCancellationFeedback = () => {
    if (submittingCancellationFeedback) return;

    setShowCancellationFeedback(false);

    setCancellationFeedback({
      reason: "",
      comment: "",
    });
  };

  const handleSubmitCancellationFeedback = async () => {
    if (!order?._id || submittingCancellationFeedback) {
      return;
    }

    if (!cancellationFeedback.reason) {
      setToast({
        type: "error",
        message: "Please select a reason for cancelling your order.",
      });
      return;
    }

    try {
      setSubmittingCancellationFeedback(true);

      await api.post(
        `/orders/my-orders/${order._id}/cancellation-feedback`,
        {
          reason: cancellationFeedback.reason,
          comment: cancellationFeedback.comment.trim(),
        }
      );

      setShowCancellationFeedback(false);

      setCancellationFeedback({
        reason: "",
        comment: "",
      });

      setToast({
        type: "success",
        message: "Thank you. Your feedback helps us improve.",
      });
    } catch (error: any) {
      console.error(
        "CANCELLATION FEEDBACK ERROR:",
        error
      );

      setToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "We couldn't save your feedback. Please try again.",
      });
    } finally {
      setSubmittingCancellationFeedback(false);
    }
  };

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid order ID.");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } =
          await api.get(
            `/orders/my-orders/${id}`
          );

        console.log(
          "ORDER DETAILS:",
          data
        );

        if (!data?.order) {
          setError(
            "We couldn't find this order."
          );
          return;
        }

        setOrder(data.order);
      } catch (error: any) {
        console.error(
          "ORDER DETAILS ERROR:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ==========================================
  // COPY ORDER ID
  // ==========================================

  const handleCopyOrderId = async () => {
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
        "Copy order ID failed:",
        error
      );
    }
  };

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = async () => {
    if (!order || cancelling) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const { data } =
        await api.put(
          `/orders/my-orders/${order._id}/cancel`
        );

      console.log(
        "CANCEL ORDER RESPONSE:",
        data
      );

      setOrder(data.order);

      setToast({
        type: "success",
        message: "Your order has been cancelled successfully.",
      });

      setShowCancellationFeedback(true);
    } catch (error: any) {
      console.error(
        "CANCEL ORDER ERROR:",
        error
      );

      setToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to cancel order.",
      });
    } finally {
      setCancelling(false);
    }
  };

  // ==========================================
  // BUY AGAIN
  // ==========================================

  const handleBuyAgain = async () => {
    if (
      !order?.products?.length ||
      buyingAgain
    ) {
      return;
    }

    try {
      setBuyingAgain(true);

      let addedCount = 0;

      for (const item of order.products) {
        if (!item.productId) {
          console.warn(
            `Product ID missing for ${item.name}`
          );
          continue;
        }

        try {
          const { data } =
            await api.get(
              `/products/${item.productId}`
            );

          const product =
            data?.product;

          if (!product) {
            console.warn(
              `Product ${item.name} is no longer available.`
            );
            continue;
          }

          const currentStock =
            Number(product.stock) || 0;

          if (currentStock <= 0) {
            console.warn(
              `${item.name} is currently out of stock.`
            );
            continue;
          }

          const quantity =
            Math.min(
              Number(item.quantity) || 1,
              currentStock
            );

          addToCart({
            _id: product._id,
            name: product.name,
            image:
              product.images?.[0] ||
              product.image ||
              item.image ||
              "/placeholder.jpg",
            price:
              Number(
                product.discountPrice
              ) ||
              Number(product.price) ||
              Number(item.price) ||
              0,
            stock: currentStock,
            quantity,
            color: item.color || "",
            size: item.size || "",
            colors:
              product.colors || [],
            sizes:
              product.sizes || [],
          });

          addedCount++;
        } catch (productError) {
          console.error(
            `Failed to load ${item.name}:`,
            productError
          );
        }
      }

      if (addedCount === 0) {
        setToast({
          type: "error",
          message:
            "None of the products from this order are currently available.",
        });
        return;
      }

      setToast({
        type: "success",
        message: `${addedCount} product${
          addedCount > 1 ? "s" : ""
        } added to your cart.`,
      });

      window.location.href =
        "/cart";
    } catch (error: any) {
      console.error(
        "BUY AGAIN ERROR:",
        error
      );

      setToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to add products to cart.",
      });
    } finally {
      setBuyingAgain(false);
    }
  };

  // ==========================================
  // REVIEW
  // ==========================================

  const handleSubmitReview = async (
    productId: string
  ) => {
    const rating =
      reviewRatings[productId] || 0;

    const comment =
      reviewComments[productId]?.trim() ||
      "";

    if (rating < 1) {
      setToast({
        type: "error",
        message: "Please select a rating.",
      });
      return;
    }

    if (!comment) {
      setToast({
        type: "error",
        message: "Please write a review.",
      });
      return;
    }

    try {
      setReviewSubmitting(
        (prev) => ({
          ...prev,
          [productId]: true,
        })
      );

      const { data } =
        await api.post(
          "/reviews",
          {
            orderId: order?._id,
            productId,
            rating,
            comment,
          }
        );

      console.log(
        "REVIEW RESPONSE:",
        data
      );

      setToast({
        type: "success",
        message:
          "Review submitted successfully! It will appear after approval.",
      });

      setReviewRatings(
        (prev) => ({
          ...prev,
          [productId]: 0,
        })
      );

      setReviewComments(
        (prev) => ({
          ...prev,
          [productId]: "",
        })
      );
    } catch (error: any) {
      console.error(
        "REVIEW ERROR:",
        error
      );

      setToast({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to submit review.",
      });
    } finally {
      setReviewSubmitting(
        (prev) => ({
          ...prev,
          [productId]: false,
        })
      );
    }
  };

  // ==========================================
  // TRACKING
  // ==========================================

  const trackingSteps = [
    {
      key: "Pending",
      title: "Order Placed",
      description:
        "Your order has been received.",
      icon: ShoppingBag,
    },
    {
      key: "Confirmed",
      title: "Confirmed",
      description:
        "Your order has been confirmed.",
      icon: CheckCircle2,
    },
    {
      key: "Packed",
      title: "Packed",
      description:
        "Your jewellery has been carefully packed.",
      icon: Package,
    },
    {
      key: "Shipped",
      title: "Shipped",
      description: order?.courierName
        ? `Shipped via ${order.courierName}.`
        : "Your order has been shipped.",
      icon: Truck,
    },
    {
      key: "Out for Delivery",
      title: "Out for Delivery",
      description:
        "Your order is on the way.",
      icon: Truck,
    },
    {
      key: "Delivered",
      title: "Delivered",
      description:
        "Your jewellery has been delivered.",
      icon: Check,
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
      order?.orderStatus || "Pending"
    );

  const getStatusStyle = (
    status?: string
  ) => {
    switch (status) {
      case "Delivered":
        return "bg-[#F1F7EF] text-[#5D7D57] border-[#DCE8D8]";

      case "Shipped":
        return "bg-[#F0F5FA] text-[#55738E] border-[#D9E4ED]";

      case "Out for Delivery":
        return "bg-[#F6F1FA] text-[#765B88] border-[#E5DAEC]";

      case "Packed":
        return "bg-[#F2F2FA] text-[#62658B] border-[#DEDFEC]";

      case "Confirmed":
        return "bg-[#F1F8F3] text-[#52775D] border-[#D8E8DD]";

      case "Cancelled":
        return "bg-[#FFF2F1] text-[#A45D5D] border-[#F0D8D5]";

      default:
        return "bg-[#FFF8EC] text-[#99743E] border-[#F0E1C6]";
    }
  };

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
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="min-h-screen bg-[#FCFAF7] px-4 py-16">

            <div className="mx-auto max-w-6xl animate-pulse">

              <div className="h-4 w-32 rounded bg-[#EDE5DF]" />

              <div className="mt-5 h-10 w-64 rounded bg-[#EDE5DF]" />

              <div className="mt-8 h-48 rounded-3xl bg-white" />

              <div className="mt-6 h-72 rounded-3xl bg-white" />

              <div className="mt-6 h-80 rounded-3xl bg-white" />

            </div>

          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (error || !order) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="flex min-h-[75vh] items-center justify-center bg-[#FCFAF7] px-4 py-16">

            <div className="w-full max-w-lg rounded-3xl border border-[#E8DFD9] bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F0EC]">

                <Package
                  size={34}
                  className="text-[#C78B7B]"
                />

              </div>

              <h1 className="mt-6 font-serif text-3xl text-[#2E2E2E]">
                Order Not Found
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#777]">
                {error ||
                  "We couldn't find this order."}
              </p>

              <Link
                href="/account/orders"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#3A2528] px-7 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                <ArrowLeft
                  size={15}
                />
                Back to My Orders
              </Link>

            </div>

          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7]">

          {/* HEADER */}

          <section className="border-b border-[#EAE1DB] bg-white">

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#C78B7B] transition hover:text-[#9E6559]"
              >
                <ArrowLeft
                  size={14}
                />
                Back to My Orders
              </Link>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C78B7B]">
                    Your Purchase
                  </p>

                  <h1 className="mt-2 font-serif text-4xl font-semibold text-[#2E2E2E] sm:text-5xl">
                    Order Details
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3">

                    <span className="font-mono text-xs text-[#777]">
                      #{order._id}
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleCopyOrderId
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-[#E2D8D2] px-2.5 py-1 text-[10px] font-semibold text-[#777] transition hover:bg-[#FCF8F5]"
                    >
                      {copied ? (
                        <>
                          <Check
                            size={11}
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy
                            size={11}
                          />
                          Copy ID
                        </>
                      )}
                    </button>

                  </div>

                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-semibold ${getStatusStyle(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus ||
                    "Processing"}
                </span>

              </div>

            </div>

          </section>

          {/* CONTENT */}

          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

            {/* SUMMARY */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                  <FileText
                    size={18}
                    className="text-[#C78B7B]"
                  />
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#999]">
                  Order Date
                </p>

                <p className="mt-1 text-sm font-semibold text-[#3D3632]">
                  {formatDate(
                    order.createdAt
                  )}
                </p>

              </div>

              <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                  <CreditCard
                    size={18}
                    className="text-[#C78B7B]"
                  />
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#999]">
                  Payment
                </p>

                <p className="mt-1 text-sm font-semibold text-[#3D3632]">
                  {order.paymentMethod ||
                    "—"}
                </p>

                <p className="mt-1 text-xs text-green-600">
                  {order.paymentStatus ||
                    "Pending"}
                </p>

              </div>

              <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                  <ShoppingBag
                    size={18}
                    className="text-[#C78B7B]"
                  />
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#999]">
                  Items
                </p>

                <p className="mt-1 text-sm font-semibold text-[#3D3632]">
                  {order.products?.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.quantity ||
                          0
                      ),
                    0
                  ) || 0}{" "}
                  item(s)
                </p>

              </div>

              <div className="rounded-2xl border border-[#E8DFD9] bg-white p-5 shadow-sm">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                  <CreditCard
                    size={18}
                    className="text-[#C78B7B]"
                  />
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#999]">
                  Total
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

            </div>

            {/* TRACKING */}

            <div className="mt-6 rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col gap-2">

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Order Journey
                </p>

                <h2 className="font-serif text-3xl text-[#2E2E2E]">
                  Track Your Order
                </h2>

                <p className="text-sm text-[#777]">
                  Follow your jewellery from
                  confirmation to delivery.
                </p>

              </div>

              {order.orderStatus ===
              "Cancelled" ? (
                <div className="mt-8 rounded-2xl border border-[#F0D8D5] bg-[#FFF6F5] p-8 text-center">

                  <XCircle
                    size={42}
                    className="mx-auto text-[#B65E5E]"
                  />

                  <h3 className="mt-4 font-serif text-2xl text-[#9B5151]">
                    Order Cancelled
                  </h3>

                  <p className="mt-2 text-sm text-[#A66B6B]">
                    This order has been
                    cancelled.
                  </p>

                </div>
              ) : (
                <div className="mt-9">

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
                        currentStatusIndex >=
                        stepIndex;

                      const current =
                        currentStatusIndex ===
                        stepIndex;

                      const StepIcon =
                        step.icon;

                      return (
                        <div
                          key={
                            step.key
                          }
                          className="relative"
                        >

                          <div className="flex gap-4 sm:gap-6">

                            <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition sm:h-12 sm:w-12">

                              <div
                                className={`flex h-full w-full items-center justify-center rounded-full ${
                                  completed
                                    ? "bg-[#3A2528] text-white"
                                    : "bg-[#F3EFEC] text-[#AAA19C]"
                                } ${
                                  current
                                    ? "ring-4 ring-[#C78B7B]/15"
                                    : ""
                                }`}
                              >
                                {completed ? (
                                  <StepIcon
                                    size={
                                      18
                                    }
                                  />
                                ) : (
                                  <span className="text-xs">
                                    {index +
                                      1}
                                  </span>
                                )}
                              </div>

                            </div>

                            <div className="flex-1 pb-8">

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <h3
                                  className={`font-semibold ${
                                    completed
                                      ? "text-[#2E2E2E]"
                                      : "text-[#A8A09B]"
                                  }`}
                                >
                                  {
                                    step.title
                                  }
                                </h3>

                                {current && (
                                  <span className="w-fit rounded-full bg-[#F8F0EC] px-3 py-1 text-[10px] font-semibold text-[#C78B7B]">
                                    Current Status
                                  </span>
                                )}

                              </div>

                              <p
                                className={`mt-1 text-sm ${
                                  completed
                                    ? "text-[#777]"
                                    : "text-[#AAA]"
                                }`}
                              >
                                {
                                  step.description
                                }
                              </p>

                              {step.key ===
                                "Shipped" &&
                                order.trackingNumber && (
                                  <div className="mt-4 rounded-xl border border-[#E8DFD9] bg-[#FCFAF7] p-4">

                                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#999]">
                                      Tracking Number
                                    </p>

                                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#3A2528]">
                                      {
                                        order.trackingNumber
                                      }
                                    </p>

                                  </div>
                                )}

                              {step.key ===
                                "Shipped" &&
                                order.courierName && (
                                  <p className="mt-3 text-xs text-[#777]">
                                    Courier:{" "}
                                    <strong className="text-[#3A2528]">
                                      {
                                        order.courierName
                                      }
                                    </strong>
                                  </p>
                                )}

                              {(step.key ===
                                "Shipped" ||
                                step.key ===
                                  "Out for Delivery") &&
                                order.estimatedDelivery && (
                                  <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#C78B7B]">
                                    <CalendarDays
                                      size={
                                        13
                                      }
                                    />
                                    Estimated
                                    Delivery:{" "}
                                    {formatDate(
                                      order.estimatedDelivery
                                    )}
                                  </p>
                                )}

                            </div>

                          </div>

                          {index <
                            trackingSteps.length -
                              1 && (
                            <div
                              className={`absolute left-[22px] top-12 h-[calc(100%-12px)] w-px ${
                                stepIndex <
                                currentStatusIndex
                                  ? "bg-[#3A2528]"
                                  : "bg-[#E5DDD8]"
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

            {/* PRODUCTS */}

            <div className="mt-6 rounded-3xl border border-[#E8DFD9] bg-white shadow-sm">

              <div className="border-b border-[#EEE6E1] px-6 py-6 sm:px-8">

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Your Jewellery
                </p>

                <h2 className="mt-1 font-serif text-3xl text-[#2E2E2E]">
                  Ordered Products
                </h2>

              </div>

              <div className="divide-y divide-[#EEE6E1] px-6 sm:px-8">

                {order.products?.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item.productId || item.name}-${index}`}
                      className="py-6"
                    >

                      <div className="flex flex-col gap-5 sm:flex-row">

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#E8DFD9] bg-[#FAF7F4] sm:h-28 sm:w-28">

                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={112}
                              height={112}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag
                                size={
                                  24
                                }
                                className="text-[#C8B8AF]"
                              />
                            </div>
                          )}

                        </div>

                        <div className="flex-1">

                          <h3 className="font-serif text-xl text-[#2E2E2E]">
                            {
                              item.name
                            }
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-2">

                            <span className="rounded-full bg-[#F8F3EF] px-3 py-1 text-[10px] text-[#777]">
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </span>

                            {item.color && (
                              <span className="rounded-full bg-[#F8F3EF] px-3 py-1 text-[10px] text-[#777]">
                                Color:{" "}
                                {
                                  item.color
                                }
                              </span>
                            )}

                            {item.size && (
                              <span className="rounded-full bg-[#F8F3EF] px-3 py-1 text-[10px] text-[#777]">
                                Size:{" "}
                                {
                                  item.size
                                }
                              </span>
                            )}

                          </div>

                          <p className="mt-4 text-sm text-[#777]">
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

                        <div className="text-left sm:text-right">

                          <p className="text-[10px] uppercase tracking-[0.15em] text-[#999]">
                            Subtotal
                          </p>

                          <p className="mt-1 font-serif text-xl font-semibold text-[#3A2528]">
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

                        </div>

                      </div>

                      {/* REVIEW */}

                      {order.orderStatus ===
                        "Delivered" &&
                        item.productId && (
                          <div className="mt-6 rounded-2xl border border-[#E8DFD9] bg-[#FCFAF7] p-5">

                            <div className="flex items-center gap-2">

                              <Star
                                size={17}
                                className="fill-[#D6B36A] text-[#D6B36A]"
                              />

                              <h4 className="font-semibold text-[#2E2E2E]">
                                Review this product
                              </h4>

                            </div>

                            <p className="mt-1 text-xs text-[#888]">
                              How was your
                              purchase?
                            </p>

                            <div className="mt-4 flex gap-1">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <button
                                    key={
                                      star
                                    }
                                    type="button"
                                    onClick={() =>
                                      setReviewRatings(
                                        (
                                          prev
                                        ) => ({
                                          ...prev,
                                          [item.productId!]:
                                            star,
                                        })
                                      )
                                    }
                                    className="transition hover:scale-110"
                                    aria-label={`Rate ${star} star`}
                                  >
                                    <Star
                                      size={
                                        25
                                      }
                                      className={
                                        (
                                          reviewRatings[
                                            item
                                              .productId!
                                          ] ||
                                          0
                                        ) >=
                                        star
                                          ? "fill-[#D6B36A] text-[#D6B36A]"
                                          : "text-[#D2CBC6]"
                                      }
                                    />
                                  </button>
                                )
                              )}

                            </div>

                            <textarea
                              value={
                                reviewComments[
                                  item.productId
                                ] ||
                                ""
                              }
                              onChange={(e) =>
                                setReviewComments(
                                  (
                                    prev
                                  ) => ({
                                    ...prev,
                                    [item.productId!]:
                                      e.target
                                        .value,
                                  })
                                )
                              }
                              placeholder="Share your experience with this jewellery..."
                              rows={4}
                              className="mt-4 w-full resize-none rounded-xl border border-[#E2D9D3] bg-white p-4 text-sm text-[#333] outline-none transition placeholder:text-[#AAA] focus:border-[#C78B7B]"
                            />

                            <button
                              type="button"
                              disabled={
                                reviewSubmitting[
                                  item.productId
                                ]
                              }
                              onClick={() =>
                                handleSubmitReview(
                                  item.productId!
                                )
                              }
                              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#3A2528] px-6 text-xs font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* TWO COLUMN INFORMATION */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* SHIPPING */}

              <div className="rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">

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

                <div className="mt-6 rounded-2xl bg-[#FCFAF7] p-5 text-sm leading-6 text-[#706762]">

                  <p className="font-semibold text-[#3D3632]">
                    {order.customerName ||
                      "Customer"}
                  </p>

                  {order.phone && (
                    <p className="mt-1">
                      {order.phone}
                    </p>
                  )}

                  {order.email && (
                    <p className="break-all">
                      {order.email}
                    </p>
                  )}

                  <div className="my-4 h-px bg-[#E7DDD7]" />

                  <p>
                    {order.address ||
                      "—"}
                  </p>

                  <p>
                    {order.city ||
                      "—"}
                    ,{" "}
                    {order.state ||
                      "—"}
                  </p>

                  <p>
                    {order.pincode ||
                      "—"}
                  </p>

                </div>

              </div>

              {/* DELIVERY */}

              <div className="rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                    <Truck
                      size={18}
                      className="text-[#C78B7B]"
                    />
                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                      Delivery
                    </p>

                    <h2 className="font-serif text-2xl text-[#2E2E2E]">
                      Delivery Information
                    </h2>

                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  <div className="flex justify-between gap-4 border-b border-[#EEE6E1] pb-4">

                    <span className="text-sm text-[#777]">
                      Courier
                    </span>

                    <span className="text-right text-sm font-semibold text-[#3D3632]">
                      {order.courierName ||
                        "Not Assigned"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 border-b border-[#EEE6E1] pb-4">

                    <span className="text-sm text-[#777]">
                      Tracking Number
                    </span>

                    <span className="break-all text-right font-mono text-xs font-semibold text-[#3D3632]">
                      {order.trackingNumber ||
                        "Not Available"}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#777]">
                      Estimated Delivery
                    </span>

                    <span className="text-right text-sm font-semibold text-[#3D3632]">
                      {formatDate(
                        order.estimatedDelivery
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="mt-6 rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                  <CreditCard
                    size={18}
                    className="text-[#C78B7B]"
                  />
                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                    Payment
                  </p>

                  <h2 className="font-serif text-2xl text-[#2E2E2E]">
                    Payment Details
                  </h2>

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-xl bg-[#FCFAF7] p-4">

                  <p className="text-[10px] uppercase tracking-wide text-[#999]">
                    Method
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#3D3632]">
                    {order.paymentMethod ||
                      "—"}
                  </p>

                </div>

                <div className="rounded-xl bg-[#FCFAF7] p-4">

                  <p className="text-[10px] uppercase tracking-wide text-[#999]">
                    Status
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      order.paymentStatus ===
                      "Paid"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus ||
                      "Pending"}
                  </p>

                </div>

                {order.razorpayPaymentId && (
                  <div className="rounded-xl bg-[#FCFAF7] p-4">

                    <p className="text-[10px] uppercase tracking-wide text-[#999]">
                      Payment ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#3D3632]">
                      {
                        order.razorpayPaymentId
                      }
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* TOTAL + ACTIONS */}

            <div className="mt-6 rounded-3xl border border-[#E8DFD9] bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#999]">
                    Total Amount
                  </p>

                  <p className="mt-1 font-serif text-4xl font-semibold text-[#3A2528]">
                    ₹
                    {Number(
                      order.totalAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <Link
                    href="/account/orders"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#DCCFC8] px-5 text-xs font-semibold text-[#3A2528] transition hover:bg-[#FCF8F5]"
                  >
                    <ArrowLeft
                      size={14}
                    />
                    Back to Orders
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      window.print()
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#DCCFC8] px-5 text-xs font-semibold text-[#3A2528] transition hover:bg-[#FCF8F5]"
                  >
                    <Download
                      size={14}
                    />
                    Print / Save Invoice
                  </button>

                  {(
                    [
                      "Pending",
                      "Confirmed",
                    ] as string[]
                  ).includes(
                    order.orderStatus ||
                      ""
                  ) && (
                    <button
                      type="button"
                      onClick={
                        handleCancelOrder
                      }
                      disabled={
                        cancelling
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E5BABA] bg-[#FFF5F4] px-5 text-xs font-semibold text-[#A65B5B] transition hover:bg-[#A65B5B] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle
                        size={14}
                      />

                      {cancelling
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}

                  {order.orderStatus ===
                    "Delivered" && (
                    <button
                      type="button"
                      onClick={
                        handleBuyAgain
                      }
                      disabled={
                        buyingAgain
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-5 text-xs font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw
                        size={14}
                      />

                      {buyingAgain
                        ? "Adding..."
                        : "Buy Again"}
                    </button>
                  )}

                </div>

              </div>

            </div>

            {/* DELIVERED CTA */}

            {order.orderStatus ===
              "Delivered" && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-[#E6DDD7] bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F8F2]">

                  <CheckCircle2
                    size={32}
                    className="text-[#6E8965]"
                  />

                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Delivered With Care
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                  We hope you love your jewellery.
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#777]">
                  Share your jewellery look
                  with us and become part of
                  our community.
                </p>

                <Link
                  href="/share-your-look"
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-7 text-xs font-semibold text-white transition hover:bg-[#29181B]"
                >
                  Share Your Look
                  <ChevronRight
                    size={14}
                  />
                </Link>

              </div>
            )}

          </section>

        </main>

        {/* CANCELLATION FEEDBACK MODAL */}

        {showCancellationFeedback && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancellation-feedback-title"
          >
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E8DFD9] bg-white shadow-[0_25px_80px_rgba(45,25,20,0.25)]">
              <div className="p-6 sm:p-8">

                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F8F2]">
                    <CheckCircle2
                      size={32}
                      className="text-[#6E8965]"
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                    Order Cancelled
                  </p>

                  <h2
                    id="cancellation-feedback-title"
                    className="mt-2 font-serif text-3xl text-[#2E2E2E] sm:text-4xl"
                  >
                    Your order has been cancelled
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777]">
                    We're sorry to see this order go. If you have a
                    moment, we'd love to know what made you cancel.
                  </p>
                </div>

                <div className="mt-7">
                  <label className="block text-sm font-semibold text-[#3D3632]">
                    What was the reason for cancelling?
                  </label>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {cancellationReasons.map((reason) => {
                      const selected =
                        cancellationFeedback.reason === reason;

                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() =>
                            setCancellationFeedback((prev) => ({
                              ...prev,
                              reason,
                            }))
                          }
                          className={`flex min-h-11 items-center rounded-xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-[#C78B7B] bg-[#FCF4F0] font-semibold text-[#3A2528]"
                              : "border-[#E2D9D3] bg-white text-[#6F6661] hover:border-[#C78B7B] hover:bg-[#FCFAF8]"
                          }`}
                          aria-pressed={selected}
                        >
                          <span
                            className={`mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-[#C78B7B]"
                                : "border-[#CFC5BF]"
                            }`}
                          >
                            {selected && (
                              <span className="h-2 w-2 rounded-full bg-[#C78B7B]" />
                            )}
                          </span>

                          {reason}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="cancellation-comment"
                    className="block text-sm font-semibold text-[#3D3632]"
                  >
                    Additional feedback
                    <span className="ml-1 font-normal text-[#999]">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="cancellation-comment"
                    value={cancellationFeedback.comment}
                    onChange={(e) =>
                      setCancellationFeedback((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Tell us what happened or how we could improve..."
                    rows={4}
                    maxLength={500}
                    className="mt-3 w-full resize-none rounded-2xl border border-[#E2D9D3] bg-white p-4 text-sm text-[#333] outline-none transition placeholder:text-[#AAA] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                  />

                  <p className="mt-1 text-right text-[11px] text-[#999]">
                    {cancellationFeedback.comment.length}/500
                  </p>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCancellationFeedback}
                    disabled={submittingCancellationFeedback}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#DCCFC8] px-6 text-xs font-semibold text-[#3A2528] transition hover:bg-[#FCF8F5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Maybe Later
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitCancellationFeedback}
                    disabled={submittingCancellationFeedback}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-6 text-xs font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingCancellationFeedback ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>

                <p className="mt-4 text-center text-[11px] leading-5 text-[#9A8E88]">
                  Your feedback is optional and will only be used to
                  improve our shopping experience.
                </p>
              </div>
            </div>
          </div>
        )}

        <Footer />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      </>
    </ProtectedRoute>
  );
}