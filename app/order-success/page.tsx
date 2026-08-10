"use client";

import Confetti from "react-confetti";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import api from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  // Hide confetti
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/my-orders/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7] flex items-center justify-center px-6 relative">

          {showConfetti && (
            <Confetti
              recycle={false}
              numberOfPieces={250}
            />
          )}

          <div className="luxury-card p-10 animate-fade-in-scale text-center max-w-xl w-full">

            <div className="flex justify-center mb-8">
              <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
            </div>

            <h1 className="text-5xl font-serif font-bold text-[#2E2E2E] mb-4">
              🎉 Order Placed Successfully
            </h1>

            <p className="text-lg text-[#6B6B6B] leading-8 mb-8">
              Your jewellery order has been confirmed successfully.
              <br />
              Our team will carefully prepare your order and notify you once it is shipped.
            </p>

            {/* Order Summary */}
            {order && (
              <div className="bg-[#FCFAF7] border border-[#E8E3DC] rounded-2xl p-6 mb-8">

                <h3 className="text-xl font-semibold mb-5">
                  Order Summary
                </h3>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Order ID</span>
                    <span className="font-semibold">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Payment Method</span>
                    <span className="font-semibold">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Payment Status</span>
                    <span className="text-green-600 font-semibold">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount}</span>
                  </div>

                </div>

              </div>
            )}

            {/* Delivery Card */}
            <div className="bg-[#FCFAF7] rounded-2xl border border-[#E8E3DC] p-5 mb-8">

              <h3 className="font-semibold text-lg mb-3">
                🚚 Estimated Delivery
              </h3>

              <p className="text-[#6B6B6B]">
                Delivery within <strong>3–5 Business Days</strong>
              </p>

              <p className="text-sm text-gray-500 mt-2">
                You'll receive tracking details by email and SMS once your order is shipped.
              </p>

            </div>

            {/* Buttons */}
            <div className="space-y-4">

              <Link
                href="/account/orders"
                className="btn-primary"
              >
                View My Orders
              </Link>

              <Link
                href="/shop"
                className="btn-secondary"
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