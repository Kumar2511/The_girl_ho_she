"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";

interface CheckoutForm {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface DeliveryInfo {
  state: string;
  district: string;
  pincode: string;
  deliveryDays: number;
  estimatedDate: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const { user } = useAuth();

  const { cart } = useCart();

  const [loading, setLoading] = useState(false);

  // ==========================================
  // PINCODE / DELIVERY
  // ==========================================

  const [checkingPincode, setCheckingPincode] =
    useState(false);

  const [pincodeChecked, setPincodeChecked] =
    useState(false);

  const [deliveryAvailable, setDeliveryAvailable] =
    useState(false);

  const [deliveryInfo, setDeliveryInfo] =
    useState<DeliveryInfo | null>(null);

  const [pincodeMessage, setPincodeMessage] =
    useState("");

  // ==========================================
  // COUPON
  // ==========================================

  const [couponCode, setCouponCode] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [finalAmount, setFinalAmount] =
    useState(0);

  const [couponApplied, setCouponApplied] =
    useState(false);

  const [couponMessage, setCouponMessage] =
    useState("");

  const [couponError, setCouponError] =
    useState("");

  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] =
    useState<CheckoutForm>({
      customerName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  // ==========================================
  // LOAD USER DETAILS
  // ==========================================

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      customerName: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
    }));
  }, [user]);

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const totalAmount = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ==========================================
  // SHIPPING SETTINGS
  // ==========================================

  const [shippingSettings, setShippingSettings] =
    useState({
      freeShippingEnabled: true,
      freeShippingMinimum: 999,
      shippingCharge: 80,
      codCharge: 0,
    });

  const [shippingLoading, setShippingLoading] =
    useState(true);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        setShippingLoading(true);

        const res = await api.get("/shipping");

        if (res.data?.settings) {
          setShippingSettings({
            freeShippingEnabled: Boolean(
              res.data.settings.freeShippingEnabled
            ),
            freeShippingMinimum: Number(
              res.data.settings.freeShippingMinimum ?? 999
            ),
            shippingCharge: Number(
              res.data.settings.shippingCharge ?? 80
            ),
            codCharge: Number(
              res.data.settings.codCharge ?? 0
            ),
          });
        }
      } catch (error) {
        console.error(
          "Shipping Settings Error:",
          error
        );
      } finally {
        setShippingLoading(false);
      }
    };

    fetchShippingSettings();
  }, []);

  const shipping =
    totalAmount === 0
      ? 0
      : shippingSettings.freeShippingEnabled &&
          totalAmount >= shippingSettings.freeShippingMinimum
        ? 0
        : shippingSettings.shippingCharge;

  // ==========================================
  // AMOUNT AFTER DISCOUNT
  // ==========================================

  const amountAfterDiscount = Math.max(
    totalAmount - discount,
    0
  );

  const calculatedFinalAmount =
    amountAfterDiscount + shipping;

  // ==========================================
  // UPDATE FINAL AMOUNT
  // ==========================================

  useEffect(() => {
    if (!couponApplied) {
      setFinalAmount(calculatedFinalAmount);
    }
  }, [
    calculatedFinalAmount,
    couponApplied,
  ]);

  // ==========================================
  // FORM HANDLER
  // ==========================================

  const updateField = (
    field: keyof CheckoutForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // RESET DELIVERY CHECK
  // ==========================================

  const resetDeliveryCheck = () => {
    setPincodeChecked(false);
    setDeliveryAvailable(false);
    setDeliveryInfo(null);
    setPincodeMessage("");
  };

  // ==========================================
  // CHECK PINCODE AVAILABILITY
  // ==========================================

  const checkPincodeAvailability = async () => {
    const pincode = form.pincode.trim();

    // Reset previous result
    setPincodeMessage("");
    setDeliveryInfo(null);
    setDeliveryAvailable(false);
    setPincodeChecked(false);

    // Basic validation
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeChecked(true);

      setPincodeMessage(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    try {
      setCheckingPincode(true);

      const res = await api.get(
        `/shipping/check/${pincode}`
      );

      if (
        res.data.success &&
        res.data.serviceable &&
        res.data.delivery
      ) {
        setDeliveryAvailable(true);
        setPincodeChecked(true);

        setDeliveryInfo(
          res.data.delivery
        );

        setPincodeMessage(
          res.data.message ||
            "Delivery available."
        );
      } else {
        setPincodeChecked(true);
        setDeliveryAvailable(false);
        setDeliveryInfo(null);

        setPincodeMessage(
          res.data.message ||
            "Sorry, delivery is not available to this pincode."
        );
      }
    } catch (error: any) {
      console.error(
        "Pincode Check Error:",
        error
      );

      setPincodeChecked(true);
      setDeliveryAvailable(false);
      setDeliveryInfo(null);

      setPincodeMessage(
        error?.response?.data?.message ||
          "Sorry, delivery is not available to this pincode."
      );
    } finally {
      setCheckingPincode(false);
    }
  };

  // ==========================================
  // COUPON
  // ==========================================

  const applyCoupon = async () => {
    setCouponMessage("");
    setCouponError("");

    const code =
      couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError(
        "Please enter a coupon code."
      );

      return;
    }

    if (couponApplied) {
      return;
    }

    try {
      const { data } =
        await api.post(
          "/coupons/apply",
          {
            code,
            totalAmount,
          }
        );

      const serverDiscount =
        Number(data.discount || 0);

      setDiscount(
        serverDiscount
      );

      setFinalAmount(
        Math.max(totalAmount - serverDiscount, 0) +
          shipping
      );

      setCouponCode(code);

      setCouponApplied(true);

      setCouponMessage(
        "Coupon applied successfully."
      );
    } catch (error: any) {
      console.error(
        "Coupon Error:",
        error
      );

      setCouponError(
        error?.response?.data
          ?.message ||
          "Invalid coupon code."
      );
    }
  };

  // ==========================================
  // CONTINUE TO PAYMENT
  // ==========================================

  const continueToPayment = async () => {
    if (loading) return;

    const name =
      form.customerName.trim();

    const phone =
      form.phone.trim();

    const email =
      form.email.trim();

    const address =
      form.address.trim();

    const city =
      form.city.trim();

    const state =
      form.state.trim();

    const pincode =
      form.pincode.trim();

    // ========================================
    // REQUIRED FIELDS
    // ========================================

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    // ========================================
    // PHONE VALIDATION
    // ========================================

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (
      cleanPhone.length !== 10
    ) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    // ========================================
    // PINCODE FORMAT VALIDATION
    // ========================================

    if (
      !/^\d{6}$/.test(pincode)
    ) {
      alert(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    // ========================================
    // DELIVERY CHECK
    // ========================================

    if (
      !pincodeChecked ||
      !deliveryAvailable
    ) {
      alert(
        "Please check delivery availability for your pincode before continuing."
      );

      return;
    }

    // ========================================
    // EMAIL VALIDATION
    // ========================================

    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        alert(
          "Please enter a valid email address."
        );

        return;
      }
    }

    // ========================================
    // CART VALIDATION
    // ========================================

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );

      return;
    }

    setLoading(true);

    try {
      const checkoutPayload = {
        form: {
          ...form,
          customerName: name,
          phone: cleanPhone,
          email,
          address,
          city,
          state,
          pincode,
        },

        cart,

        totalAmount,

        discount,

        shipping,

        total: calculatedFinalAmount,

        couponCode:
          couponApplied
            ? couponCode
            : "",

        // ====================================
        // DELIVERY INFORMATION
        // ====================================

        deliveryInfo:
          deliveryInfo
            ? {
                state:
                  deliveryInfo.state,

                district:
                  deliveryInfo.district,

                pincode:
                  deliveryInfo.pincode,

                deliveryDays:
                  deliveryInfo.deliveryDays,

                estimatedDate:
                  deliveryInfo.estimatedDate,
              }
            : null,
      };

      localStorage.setItem(
        "checkoutData",
        JSON.stringify(
          checkoutPayload
        )
      );

      router.push(
        "/payment"
      );
    } catch (error) {
      console.error(
        "Checkout Error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <ProtectedRoute>
        <>
          <Navbar />

          <main className="flex min-h-[70vh] items-center justify-center bg-[#FCFAF7] px-4 py-16">
            <div className="w-full max-w-md rounded-3xl border border-[#E8DFD9] bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F0EC]">
                <ShoppingBag
                  size={32}
                  className="text-[#C78B7B]"
                />
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                Checkout
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                Your Cart is Empty
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#777]">
                Add some beautiful
                jewellery pieces before
                continuing to checkout.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-7 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Continue Shopping

                <ArrowRight
                  size={16}
                />
              </Link>
            </div>
          </main>

          <Footer />
        </>
      </ProtectedRoute>
    );
  }

  // ==========================================
  // CHECKOUT
  // ==========================================

  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FCFAF7]">
          {/* ==================================
              HEADER
          ================================== */}

          <section className="border-b border-[#EAE1DB] bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Breadcrumb */}

              <div className="mb-6 flex items-center gap-2 text-xs text-[#8B817C]">
                <Link
                  href="/cart"
                  className="transition hover:text-[#C78B7B]"
                >
                  Cart
                </Link>

                <ArrowRight
                  size={12}
                />

                <span className="font-medium text-[#3A2528]">
                  Checkout
                </span>
              </div>

              {/* Heading */}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C78B7B]">
                  Secure Shopping
                </p>

                <h1 className="mt-2 font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
                  Checkout
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#777]">
                  Complete your delivery
                  details and continue to
                  secure payment.
                </p>
              </div>

              {/* Progress */}

              <div className="mt-7 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3A2528] text-[11px] font-semibold text-white">
                    1
                  </span>

                  <span className="text-xs font-semibold text-[#3A2528]">
                    Details
                  </span>
                </div>

                <div className="h-px w-10 bg-[#DCD2CC]" />

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8CEC8] text-[11px] text-[#8A817C]">
                    2
                  </span>

                  <span className="text-xs text-[#8A817C]">
                    Payment
                  </span>
                </div>

                <div className="h-px w-10 bg-[#DCD2CC]" />

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8CEC8] text-[11px] text-[#8A817C]">
                    3
                  </span>

                  <span className="text-xs text-[#8A817C]">
                    Confirmation
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================
              MAIN CONTENT
          ================================== */}

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
              {/* =================================
                  DELIVERY DETAILS
              ================================= */}

              <section className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">
                <div className="border-b border-[#EEE6E1] px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0EC]">
                      <MapPin
                        size={18}
                        className="text-[#C78B7B]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C78B7B]">
                        Delivery
                      </p>

                      <h2 className="font-serif text-2xl text-[#2E2E2E]">
                        Delivery Details
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* NAME */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        Full Name

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="text"
                        value={
                          form.customerName
                        }
                        onChange={(e) =>
                          updateField(
                            "customerName",
                            e.target.value
                          )
                        }
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className="h-12 w-full rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        Mobile Number

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={
                          form.phone
                        }
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                        className="h-12 w-full rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        Email Address

                        <span className="ml-1 text-[10px] font-normal text-[#999]">
                          Optional
                        </span>
                      </label>

                      <input
                        type="email"
                        value={
                          form.email
                        }
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* ADDRESS */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        Full Address

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <textarea
                        rows={4}
                        value={
                          form.address
                        }
                        onChange={(e) =>
                          updateField(
                            "address",
                            e.target.value
                          )
                        }
                        placeholder="House / Door No, Street, Area, Landmark"
                        autoComplete="street-address"
                        className="w-full resize-none rounded-xl border border-[#E3DAD4] bg-white px-4 py-3 text-sm leading-6 text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* CITY */}

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        City

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="text"
                        value={
                          form.city
                        }
                        onChange={(e) =>
                          updateField(
                            "city",
                            e.target.value
                          )
                        }
                        placeholder="Your city"
                        autoComplete="address-level2"
                        className="h-12 w-full rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* STATE */}

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        State

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <input
                        type="text"
                        value={
                          form.state
                        }
                        onChange={(e) =>
                          updateField(
                            "state",
                            e.target.value
                          )
                        }
                        placeholder="Your state"
                        autoComplete="address-level1"
                        className="h-12 w-full rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                      />
                    </div>

                    {/* PINCODE + CHECK */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-[#4E4642]">
                        Pincode

                        <span className="text-[#C78B7B]">
                          {" "}*
                        </span>
                      </label>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={
                            form.pincode
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value.replace(
                                /\D/g,
                                ""
                              );

                            updateField(
                              "pincode",
                              value
                            );

                            resetDeliveryCheck();
                          }}
                          placeholder="6-digit pincode"
                          autoComplete="postal-code"
                          className="h-12 w-full flex-1 rounded-xl border border-[#E3DAD4] bg-white px-4 text-sm text-[#2E2E2E] outline-none transition placeholder:text-[#AAA19C] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                        />

                        <button
                          type="button"
                          onClick={
                            checkPincodeAvailability
                          }
                          disabled={
                            checkingPincode ||
                            form.pincode.length !== 6
                          }
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3A2528] px-6 text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {checkingPincode ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <Truck
                                size={16}
                              />
                              Check Delivery
                            </>
                          )}
                        </button>
                      </div>

                      {/* DELIVERY RESULT */}

                      {pincodeMessage && (
                        <div
                          className={`mt-3 rounded-xl border p-4 ${
                            deliveryAvailable
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {deliveryAvailable ? (
                              <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0 text-green-600"
                              />
                            ) : (
                              <XCircle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-500"
                              />
                            )}

                            <div className="min-w-0">
                              <p
                                className={`text-sm font-semibold ${
                                  deliveryAvailable
                                    ? "text-green-800"
                                    : "text-red-700"
                                }`}
                              >
                                {pincodeMessage}
                              </p>

                              {deliveryAvailable &&
                                deliveryInfo && (
                                  <div className="mt-2 space-y-1 text-xs text-green-700">
                                    <p>
                                      <span className="font-semibold">
                                        Location:
                                      </span>{" "}
                                      {
                                        deliveryInfo.district
                                      }
                                      ,{" "}
                                      {
                                        deliveryInfo.state
                                      }
                                    </p>

                                    <p>
                                      <span className="font-semibold">
                                        Pincode:
                                      </span>{" "}
                                      {
                                        deliveryInfo.pincode
                                      }
                                    </p>

                                    <p>
                                      <span className="font-semibold">
                                        Delivery:
                                      </span>{" "}
                                      {deliveryInfo.deliveryDays}{" "}
                                      {deliveryInfo.deliveryDays ===
                                      1
                                        ? "day"
                                        : "days"}
                                    </p>

                                    <p>
                                      <span className="font-semibold">
                                        Expected by:
                                      </span>{" "}
                                      {
                                        deliveryInfo.estimatedDate
                                      }
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* NOT CHECKED MESSAGE */}

                      {!pincodeChecked &&
                        form.pincode.length ===
                          6 && (
                          <p className="mt-2 text-xs text-[#8A817C]">
                            Please check delivery
                            availability before
                            continuing to payment.
                          </p>
                        )}
                    </div>
                  </div>

                  {/* DELIVERY NOTE */}

                  <div className="mt-7 rounded-xl border border-[#EFE4DD] bg-[#FCF9F6] p-4">
                    <div className="flex gap-3">
                      <Truck
                        size={18}
                        className="mt-0.5 shrink-0 text-[#C78B7B]"
                      />

                      <div>
                        <p className="text-sm font-semibold text-[#4B403C]">
                          Carefully packed delivery
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#817671]">
                          Your jewellery will
                          be securely packed
                          before being shipped
                          to your address.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE CONTINUE */}

                  <button
                    type="button"
                    onClick={
                      continueToPayment
                    }
                    disabled={
                      loading ||
                      !deliveryAvailable
                    }
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
                  >
                    {loading
                      ? "Preparing Payment..."
                      : "Continue to Payment"}

                    {!loading && (
                      <ArrowRight
                        size={16}
                      />
                    )}
                  </button>
                </div>
              </section>

              {/* =================================
                  ORDER SUMMARY
              ================================= */}

              <aside className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-[#E8DFD9] bg-white shadow-sm">
                  {/* SUMMARY HEADER */}

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

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F0EC]">
                        <ShoppingBag
                          size={17}
                          className="text-[#C78B7B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS */}

                  <div className="max-h-[330px] overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="space-y-4">
                      {cart.map(
                        (item) => (
                          <div
                            key={`${item._id}-${item.color || ""}-${item.size || ""}`}
                            className="flex gap-3"
                          >
                            {/* IMAGE */}

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
                                {
                                  item.quantity
                                }
                              </span>
                            </div>

                            {/* DETAILS */}

                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#342D2A]">
                                {
                                  item.name
                                }
                              </p>

                              {(item.color ||
                                item.size) && (
                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-[#817671]">
                                  {item.color && (
                                    <span>
                                      Color:{" "}
                                      {
                                        item.color
                                      }
                                    </span>
                                  )}

                                  {item.size && (
                                    <span>
                                      Size:{" "}
                                      {
                                        item.size
                                      }
                                    </span>
                                  )}
                                </div>
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

                            {/* ITEM TOTAL */}

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

                  {/* COUPON */}

                  <div className="border-t border-[#EEE6E1] px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Tag
                        size={15}
                        className="text-[#C78B7B]"
                      />

                      <p className="text-xs font-semibold text-[#4E4642]">
                        Have a coupon?
                      </p>
                    </div>

                    <div className="mt-3 flex overflow-hidden rounded-xl border border-[#E2D8D2]">
                      <input
                        type="text"
                        value={
                          couponCode
                        }
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value.toUpperCase()
                          );

                          setCouponError(
                            ""
                          );
                        }}
                        placeholder="ENTER CODE"
                        disabled={
                          couponApplied
                        }
                        className="h-11 min-w-0 flex-1 px-3 text-xs uppercase text-[#2E2E2E] outline-none placeholder:text-[#AAA19C] disabled:bg-[#FAF7F4]"
                      />

                      <button
                        type="button"
                        onClick={
                          applyCoupon
                        }
                        disabled={
                          couponApplied ||
                          !couponCode.trim()
                        }
                        className="h-11 bg-[#3A2528] px-4 text-xs font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {couponApplied
                          ? "Applied"
                          : "Apply"}
                      </button>
                    </div>

                    {couponMessage && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle2
                          size={13}
                        />

                        {couponMessage}
                      </p>
                    )}

                    {couponError && (
                      <p className="mt-2 text-xs text-red-500">
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* TOTALS */}

                  <div className="border-t border-[#EEE6E1] px-5 py-5 sm:px-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#706662]">
                          Subtotal
                        </span>

                        <span className="font-medium text-[#2E2E2E]">
                          ₹
                          {totalAmount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      {couponApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>
                            Discount
                          </span>

                          <span className="font-medium">
                            -₹
                            {Number(
                              discount
                            ).toLocaleString(
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
                        {(
                          calculatedFinalAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    {/* DESKTOP PAYMENT BUTTON */}

                    <button
                      type="button"
                      onClick={
                        continueToPayment
                      }
                      disabled={
                        loading ||
                        shippingLoading ||
                        !deliveryAvailable
                      }
                      className="mt-6 hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                    >
                      {loading
                        ? "Preparing Payment..."
                        : shippingLoading
                        ? "Loading..."
                        : "Continue to Payment"}

                      {!loading && !shippingLoading && (
                        <ArrowRight
                          size={16}
                        />
                      )}
                    </button>

                    {!deliveryAvailable && (
                      <p className="mt-3 text-center text-[11px] leading-5 text-[#9A8F89]">
                        Check delivery
                        availability for
                        your pincode to
                        continue.
                      </p>
                    )}

                    {/* SECURITY */}

                    <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-[#8C827D]">
                      <LockKeyhole
                        size={13}
                      />

                      Secure checkout · Your
                      information is protected
                    </div>
                  </div>

                  {/* TRUST */}

                  <div className="grid grid-cols-3 border-t border-[#EEE6E1]">
                    <div className="flex flex-col items-center gap-1.5 border-r border-[#EEE6E1] px-2 py-4 text-center">
                      <Truck
                        size={17}
                        className="text-[#C78B7B]"
                      />

                      <span className="text-[9px] font-medium uppercase tracking-wide text-[#756B66]">
                        Delivery
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 border-r border-[#EEE6E1] px-2 py-4 text-center">
                      <ShieldCheck
                        size={17}
                        className="text-[#C78B7B]"
                      />

                      <span className="text-[9px] font-medium uppercase tracking-wide text-[#756B66]">
                        Secure
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

                {/* BACK TO CART */}

                <Link
                  href="/cart"
                  className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-[#756B66] transition hover:text-[#C78B7B]"
                >
                  <ArrowLeft
                    size={13}
                  />

                  Back to Cart
                </Link>
              </aside>
            </div>
          </div>
        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}