"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import api from "@/lib/api";
import { useCart } from "@/context/cart-context";

type PaymentMethod = "RAZORPAY" | "COD";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  const [checkoutData, setCheckoutData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [processStep, setProcessStep] = useState(
    "Preparing your order..."
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("RAZORPAY");

  // =====================================
  // Load Razorpay Checkout Script
  // =====================================
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) return;

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Don't remove script because other pages may use it.
    };
  }, []);

  // =====================================
  // Load Checkout Data
  // =====================================
  useEffect(() => {
    const data = localStorage.getItem("checkoutData");

    if (!data) {
      router.push("/checkout");
      return;
    }

    try {
      setCheckoutData(JSON.parse(data));
    } catch (error) {
      console.error(
        "Invalid checkout data:",
        error
      );

      localStorage.removeItem("checkoutData");

      router.push("/checkout");
    }
  }, [router]);

  // =====================================
  // Create Our Order
  // =====================================
  const createOurOrder = async (
    paymentMethodValue: "COD" | "Razorpay",
    paymentDetails?: {
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
    }
  ) => {
    const {
      form,
      cart,
      totalAmount,
    } = checkoutData;

    const { data } = await api.post("/orders", {
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,

      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,

      products: cart.map((item: any) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || "",

        // Variant information
        color: item.color || "",
        size: item.size || "",
      })),

      totalAmount: Number(totalAmount),

      paymentMethod: paymentMethodValue,

      // Paid only for successfully verified Razorpay payment
      paymentStatus:
        paymentMethodValue === "Razorpay"
          ? "Paid"
          : "Pending",

      razorpayOrderId:
        paymentDetails?.razorpayOrderId || "",

      razorpayPaymentId:
        paymentDetails?.razorpayPaymentId || "",
    });

    if (!data?.success || !data?.order?._id) {
      throw new Error(
        data?.message ||
          "Failed to create order."
      );
    }

    return data.order;
  };

  // =====================================
  // COD
  // =====================================
  const handleCOD = async () => {
    if (!checkoutData) return;

    setLoading(true);
    setProcessing(true);

    try {
      setProcessStep(
        "Verifying customer details..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setProcessStep(
        "Creating your order..."
      );

      const order = await createOurOrder(
        "COD"
      );

      setProcessStep("Order Confirmed!");

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      clearCart();

      localStorage.removeItem(
        "checkoutData"
      );

      router.push(
        `/order-success?id=${order._id}`
      );
    } catch (error: any) {
      console.error(
        "COD Order Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order."
      );

      setProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Razorpay Payment
  // =====================================
  const handleRazorpayPayment = async () => {
    if (!checkoutData) return;

    if (!window.Razorpay) {
      alert(
        "Payment system is still loading. Please try again."
      );
      return;
    }

    const razorpayKey =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      alert(
        "Razorpay Key ID is missing. Please check .env.local."
      );
      return;
    }

    setLoading(true);
    setProcessing(true);

    try {
      // =====================================
      // STEP 1
      // Create Razorpay Order
      // =====================================
      setProcessStep(
        "Creating secure payment..."
      );

      const { data } = await api.post(
        "/razorpay/create-order",
        {
          amount: Number(
            checkoutData.totalAmount
          ),
        }
      );

      if (!data?.success || !data?.order?.id) {
        throw new Error(
          data?.message ||
            "Unable to create payment."
        );
      }

      const razorpayOrder = data.order;

      // =====================================
      // STEP 2
      // Open Razorpay
      // =====================================
      setProcessing(false);

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Mahalakshmi",

        description:
          "Mahalakshmi Jewellery Order",

        order_id: razorpayOrder.id,

        prefill: {
          name:
            checkoutData.form.customerName ||
            "",

          email:
            checkoutData.form.email ||
            "",

          contact:
            checkoutData.form.phone ||
            "",
        },

        notes: {
          address:
            checkoutData.form.address ||
            "",

          city:
            checkoutData.form.city ||
            "",

          pincode:
            checkoutData.form.pincode ||
            "",
        },

        theme: {
          color: "#C78B7B",
        },

        handler: async function (
          response: any
        ) {
          await verifyRazorpayPayment(
            response
          );
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setProcessing(false);

            setProcessStep(
              "Payment cancelled."
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setLoading(false);
          setProcessing(false);

          alert(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error: any) {
      console.error(
        "Razorpay Error:",
        error
      );

      setLoading(false);
      setProcessing(false);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );
    }
  };

  // =====================================
  // Verify Razorpay Payment
  // =====================================
  const verifyRazorpayPayment = async (
    response: any
  ) => {
    try {
      setProcessing(true);
      setProcessStep(
        "Verifying payment..."
      );

      const verification =
        await api.post(
          "/razorpay/verify-payment",
          {
            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,
          }
        );

      if (!verification.data?.success) {
        throw new Error(
          verification.data?.message ||
            "Payment verification failed."
        );
      }

      // =====================================
      // Payment verified
      // Now create our database order
      // =====================================
      setProcessStep(
        "Creating your order..."
      );

      const order =
        await createOurOrder(
          "Razorpay",
          {
            razorpayOrderId:
              response.razorpay_order_id,

            razorpayPaymentId:
              response.razorpay_payment_id,
          }
        );

      setProcessStep(
        "Payment successful!"
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      clearCart();

      localStorage.removeItem(
        "checkoutData"
      );

      router.push(
        `/order-success?id=${order._id}`
      );
    } catch (error: any) {
      console.error(
        "Payment Verification Error:",
        error
      );

      setProcessing(false);
      setLoading(false);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Payment verification failed."
      );
    }
  };

  // =====================================
  // Main Button
  // =====================================
  const handlePayment = async () => {
    if (!checkoutData) return;

    if (paymentMethod === "COD") {
      await handleCOD();
      return;
    }

    await handleRazorpayPayment();
  };

  // =====================================
  // Loading
  // =====================================
  if (!checkoutData) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FCFAF7]">
          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

            <p className="text-sm text-[#777]">
              Loading payment details...
            </p>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  const cart =
    checkoutData.cart || [];

  const totalItems = cart.reduce(
    (sum: number, item: any) =>
      sum + Number(item.quantity || 0),
    0
  );

  const totalAmount = Number(
    checkoutData.totalAmount || 0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFAF7] py-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
              Payment
            </h1>

            <p className="mt-2 text-sm text-[#777]">
              Choose your preferred payment method.
            </p>

          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

            {/* PAYMENT METHODS */}

            <div className="border border-[#E8DFD9] bg-white p-5 sm:p-7">

              <h2 className="mb-6 font-serif text-2xl text-[#2E2E2E]">
                Select Payment Method
              </h2>

              {/* Razorpay */}
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod(
                    "RAZORPAY"
                  )
                }
                className={`mb-3 w-full border p-4 text-left transition ${
                  paymentMethod ===
                  "RAZORPAY"
                    ? "border-[#C78B7B] bg-[#FFF8F5]"
                    : "border-[#E8E3DC] bg-white hover:border-[#C78B7B]"
                }`}
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center bg-[#FCFAF7] text-xl">
                      💳
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#2E2E2E]">
                        Online Payment
                      </p>

                      <p className="mt-0.5 text-xs text-[#777]">
                        Card • UPI • Net Banking • Wallet
                      </p>

                    </div>

                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod ===
                      "RAZORPAY"
                        ? "border-[#C78B7B]"
                        : "border-[#CCC]"
                    }`}
                  >
                    {paymentMethod ===
                      "RAZORPAY" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#C78B7B]" />
                    )}
                  </div>

                </div>
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("COD")
                }
                className={`w-full border p-4 text-left transition ${
                  paymentMethod === "COD"
                    ? "border-[#C78B7B] bg-[#FFF8F5]"
                    : "border-[#E8E3DC] bg-white hover:border-[#C78B7B]"
                }`}
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center bg-[#FCFAF7] text-xl">
                      🚚
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#2E2E2E]">
                        Cash on Delivery
                      </p>

                      <p className="mt-0.5 text-xs text-[#777]">
                        Pay after delivery
                      </p>

                    </div>

                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod === "COD"
                        ? "border-[#C78B7B]"
                        : "border-[#CCC]"
                    }`}
                  >
                    {paymentMethod ===
                      "COD" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#C78B7B]" />
                    )}
                  </div>

                </div>
              </button>

              {/* Online Payment Info */}
              {paymentMethod ===
                "RAZORPAY" && (
                <div className="mt-5 border border-[#E8E3DC] bg-[#FCFAF7] p-5">

                  <h3 className="mb-2 text-base font-semibold text-[#2E2E2E]">
                    Secure Online Payment
                  </h3>

                  <p className="text-sm leading-relaxed text-[#666]">
                    You will be redirected to
                    Razorpay's secure checkout where
                    you can pay using Card, UPI,
                    Net Banking or Wallet.
                  </p>

                </div>
              )}

              {/* COD Info */}
              {paymentMethod ===
                "COD" && (
                <div className="mt-5 border border-green-200 bg-green-50 p-5">

                  <h3 className="mb-2 text-base font-semibold text-green-800">
                    Cash on Delivery
                  </h3>

                  <p className="text-sm leading-relaxed text-green-700">
                    Pay when your jewellery is
                    safely delivered to your
                    doorstep.
                  </p>

                </div>
              )}

            </div>

            {/* ORDER SUMMARY */}

            <aside className="lg:sticky lg:top-24">

              <div className="border border-[#E8DFD9] bg-white p-5 sm:p-6">

                <h2 className="mb-5 font-serif text-2xl text-[#2E2E2E]">
                  Order Summary
                </h2>

                <div className="space-y-4">

                  {cart.map(
                    (item: any) => (
                      <div
                        key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                        className="flex gap-3 border-b border-[#F0EAE5] pb-4"
                      >

                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-[#FAF7F4]">
                          <img
                            src={
                              item.image ||
                              "/placeholder.png"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="line-clamp-2 text-sm font-medium text-[#2E2E2E]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#777]">
                            Qty: {item.quantity}
                          </p>

                          {(item.color ||
                            item.size) && (
                            <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-[#777]">

                              {item.color && (
                                <span>
                                  Color:{" "}
                                  {item.color}
                                </span>
                              )}

                              {item.color &&
                                item.size && (
                                  <span className="text-[#BBB]">
                                    •
                                  </span>
                                )}

                              {item.size && (
                                <span>
                                  Size:{" "}
                                  {item.size}
                                </span>
                              )}

                            </div>
                          )}

                        </div>

                        <p className="shrink-0 text-sm font-semibold text-[#2E2E2E]">
                          ₹
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>
                    )
                  )}

                </div>

                {/* TOTALS */}

                <div className="mt-5 space-y-3 border-t border-[#E8DFD9] pt-5">

                  <div className="flex justify-between text-sm">

                    <span className="text-[#666]">
                      Items
                    </span>

                    <span>
                      {totalItems}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-[#666]">
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-[#666]">
                      Delivery
                    </span>

                    <span className="font-semibold text-green-600">
                      FREE
                    </span>

                  </div>

                  <div className="flex justify-between border-t border-[#E8DFD9] pt-4">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#C78B7B]">
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="mt-6 flex h-11 w-full items-center justify-center bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod ===
                      "COD"
                    ? "Place Order"
                    : `Pay ₹${totalAmount.toLocaleString(
                        "en-IN"
                      )}`}
                </button>

                <p className="mt-3 text-center text-[11px] text-[#999]">
                  🔒 Secure payment • Safe delivery
                </p>

              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* PROCESSING */}

      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm border border-[#E8DFD9] bg-white p-8 text-center shadow-xl">

            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

            <h2 className="font-serif text-2xl font-bold text-[#2E2E2E]">
              Processing Order
            </h2>

            <p className="mt-3 text-sm text-[#666]">
              {processStep}
            </p>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#F4EEE8]">
              <div className="h-full w-full animate-pulse bg-[#C78B7B]" />
            </div>

          </div>

        </div>
      )}

      <Footer />
    </>
  );
}