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
  XCircle,
  AlertTriangle,
  X,
  ShieldAlert,
} from "lucide-react";

import api from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/utils";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellationWindowHours, setCancellationWindowHours] = useState(24);
  const [statusFilter, setStatusFilter] = useState<"All" | "Delivered" | "Pending" | "Cancelled">("All");

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersRes, shippingRes] = await Promise.all([
          api.get("/orders/my-orders"),
          api.get("/shipping").catch(() => ({ data: {} })),
        ]);

        setOrders(Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : []);

        if (shippingRes.data?.settings?.cancellationWindowHours) {
          setCancellationWindowHours(Number(shippingRes.data.settings.cancellationWindowHours));
        }
      } catch (err: any) {
        console.error("MY ORDERS ERROR:", err);
        setError(err?.response?.data?.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    try {
      setCancelling(true);
      const res = await api.put(`/orders/my-orders/${cancellingOrder._id}/cancel`);
      showToast(res.data?.message || "Order cancelled successfully.", "success");
      
      // Update local order list
      setOrders((prev) =>
        prev.map((o) =>
          o._id === cancellingOrder._id ? { ...o, orderStatus: "Cancelled" } : o
        )
      );
      setCancellingOrder(null);
    } catch (err: any) {
      console.error("Cancel Order Error:", err);
      const msg = err?.response?.data?.message || "Failed to cancel order. Please try again.";
      showToast(msg, "error");
    } finally {
      setCancelling(false);
    }
  };

  const isWithinCancellationWindow = (createdAt: string) => {
    if (!createdAt) return false;
    const orderTime = new Date(createdAt).getTime();
    const hoursElapsed = (Date.now() - orderTime) / (1000 * 60 * 60);
    return hoursElapsed <= cancellationWindowHours;
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "Delivered":
        return {
          label: "Delivered",
          className: "bg-[#F1F7EF] text-[#5E7D57] border-[#DCE8D8]",
          icon: CheckCircle2,
        };
      case "Shipped":
        return {
          label: "Shipped",
          className: "bg-[#F0F5FA] text-[#54718C] border-[#D9E4ED]",
          icon: Truck,
        };
      case "Out for Delivery":
        return {
          label: "Out for Delivery",
          className: "bg-[#F6F1FA] text-[#765B88] border-[#E6DAEC]",
          icon: Truck,
        };
      case "Packed":
        return {
          label: "Packed",
          className: "bg-[#F2F2FA] text-[#62658B] border-[#DEDFEC]",
          icon: Package,
        };
      case "Confirmed":
        return {
          label: "Confirmed",
          className: "bg-[#F1F8F3] text-[#52775D] border-[#D8E8DD]",
          icon: CheckCircle2,
        };
      case "Cancelled":
        return {
          label: "Cancelled",
          className: "bg-[#FFF2F1] text-[#A45D5D] border-[#F0D8D5]",
          icon: XCircle,
        };
      default:
        return {
          label: status || "Processing",
          className: "bg-[#FAF4F0] text-[#CB8161] border-[#E8DFD9]",
          icon: Clock3,
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTotalItems = (products?: OrderProduct[]) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const totalOrdersCount = orders.length;
  const totalProductsCount = orders.reduce(
    (sum, o) => sum + getTotalItems(o.products),
    0
  );
  const deliveredOrdersCount = orders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
  ).length;
  const cancelledOrdersCount = orders.filter(
    (o) => o.orderStatus === "Cancelled"
  ).length;

  const displayOrders = orders.filter((o) => {
    if (statusFilter === "Delivered") return o.orderStatus === "Delivered";
    if (statusFilter === "Cancelled") return o.orderStatus === "Cancelled";
    if (statusFilter === "Pending")
      return o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled";
    return true;
  });

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        {/* SHARED NAVBAR */}
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C78B7B]">
                Account Overview
              </p>
              <h1 className="mt-1 font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
                My Orders
              </h1>
            </div>
            <p className="text-xs text-[#777]">
              Showing all historical and active purchases
            </p>
          </div>

          {/* OVERVIEW METRICS */}
          {!loading && !error && orders.length > 0 && (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {/* CARD 1: TOTAL ORDERS */}
                <div className="rounded-2xl border border-[#EEE5DE] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[#8D7B73]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag size={16} className="text-[#C78B7B]" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {totalOrdersCount}
                  </p>
                </div>

                {/* CARD 2: PRODUCTS ORDERED */}
                <div className="rounded-2xl border border-[#EEE5DE] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[#8D7B73]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Items Ordered</span>
                    <Package size={16} className="text-[#C78B7B]" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {totalProductsCount}
                  </p>
                </div>

                {/* CARD 3: DELIVERED */}
                <div className="rounded-2xl border border-[#EEE5DE] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[#8D7B73]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {deliveredOrdersCount}
                  </p>
                </div>

                {/* CARD 4: PENDING */}
                <div className="rounded-2xl border border-[#EEE5DE] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[#8D7B73]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
                    <Clock3 size={16} className="text-amber-600" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {pendingOrdersCount}
                  </p>
                </div>

                {/* CARD 5: CANCELLED */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#EEE5DE] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[#8D7B73]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Cancelled</span>
                    <XCircle size={16} className="text-rose-500" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
                    {cancelledOrdersCount}
                  </p>
                </div>
              </div>

              {/* ORDERS STATUS FILTER BAR */}
              <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#EEE5DE] pb-4">
                <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-[#8D7B73]">
                  Filter Orders:
                </span>

                {(["All", "Delivered", "Pending", "Cancelled"] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  const count =
                    filter === "All"
                      ? totalOrdersCount
                      : filter === "Delivered"
                      ? deliveredOrdersCount
                      : filter === "Pending"
                      ? pendingOrdersCount
                      : cancelledOrdersCount;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "border-[#3A2528] bg-[#3A2528] text-white shadow-sm"
                          : "border-[#E8E0DB] bg-white text-[#4A403D] hover:border-[#C78B7B]"
                      }`}
                    >
                      <span>{filter === "All" ? "All Orders" : `${filter} Orders`}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                          isActive ? "bg-white/20 text-white" : "bg-[#F3ECE7] text-[#8D7B73]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* LOADING */}
          {loading && (
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-[#E8DFD9] bg-white p-6"
                >
                  <div className="h-5 w-40 rounded bg-[#EEE7E2]" />
                  <div className="mt-3 h-3 w-28 rounded bg-[#F1ECE8]" />
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-[#E8DFD9] bg-white p-10 text-center shadow-sm">
              <Package size={28} className="mx-auto text-[#A45D5D]" />
              <h2 className="mt-4 font-serif text-xl text-[#2E2E2E]">
                Unable to load orders
              </h2>
              <p className="mt-2 text-xs text-[#777]">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-md bg-[#1F1F1F] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#CB8161]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY OVERALL */}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-3xl border border-[#E8DFD9] bg-white px-6 py-16 text-center shadow-sm">
              <ShoppingBag size={32} className="mx-auto text-[#C78B7B]" />
              <h2 className="mt-4 font-serif text-2xl text-[#2E2E2E]">No Orders Found</h2>
              <p className="mt-2 text-xs text-[#777]">
                Your jewellery orders will appear here once you place your first order.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1F1F1F] px-8 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#CB8161]"
              >
                Explore Shop <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* EMPTY FILTER STATE */}
          {!loading && !error && orders.length > 0 && displayOrders.length === 0 && (
            <div className="rounded-2xl border border-[#EEE5DE] bg-white p-12 text-center shadow-sm">
              <Package size={32} className="mx-auto text-[#C78B7B]" />
              <h3 className="mt-3 font-serif text-xl text-[#2E2E2E]">
                No {statusFilter.toLowerCase()} orders found
              </h3>
              <p className="mt-1 text-xs text-[#777]">
                You currently have no orders matching the &quot;{statusFilter}&quot; filter.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter("All")}
                className="mt-5 rounded-xl bg-[#3A2528] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C78B7B]"
              >
                Show All Orders
              </button>
            </div>
          )}

          {/* ORDERS LIST */}
          {!loading && !error && displayOrders.length > 0 && (
            <div className="space-y-6">
              {displayOrders.map((order) => {
                const status = getStatusConfig(order.orderStatus);
                const StatusIcon = status.icon;
                const totalItems = getTotalItems(order.products);
                const isDelivered = order.orderStatus === "Delivered";
                const isCancelled = order.orderStatus === "Cancelled";
                const canCancel = !isCancelled && isWithinCancellationWindow(order.createdAt);

                return (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    {/* ORDER HEADER */}
                    <div className="border-b border-[#EEE6E1] bg-[#FCFAF8] px-5 py-4 sm:px-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-serif text-lg font-semibold text-[#2E2E2E] sm:text-xl">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h2>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[10px] font-semibold ${status.className}`}
                            >
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-[#777]">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={12} /> {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShoppingBag size={12} /> {totalItems} {totalItems === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] uppercase tracking-wider text-[#999]">Total Amount</p>
                          <p className="font-serif text-xl font-bold text-[#1F1F1F]">
                            {formatPrice(order.totalAmount || 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PRODUCTS LIST */}
                    <div className="px-5 py-4 sm:px-6">
                      <div className="space-y-4">
                        {(order.products || []).map((product, index) => (
                          <div key={`${product.productId || product.name}-${index}`} className="flex gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#ECE4DE] bg-[#FAF7F4] sm:h-20 sm:w-20">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#C8B8AF]">
                                  <ShoppingBag size={20} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="line-clamp-1 font-serif text-sm font-semibold text-[#2E2E2E] sm:text-base">
                                {product.name}
                              </h3>
                              <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#777]">
                                <span>Qty: {product.quantity}</span>
                                {product.color && <span>Color: {product.color}</span>}
                                {product.size && <span>Size: {product.size}</span>}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-[#1F1F1F]">
                                {formatPrice(Number(product.price || 0) * Number(product.quantity || 0))}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FOOTER & ACTIONS */}
                    <div className="border-t border-[#EEE6E1] bg-[#FCFAF8] px-5 py-3.5 sm:px-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#777]">
                          <CheckCircle2 size={13} className="text-[#78966F]" />
                          <span>
                            Payment: <strong className="text-[#3A302D]">{order.paymentStatus || "Pending"}</strong> ({order.paymentMethod || "Online"})
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* View Order Details */}
                          <Link
                            href={`/account/orders/${order._id}`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#DCD3CE] bg-white px-4 text-xs font-semibold text-[#2E2E2E] transition hover:bg-[#F5EFEA]"
                          >
                            View Order <ArrowRight size={13} />
                          </Link>

                          {/* Track Order: ONLY if NOT Delivered and order is Shipped/Out for Delivery */}
                          {!isDelivered && !isCancelled && (order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery") && (
                            <Link
                              href={`/account/orders/${order._id}`}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[#1F1F1F] px-4 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#CB8161]"
                            >
                              <Truck size={13} /> Track Order
                            </Link>
                          )}

                          {/* Cancel Order: ONLY if within cancellation window */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => setCancellingOrder(order)}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              Cancel Order
                            </button>
                          )}

                          {/* Expired cancellation indicator for Delivered orders */}
                          {isDelivered && !canCancel && (
                            <span className="text-[11px] font-medium text-gray-400 italic">
                              Cancellation Window Closed ({cancellationWindowHours}h)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* CANCELLATION CONFIRMATION MODAL */}
        {cancellingOrder && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-[#E8DFD9] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EEE] pb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldAlert size={20} />
                  <h3 className="font-serif text-lg text-[#2E2E2E]">Cancel Order Confirmation</h3>
                </div>
                <button type="button" onClick={() => setCancellingOrder(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#555]">
                Are you sure you want to cancel <strong>Order #{cancellingOrder._id.slice(-8).toUpperCase()}</strong>?
                This will release the reserved items and cancel your shipment request.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  disabled={cancelling}
                  className="h-10 rounded-md border border-gray-300 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="h-10 rounded-md bg-red-600 px-5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHARED FOOTER */}
        <Footer />
      </main>
    </ProtectedRoute>
  );
}