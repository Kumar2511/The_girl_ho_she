"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==========================
  // Load User Details
  // ==========================
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // ==========================
  // Calculate Total
  // ==========================
  const totalAmount = cart.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    if (!couponApplied) {
      setFinalAmount(totalAmount);
    }
  }, [totalAmount, couponApplied]);

  // ==========================
  // Coupon
  // ==========================
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter coupon code");
      return;
    }

    try {
      const { data } = await api.post("/coupons/apply", {
        code: couponCode,
        totalAmount,
      });

      setDiscount(data.discount);
      setFinalAmount(data.finalAmount);
      setCouponApplied(true);

      alert("✅ Coupon Applied Successfully");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Invalid Coupon"
      );
    }
  };

  // ==========================
  // Continue To Payment
  // ==========================
  const continueToPayment = async () => {
    if (
      !form.customerName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem(
        "checkoutData",
        JSON.stringify({
          form,
          cart,
          totalAmount: finalAmount,
          discount,
          couponCode: couponApplied
            ? couponCode
            : "",
        })
      );

      router.push("/payment");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Empty Cart
  // ==========================
  if (cart.length === 0) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7] px-4">
            <div className="text-center">

              <h1 className="mb-3 font-serif text-3xl text-[#2E2E2E]">
                Your Cart is Empty
              </h1>

              <p className="mb-8 text-sm text-[#6B6B6B]">
                Add some beautiful jewellery before checkout.
              </p>

              <button
                onClick={() => router.push("/shop")}
                className="bg-[#3A2528] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Continue Shopping
              </button>

            </div>
          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* ==========================
                HEADER
            ========================== */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
                Checkout
              </h1>

              <p className="mt-2 text-sm text-[#777]">
                Complete your details to continue to payment.
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

              {/* ==========================
                  LEFT — DELIVERY DETAILS
              ========================== */}
              <div className="border border-[#E8DFD9] bg-white p-5 sm:p-7">

                <h2 className="mb-6 font-serif text-2xl text-[#2E2E2E]">
                  Delivery Details
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Customer Name */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      Customer Name *
                    </label>

                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          customerName: e.target.value,
                        })
                      }
                      placeholder="Enter your name"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Phone number"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      Email
                    </label>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email address"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      Full Address *
                    </label>

                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: e.target.value,
                        })
                      }
                      placeholder="House / Door No, Street, Area"
                      className="w-full resize-none border border-[#E5DDD7] bg-white px-3 py-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      City *
                    </label>

                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          city: e.target.value,
                        })
                      }
                      placeholder="City"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      State *
                    </label>

                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          state: e.target.value,
                        })
                      }
                      placeholder="State"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#555]">
                      Pincode *
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pincode: e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                        })
                      }
                      placeholder="6-digit pincode"
                      className="h-11 w-full border border-[#E5DDD7] bg-white px-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#3A2528]"
                    />
                  </div>

                </div>

                {/* Delivery Note */}
                <div className="mt-6 border border-[#EFE7DF] bg-[#FCFAF7] p-4">
                  <p className="text-xs leading-relaxed text-[#666]">
                    🚚 Your order will be carefully packed and
                    delivered to the address provided above.
                  </p>
                </div>

              </div>

              {/* ==========================
                  RIGHT — ORDER SUMMARY
              ========================== */}
              <aside className="lg:sticky lg:top-24">

                <div className="border border-[#E8DFD9] bg-white p-5 sm:p-6">

                  <h2 className="mb-5 font-serif text-2xl text-[#2E2E2E]">
                    Order Summary
                  </h2>

                  {/* Products */}
                  <div className="space-y-4">

                    {cart.map((item: any) => (
                      <div
                        key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                        className="flex gap-3 border-b border-[#F0EAE5] pb-4"
                      >

                        {/* Image */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#FAF7F4]">
                          <img
                            src={
                              item.image ||
                              "/placeholder.png"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">

                          <p className="line-clamp-2 text-sm font-medium text-[#2E2E2E]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#777]">
                            Qty: {item.quantity}
                          </p>
                          {(item.color || item.size) && (
  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#777]">
    {item.color && (
      <span>
        Color: {item.color}
      </span>
    )}

    {item.size && (
      <span>
        Size: {item.size}
      </span>
    )}
  </div>
)}
                          {/* Color + Size */}
                          {(item.color || item.size) && (
                            <div className="mt-1 flex flex-wrap gap-1.5">

                              {item.color && (
                                <span className="text-[11px] text-[#777]">
                                  Color: {item.color}
                                </span>
                              )}

                              {item.color && item.size && (
                                <span className="text-[11px] text-[#BBB]">
                                  •
                                </span>
                              )}

                              {item.size && (
                                <span className="text-[11px] text-[#777]">
                                  Size: {item.size}
                                </span>
                              )}

                            </div>
                          )}

                        </div>

                        {/* Price */}
                        <p className="shrink-0 text-sm font-semibold text-[#2E2E2E]">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>
                    ))}

                  </div>

                  {/* Coupon */}
                  <div className="mt-5">

                    <p className="mb-2 text-xs font-medium text-[#555]">
                      Have a coupon?
                    </p>

                    <div className="flex">

                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="Coupon Code"
                        disabled={couponApplied}
                        className="h-10 min-w-0 flex-1 border border-[#E5DDD7] px-3 text-xs uppercase outline-none focus:border-[#3A2528]"
                      />

                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className="h-10 bg-[#3A2528] px-4 text-xs font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {couponApplied
                          ? "Applied"
                          : "Apply"}
                      </button>

                    </div>

                  </div>

                  {/* Totals */}
                  <div className="mt-5 space-y-3 border-t border-[#E8DFD9] pt-5">

                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">
                        Subtotal
                      </span>

                      <span className="text-[#2E2E2E]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>

                        <span>
                          -₹
                          {Number(discount).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">
                        Delivery
                      </span>

                      <span className="font-semibold text-green-600">
                        FREE
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-[#E8DFD9] pt-4">
                      <span className="font-semibold text-[#2E2E2E]">
                        Total
                      </span>

                      <span className="text-xl font-bold text-[#2E2E2E]">
                        ₹{finalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                  </div>

                  {/* Continue */}
                  <button
                    type="button"
                    onClick={continueToPayment}
                    disabled={loading}
                    className="mt-6 flex h-11 w-full items-center justify-center bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {loading
                      ? "Loading..."
                      : "Continue to Payment"}
                  </button>

                  <p className="mt-3 text-center text-[11px] text-[#999]">
                    Secure checkout • Safe & careful delivery
                  </p>

                </div>

              </aside>

            </div>
          </div>
        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}