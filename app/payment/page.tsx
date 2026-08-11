"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Truck,
  WalletCards,
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import api from "@/lib/api";
import { useCart } from "@/context/cart-context";

type PaymentMethod = "RAZORPAY" | "COD" | "UPI";

interface UPISettings {
  upiId: string;
  accountName: string;
  qrCode: string;
  paymentInstructions: string;
  enabled: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  const [checkoutData, setCheckoutData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [processStep, setProcessStep] =
    useState("Preparing your order...");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [upiSettings, setUPISettings] =
    useState<UPISettings | null>(null);

  const [upiLoading, setUPILoading] =
    useState(true);

  const [upiScreenshot, setUPIScreenshot] =
    useState<File | null>(null);

  const [upiScreenshotPreview, setUPIScreenshotPreview] =
    useState("");

  const [upiUploading, setUPIUploading] =
    useState(false);

  const [upiError, setUPIError] =
    useState("");

  // ==========================================
  // CLEANUP UPI SCREENSHOT PREVIEW
  // ==========================================

  useEffect(() => {
    return () => {
      if (upiScreenshotPreview) {
        URL.revokeObjectURL(upiScreenshotPreview);
      }
    };
  }, [upiScreenshotPreview]);

  // ==========================================
  // LOAD RAZORPAY
  // ==========================================

  useEffect(() => {
    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) return;

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);
  }, []);

  // ==========================================
  // LOAD CHECKOUT DATA
  // ==========================================

  useEffect(() => {
    const data =
      localStorage.getItem("checkoutData");

    if (!data) {
      router.push("/checkout");
      return;
    }

    try {
      const parsedData =
        JSON.parse(data);

      setCheckoutData(parsedData);
    } catch (error) {
      console.error(
        "Invalid checkout data:",
        error
      );

      localStorage.removeItem(
        "checkoutData"
      );

      router.push("/checkout");
    }
  }, [router]);

  // ==========================================
  // LOAD UPI SETTINGS
  // ==========================================

  useEffect(() => {
    const loadUPISettings = async () => {
      try {
        setUPILoading(true);
        setUPIError("");

        const { data } = await api.get("/upi");

        if (data?.success && data?.settings) {
          setUPISettings({
            upiId: data.settings.upiId || "",
            accountName: data.settings.accountName || "",
            qrCode: data.settings.qrCode || "",
            paymentInstructions:
              data.settings.paymentInstructions ||
              "Scan the QR code using any UPI app and pay the exact order amount.",
            enabled: data.settings.enabled ?? true,
          });
        }
      } catch (error: any) {
        console.error("UPI Settings Error:", error);
        setUPIError(
          error?.response?.data?.message ||
            "Unable to load UPI payment details."
        );
      } finally {
        setUPILoading(false);
      }
    };

    loadUPISettings();
  }, []);

  // ==========================================
  // CREATE DATABASE ORDER
  // ==========================================

  const createOurOrder = async (
    paymentMethodValue:
      | "COD"
      | "UPI"
      | "Razorpay",
    paymentDetails?: {
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
    }
  ) => {
    if (!checkoutData) {
      throw new Error(
        "Checkout information is missing."
      );
    }

    const {
      form,
      cart,
      totalAmount,
      discount = 0,
      shipping = 0,
      total,
    } = checkoutData;

    const payableAmount =
      Number(total ?? 0) ||
      Math.max(
        Number(totalAmount || 0) -
          Number(discount || 0) +
          Number(shipping || 0),
        0
      );

    const { data } = await api.post(
      "/orders",
      {
        customerName:
          form.customerName,

        phone:
          form.phone,

        email:
          form.email,

        address:
          form.address,

        city:
          form.city,

        state:
          form.state,

        pincode:
          form.pincode,

        products: cart.map(
          (item: any) => ({
            productId:
              item._id,

            name:
              item.name,

            price:
              Number(item.price),

            quantity:
              Number(item.quantity),

            image:
              item.image || "",

            color:
              item.color || "",

            size:
              item.size || "",
          })
        ),

        totalAmount:
          payableAmount,

        paymentMethod:
          paymentMethodValue,

        paymentStatus:
          paymentMethodValue ===
          "Razorpay"
            ? "Paid"
            : "Pending",

        razorpayOrderId:
          paymentDetails?.razorpayOrderId ||
          "",

        razorpayPaymentId:
          paymentDetails?.razorpayPaymentId ||
          "",
      }
    );

    if (
      !data?.success ||
      !data?.order?._id
    ) {
      throw new Error(
        data?.message ||
          "Failed to create order."
      );
    }

    return data.order;
  };

  // ==========================================
  // COD
  // ==========================================

  const handleCOD = async () => {
    if (
      !checkoutData ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setProcessing(true);

    try {
      setProcessStep(
        "Verifying customer details..."
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );

      setProcessStep(
        "Creating your order..."
      );

      const order =
        await createOurOrder(
          "COD"
        );

      setProcessStep(
        "Order Confirmed!"
      );

      await new Promise(
        (resolve) =>
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
        error?.response?.data
          ?.message ||
          error?.message ||
          "Failed to place order."
      );

      setProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPI MANUAL PAYMENT
  // ==========================================

  const handleUPIScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUPIError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUPIError(
        "Please upload a PNG, JPG, JPEG or WEBP screenshot."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUPIError(
        "Payment screenshot must be smaller than 5MB."
      );
      e.target.value = "";
      return;
    }

    setUPIScreenshot(file);

    const previewUrl = URL.createObjectURL(file);
    setUPIScreenshotPreview(previewUrl);
  };

  const removeUPIScreenshot = () => {
    if (upiScreenshotPreview) {
      URL.revokeObjectURL(upiScreenshotPreview);
    }

    setUPIScreenshot(null);
    setUPIScreenshotPreview("");
    setUPIError("");
  };

  const handleUPIPayment = async () => {
    if (!checkoutData || loading) return;

    if (!upiSettings?.enabled) {
      alert("UPI payment is currently unavailable.");
      return;
    }

    if (!upiSettings.qrCode || !upiSettings.upiId) {
      alert("UPI payment details are not configured yet.");
      return;
    }

    if (!upiScreenshot) {
      setUPIError(
        "Please upload your payment screenshot after completing the UPI payment."
      );
      return;
    }

    setLoading(true);
    setProcessing(true);
    setUPIUploading(true);
    setUPIError("");

    try {
      // ======================================
      // STEP 1 - Upload Screenshot
      // ======================================

      setProcessStep(
        "Uploading your payment screenshot..."
      );

      const uploadData = new FormData();
      uploadData.append("image", upiScreenshot);

      const { data: uploadResponse } = await api.post(
        "/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const screenshotUrl =
        uploadResponse?.imageUrl ||
        uploadResponse?.url ||
        uploadResponse?.data?.imageUrl ||
        "";

      if (!uploadResponse?.success || !screenshotUrl) {
        throw new Error(
          uploadResponse?.message ||
            "Unable to upload payment screenshot."
        );
      }

      // ======================================
      // STEP 2 - Create UPI Order
      // ======================================

      setProcessStep(
        "Creating your order..."
      );

      const order = await createOurOrder("UPI");

      // ======================================
      // STEP 3 - Submit Payment Proof
      // ======================================

      setProcessStep(
        "Submitting payment proof for verification..."
      );

      const { data: proofResponse } = await api.post(
        `/orders/my-orders/${order._id}/upi-proof`,
        {
          screenshot: screenshotUrl,
        }
      );

      if (!proofResponse?.success) {
        throw new Error(
          proofResponse?.message ||
            "Unable to submit payment proof."
        );
      }

      setProcessStep(
        "Payment proof submitted successfully!"
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      clearCart();
      localStorage.removeItem("checkoutData");

      router.push(
        `/order-success?id=${order._id}&payment=pending`
      );
    } catch (error: any) {
      console.error(
        "UPI Payment Error:",
        error
      );

      setProcessing(false);
      setUPIError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit UPI payment proof."
      );
    } finally {
      setUPIUploading(false);
      setLoading(false);
    }
  };

  // ==========================================
  // RAZORPAY
  // ==========================================

  const handleRazorpayPayment =
    async () => {
      if (
        !checkoutData ||
        loading
      ) {
        return;
      }

      if (!window.Razorpay) {
        alert(
          "Payment system is still loading. Please try again."
        );
        return;
      }

      const razorpayKey =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        alert(
          "Razorpay Key ID is missing. Please check .env.local."
        );
        return;
      }

      setLoading(true);
      setProcessing(true);

      try {
        const payableAmount =
          Number(
            checkoutData.total ?? 0
          ) ||
          Math.max(
            Number(
              checkoutData.totalAmount ||
                0
            ) -
              Number(
                checkoutData.discount ||
                  0
              ) +
              Number(
                checkoutData.shipping ||
                  0
              ),
            0
          );

        // ==================================
        // STEP 1
        // ==================================

        setProcessStep(
          "Creating secure payment..."
        );

        const { data } =
  await api.post(
    "/razorpay/create-order",
    {
      products:
        checkoutData.cart.map(
          (item: any) => ({
            productId:
              item._id ||
              item.productId,

            quantity:
              Number(item.quantity) || 1,
          })
        ),

      couponCode:
        checkoutData.couponCode || "",
    }
  );

        if (
          !data?.success ||
          !data?.order?.id
        ) {
          throw new Error(
            data?.message ||
              "Unable to create payment."
          );
        }

        const razorpayOrder =
          data.order;

        // ==================================
        // STEP 2
        // ==================================

        setProcessing(false);

        const options = {
          key: razorpayKey,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

          name:
            "Mahalakshmi",

          description:
            "Mahalakshmi Jewellery Order",

          order_id:
            razorpayOrder.id,

          prefill: {
            name:
              checkoutData.form
                ?.customerName ||
              "",

            email:
              checkoutData.form
                ?.email ||
              "",

            contact:
              checkoutData.form
                ?.phone ||
              "",
          },

          notes: {
            address:
              checkoutData.form
                ?.address ||
              "",

            city:
              checkoutData.form
                ?.city ||
              "",

            pincode:
              checkoutData.form
                ?.pincode ||
              "",
          },

          theme: {
            color:
              "#C78B7B",
          },

          handler:
            async function (
              response: any
            ) {
              await verifyRazorpayPayment(
                response
              );
            },

          modal: {
            ondismiss:
              function () {
                setLoading(
                  false
                );

                setProcessing(
                  false
                );

                setProcessStep(
                  "Payment cancelled."
                );
              },
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          function (
            response: any
          ) {
            console.error(
              "Razorpay Payment Failed:",
              response
            );

            setLoading(false);
            setProcessing(false);

            alert(
              response?.error
                ?.description ||
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
          error?.response
            ?.data?.message ||
            error?.message ||
            "Unable to start payment."
        );
      }
    };

  // ==========================================
  // VERIFY RAZORPAY PAYMENT
  // ==========================================

  const verifyRazorpayPayment =
    async (
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

        if (
          !verification.data
            ?.success
        ) {
          throw new Error(
            verification
              .data?.message ||
              "Payment verification failed."
          );
        }

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

        await new Promise(
          (resolve) =>
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
          error?.response
            ?.data?.message ||
            error?.message ||
            "Payment verification failed."
        );
      }
    };

  // ==========================================
  // MAIN PAYMENT BUTTON
  // ==========================================

  const handlePayment =
    async () => {
      if (
        !checkoutData ||
        loading
      ) {
        return;
      }

      if (
        paymentMethod ===
        "COD"
      ) {
        await handleCOD();
        return;
      }

      if (
        paymentMethod ===
        "UPI"
      ) {
        await handleUPIPayment();
        return;
      }

      // Razorpay is currently Coming Soon.
      alert("Razorpay online payment is coming soon.");
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (!checkoutData) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FCFAF7] px-4">

          <div className="text-center">

            <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

            <p className="text-sm text-[#777]">
              Loading payment
              details...
            </p>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // CART / TOTALS
  // ==========================================

  const cart =
    checkoutData.cart || [];

  const totalItems =
    cart.reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        Number(
          item.quantity || 0
        ),
      0
    );

  const subtotal =
    Number(
      checkoutData.totalAmount ||
        0
    );

  const discount =
    Number(
      checkoutData.discount ||
        0
    );

  const shipping =
    Number(
      checkoutData.shipping ||
        0
    );

  const payableAmount =
    Number(
      checkoutData.total
    ) ||
    Math.max(
      subtotal -
        discount +
        shipping,
      0
    );

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFAF7]">

        {/* =====================================
            HEADER
        ===================================== */}

        <section className="border-b border-[#EAE1DB] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <div className="flex items-center gap-2 text-xs text-[#8B817C]">

              <Link
                href="/cart"
                className="transition hover:text-[#C78B7B]"
              >
                Cart
              </Link>

              <ArrowRight
                size={12}
              />

              <Link
                href="/checkout"
                className="transition hover:text-[#C78B7B]"
              >
                Checkout
              </Link>

              <ArrowRight
                size={12}
              />

              <span className="font-medium text-[#3A2528]">
                Payment
              </span>

            </div>

            <div className="mt-6">

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C78B7B]">
                Secure Checkout
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
                Complete Your Order
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#777]">
                Choose your preferred
                payment method to
                complete your jewellery
                order.
              </p>

            </div>

            {/* PROGRESS */}

            <div className="mt-7 flex items-center gap-3">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={20}
                  className="text-[#6D8B62]"
                />

                <span className="text-xs font-semibold text-[#3A2528]">
                  Details
                </span>

              </div>

              <div className="h-px w-10 bg-[#C78B7B]" />

              <div className="flex items-center gap-2">

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3A2528] text-[10px] font-semibold text-white">
                  2
                </span>

                <span className="text-xs font-semibold text-[#3A2528]">
                  Payment
                </span>

              </div>

              <div className="h-px w-10 bg-[#DDD4CE]" />

              <div className="flex items-center gap-2">

                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D8CEC8] text-[10px] text-[#8A817C]">
                  3
                </span>

                <span className="text-xs text-[#8A817C]">
                  Confirmation
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            MAIN
        ===================================== */}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">

            {/* =================================
                PAYMENT METHODS
            ================================= */}

            <section className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">

              <div className="border-b border-[#EEE6E1] px-5 py-5 sm:px-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                    <WalletCards
                      size={19}
                      className="text-[#C78B7B]"
                    />
                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                      Payment
                    </p>

                    <h2 className="font-serif text-2xl text-[#2E2E2E]">
                      Choose Payment Method
                    </h2>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-7">

                {/* =================================
                    RAZORPAY - COMING SOON
                ================================= */}

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-[#E5DDD7] bg-[#FAF8F6] p-5 text-left opacity-80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3A2528] shadow-sm">
                        <CreditCard size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#2E2E2E]">
                            Razorpay
                          </p>

                          <span className="rounded-full bg-[#F1E7E2] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A6257]">
                            Coming Soon
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[#777]">
                          Secure online payment with UPI, cards, net banking and wallets.
                        </p>
                      </div>
                    </div>

                    <LockKeyhole
                      size={18}
                      className="mt-1 shrink-0 text-[#9A8F89]"
                    />
                  </div>
                </button>

                {/* =================================
                    COD
                ================================= */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setPaymentMethod(
                      "COD"
                    )
                  }
                  className={`mt-4 w-full rounded-2xl border p-5 text-left transition ${
                    paymentMethod ===
                    "COD"
                      ? "border-[#C78B7B] bg-[#FFF8F5] shadow-sm"
                      : "border-[#E5DDD7] bg-white hover:border-[#C78B7B]"
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3A2528] shadow-sm">

                        <Truck
                          size={22}
                        />

                      </div>

                      <div>

                        <p className="font-semibold text-[#2E2E2E]">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#777]">
                          Pay when your
                          jewellery reaches
                          your doorstep.
                        </p>

                      </div>

                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod ===
                        "COD"
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

                {/* =================================
                    UPI PAYMENT
                ================================= */}

                <button
                  type="button"
                  disabled={loading || upiLoading || !upiSettings?.enabled}
                  onClick={() => setPaymentMethod("UPI")}
                  className={`mt-4 w-full rounded-2xl border p-5 text-left transition ${
                    paymentMethod === "UPI"
                      ? "border-[#C78B7B] bg-[#FFF8F5] shadow-sm"
                      : "border-[#E5DDD7] bg-white hover:border-[#C78B7B]"
                  } ${
                    !upiSettings?.enabled
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3A2528] shadow-sm">
                        <WalletCards size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#2E2E2E]">
                            UPI Payment
                          </p>

                          {upiSettings?.enabled && (
                            <span className="rounded-full bg-[#EDF6EA] px-2.5 py-1 text-[10px] font-semibold text-[#55714F]">
                              Available
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[#777]">
                          Pay directly using GPay, PhonePe, Paytm or any UPI app and upload your payment proof.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#FCF8F5] px-2.5 py-1 text-[10px] text-[#6E6560]">
                            GPay
                          </span>
                          <span className="rounded-full bg-[#FCF8F5] px-2.5 py-1 text-[10px] text-[#6E6560]">
                            PhonePe
                          </span>
                          <span className="rounded-full bg-[#FCF8F5] px-2.5 py-1 text-[10px] text-[#6E6560]">
                            Paytm
                          </span>
                          <span className="rounded-full bg-[#FCF8F5] px-2.5 py-1 text-[10px] text-[#6E6560]">
                            UPI
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod === "UPI"
                          ? "border-[#C78B7B]"
                          : "border-[#CCC]"
                      }`}
                    >
                      {paymentMethod === "UPI" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#C78B7B]" />
                      )}
                    </div>
                  </div>
                </button>

                {/* =================================
                    PAYMENT INFO
                ================================= */}

                {paymentMethod === "RAZORPAY" && (
                  <div className="mt-5 rounded-2xl border border-[#EDE2DC] bg-[#FCF9F6] p-5">
                    <div className="flex gap-3">
                      <LockKeyhole
                        size={19}
                        className="mt-0.5 shrink-0 text-[#8B817C]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#3E3734]">
                          Razorpay is coming soon
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#777]">
                          Online Razorpay checkout is not available yet. Please choose Cash on Delivery or UPI Payment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "COD" && (
                  <div className="mt-5 rounded-2xl border border-[#DCE8D7] bg-[#F4F9F2] p-5">
                    <div className="flex gap-3">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-[#628159]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#496343]">
                          Cash on Delivery
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#628159]">
                          No online payment is required now. Pay when your order is delivered.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="mt-5 rounded-2xl border border-[#EDE2DC] bg-[#FCF9F6] p-5 sm:p-6">
                    {upiLoading ? (
                      <div className="flex items-center gap-3 text-sm text-[#777]">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8DFD9] border-t-[#C78B7B]" />
                        Loading UPI payment details...
                      </div>
                    ) : !upiSettings?.enabled ? (
                      <div className="flex gap-3">
                        <LockKeyhole
                          size={19}
                          className="mt-0.5 shrink-0 text-[#8B817C]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#3E3734]">
                            UPI payment is currently unavailable
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#777]">
                            Please choose another payment method.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <ShieldCheck
                            size={19}
                            className="mt-0.5 shrink-0 text-[#6D8B62]"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#3E3734]">
                              Pay directly using UPI
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#777]">
                              Complete the payment for the exact order amount, then upload your payment screenshot for verification.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                          <div className="rounded-2xl border border-[#E5DDD7] bg-white p-4">
                            {upiSettings.qrCode ? (
                              <Image
                                src={upiSettings.qrCode}
                                alt="UPI payment QR code"
                                width={420}
                                height={420}
                                className="mx-auto aspect-square w-full max-w-[190px] object-contain"
                              />
                            ) : (
                              <div className="flex aspect-square items-center justify-center text-center text-xs text-[#999]">
                                QR code is not configured.
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="rounded-2xl border border-[#E8DFD9] bg-white p-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C78B7B]">
                                Pay Exact Amount
                              </p>

                              <p className="mt-1 font-serif text-3xl font-semibold text-[#2E2E2E]">
                                ₹{payableAmount.toLocaleString("en-IN")}
                              </p>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-[#999]">
                                    UPI ID
                                  </p>
                                  <p className="mt-1 break-all text-sm font-semibold text-[#3A2528]">
                                    {upiSettings.upiId}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-[#999]">
                                    Account Name
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-[#3A2528]">
                                    {upiSettings.accountName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 rounded-xl bg-white p-4">
                              <p className="text-xs leading-5 text-[#6E6560]">
                                {upiSettings.paymentInstructions}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-[#E5DDD7] bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#3E3734]">
                                Upload Payment Screenshot
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#777]">
                                After completing the UPI payment, upload the screenshot here. Maximum 5MB.
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#F8F0EC] px-2.5 py-1 text-[10px] font-semibold text-[#8A6257]">
                              Required
                            </span>
                          </div>

                          <input
                            id="upi-payment-screenshot"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleUPIScreenshotChange}
                            disabled={loading || upiUploading}
                            className="hidden"
                          />

                          {upiScreenshotPreview ? (
                            <div className="mt-4">
                              <div className="relative overflow-hidden rounded-xl border border-[#E8DFD9] bg-[#FAF7F4] p-2">
                                <img
                                  src={upiScreenshotPreview}
                                  alt="Payment screenshot preview"
                                  className="mx-auto max-h-[360px] w-full object-contain"
                                />
                              </div>

                              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="truncate text-xs text-[#6E6560]">
                                  {upiScreenshot?.name}
                                </p>

                                <div className="flex gap-2">
                                  <label
                                    htmlFor="upi-payment-screenshot"
                                    className="cursor-pointer rounded-lg border border-[#DCD1CB] px-3 py-2 text-xs font-semibold text-[#5F5651] transition hover:border-[#C78B7B] hover:text-[#C78B7B]"
                                  >
                                    Replace
                                  </label>

                                  <button
                                    type="button"
                                    onClick={removeUPIScreenshot}
                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="upi-payment-screenshot"
                              className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCD1CB] px-5 py-8 text-center transition hover:border-[#C78B7B] hover:bg-[#FFFBF9]"
                            >
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F0EC] text-[#C78B7B]">
                                <ShoppingBag size={19} />
                              </div>
                              <p className="text-sm font-semibold text-[#3E3734]">
                                Choose payment screenshot
                              </p>
                              <p className="mt-1 text-xs text-[#999]">
                                PNG, JPG, JPEG or WEBP · Max 5MB
                              </p>
                            </label>
                          )}

                          {upiError && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                              {upiError}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex gap-3 rounded-xl border border-[#E8DFD9] bg-white p-4">
                          <LockKeyhole
                            size={16}
                            className="mt-0.5 shrink-0 text-[#8C827D]"
                          />
                          <p className="text-[11px] leading-5 text-[#777]">
                            Your payment proof will be reviewed by our team. The order remains pending until the payment is verified.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* =================================
                    BACK
                ================================= */}

                <Link
                  href="/checkout"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#665B56] transition hover:text-[#C78B7B]"
                >
                  <ArrowLeft
                    size={15}
                  />

                  Back to Checkout
                </Link>

              </div>

            </section>

            {/* =================================
                ORDER SUMMARY
            ================================= */}

            <aside className="lg:sticky lg:top-24">

              <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">

                {/* HEADER */}

                <div className="border-b border-[#EEE6E1] px-5 py-5 sm:px-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                        Your Selection
                      </p>

                      <h2 className="mt-1 font-serif text-2xl text-[#2E2E2E]">
                        Order Summary
                      </h2>

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">

                      <ShoppingBag
                        size={18}
                        className="text-[#C78B7B]"
                      />

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="max-h-[330px] overflow-y-auto px-5 py-5 sm:px-6">

                  <div className="space-y-4">

                    {cart.map(
                      (item: any) => (
                        <div
                          key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                          className="flex gap-3"
                        >

                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F4]">

                            <Image
                              src={
                                item.image ||
                                "/placeholder-product.jpg"
                              }
                              alt={
                                item.name
                              }
                              fill
                              sizes="64px"
                              className="object-cover"
                            />

                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3A2528] px-1 text-[9px] font-semibold text-white">
                              {item.quantity}
                            </span>

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#342D2A]">
                              {item.name}
                            </p>

                            {(item.color ||
                              item.size) && (
                              <p className="mt-1 text-[10px] text-[#817671]">

                                {item.color &&
                                  `Color: ${item.color}`}

                                {item.color &&
                                  item.size &&
                                  " • "}

                                {item.size &&
                                  `Size: ${item.size}`}

                              </p>
                            )}

                            <p className="mt-1 text-xs text-[#817671]">
                              ₹
                              {Number(
                                item.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
                              ×{" "}
                              {
                                item.quantity
                              }
                            </p>

                          </div>

                          <p className="shrink-0 text-sm font-semibold text-[#3A2528]">

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
                      )
                    )}

                  </div>

                </div>

                {/* TOTALS */}

                <div className="border-t border-[#EEE6E1] px-5 py-5 sm:px-6">

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">

                      <span className="text-[#706662]">
                        Items
                      </span>

                      <span className="font-medium text-[#2E2E2E]">
                        {totalItems}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-[#706662]">
                        Subtotal
                      </span>

                      <span className="font-medium text-[#2E2E2E]">
                        ₹
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    {discount >
                      0 && (
                      <div className="flex justify-between text-green-600">

                        <span>
                          Discount
                        </span>

                        <span className="font-medium">
                          -₹
                          {discount.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>
                    )}

                    <div className="flex justify-between">

                      <span className="text-[#706662]">
                        Delivery
                      </span>

                      <span
                        className={
                          shipping ===
                          0
                            ? "font-semibold text-green-600"
                            : "font-medium text-[#2E2E2E]"
                        }
                      >
                        {shipping ===
                        0
                          ? "FREE"
                          : `₹${shipping}`}
                      </span>

                    </div>

                  </div>

                  <div className="my-5 h-px bg-[#E8DFD9]" />

                  <div className="flex items-center justify-between">

                    <span className="text-base font-semibold text-[#2E2E2E]">
                      Total
                    </span>

                    <span className="font-serif text-2xl font-semibold text-[#2E2E2E]">
                      ₹
                      {payableAmount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* PAY BUTTON */}

                  <button
                    type="button"
                    onClick={
                      handlePayment
                    }
                    disabled={
                      loading ||
                      paymentMethod === "RAZORPAY" ||
                      (paymentMethod === "UPI" &&
                        (!upiSettings?.enabled ||
                          !upiSettings?.qrCode ||
                          !upiSettings?.upiId ||
                          !upiScreenshot))
                    }
                    className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading
                      ? "Processing..."
                      : paymentMethod === "COD"
                      ? "Place Order"
                      : paymentMethod === "UPI"
                      ? "Submit Payment Proof"
                      : "Razorpay Coming Soon"}

                    {!loading && (
                      <ArrowRight
                        size={16}
                      />
                    )}

                  </button>

                  {/* SECURITY */}

                  <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-[#8C827D]">

                    <LockKeyhole
                      size={13}
                    />

                    Secure checkout ·
                    Payment verification

                  </div>

                </div>

                {/* TRUST */}

                <div className="grid grid-cols-3 border-t border-[#EEE6E1]">

                  <div className="flex flex-col items-center gap-1.5 border-r border-[#EEE6E1] px-2 py-4 text-center">

                    <ShieldCheck
                      size={17}
                      className="text-[#C78B7B]"
                    />

                    <span className="text-[9px] font-medium uppercase tracking-wide text-[#756B66]">
                      Secure
                    </span>

                  </div>

                  <div className="flex flex-col items-center gap-1.5 border-r border-[#EEE6E1] px-2 py-4 text-center">

                    <Truck
                      size={17}
                      className="text-[#C78B7B]"
                    />

                    <span className="text-[9px] font-medium uppercase tracking-wide text-[#756B66]">
                      Delivery
                    </span>

                  </div>

                  <div className="flex flex-col items-center gap-1.5 px-2 py-4 text-center">

                    <CheckCircle2
                      size={17}
                      className="text-[#C78B7B]"
                    />

                    <span className="text-[9px] font-medium uppercase tracking-wide text-[#756B66]">
                      Quality
                    </span>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

      {/* =====================================
          PROCESSING OVERLAY
      ===================================== */}

      {processing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-3xl border border-[#E8DFD9] bg-white p-8 text-center shadow-2xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F0EC]">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E8DFD9] border-t-[#C78B7B]" />

            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
              Please Wait
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#2E2E2E]">
              Processing Your Order
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777]">
              {processStep}
            </p>

            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F2ECE7]">

              <div className="h-full w-full animate-pulse rounded-full bg-[#C78B7B]" />

            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#999]">

              <LockKeyhole
                size={12}
              />

              Please don't close this
              window.

            </p>

          </div>

        </div>
      )}

      <Footer />
    </>
  );
}