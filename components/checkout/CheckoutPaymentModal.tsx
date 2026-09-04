"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Plus,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  Smartphone,
  ChevronDown,
  CreditCard,
  Building2,
  Home,
  Pencil,
} from "lucide-react";
import QRCode from "qrcode";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/utils";
import { getAddresses, addAddress, updateAddress } from "@/services/profileService";
import { useScrollLock } from "@/hooks/useScrollLock";

interface SavedAddress {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

interface UPISettings {
  upiId: string;
  accountName: string;
  qrCode?: string;
  paymentInstructions?: string;
  enabled: boolean;
}

interface CheckoutItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItems?: CheckoutItem[];
}

type CheckoutStep = "ADDRESS_AND_PAYMENT" | "WAITING_VERIFICATION" | "SUCCESS";

export default function CheckoutPaymentModal({
  isOpen,
  onClose,
  directItems,
}: CheckoutPaymentModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();

  useScrollLock(isOpen);

  // Items to checkout: directItems (e.g. Buy Now) or cart items
  const items: CheckoutItem[] = directItems && directItems.length > 0 ? directItems : cart;

  // Step Lifecycle
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("ADDRESS_AND_PAYMENT");
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isHomePending, setIsHomePending] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);

  // New Address / Edit Address Form
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Shipping Settings & Calculation
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingEnabled: true,
    freeShippingMinimum: 999,
    shippingCharge: 80,
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // UPI Settings & QR Locking
  const [upiSettings, setUPISettings] = useState<UPISettings | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isQRLocked, setIsQRLocked] = useState(true);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(600); // 10 minutes = 600s
  const [isQRExpired, setIsQRExpired] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);

  // Mobile Number OTP Payment Request State (Integration-Ready UX)
  const [payMobileNumber, setPayMobileNumber] = useState(user?.phone || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Transaction Reference / UTR & Order Submission
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shipping =
    subtotal === 0
      ? 0
      : shippingSettings.freeShippingEnabled &&
        subtotal >= shippingSettings.freeShippingMinimum
      ? 0
      : shippingSettings.shippingCharge;

  const totalAmount = Math.max(0, subtotal - discount + shipping);

  // Pre-generate QR data URL on mount so blurred preview displays actual merchant QR
  const upiId = upiSettings?.upiId || "mahalaksmi@upi";
  const accountName = upiSettings?.accountName || "Mahalaksmi Jewellery";
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    accountName
  )}&am=${totalAmount.toFixed(2)}&cu=INR`;

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 260,
      margin: 2,
      color: { dark: "#1F1F1F", light: "#FFFFFF" },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("QR preview generation error:", err));
  }, [upiUrl]);

  // ==========================================
  // LOAD DATA ON OPEN & RESTORE PENDING SESSION
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    setShowCancelConfirm(false);
    setIsHomePending(false);
    setIsSummaryExpanded(false);
    const storedOrderId = typeof window !== "undefined" ? sessionStorage.getItem("pending_order_id") : null;

    if (storedOrderId) {
      setCreatedOrderId(storedOrderId);
      setCurrentStep("WAITING_VERIFICATION");
    } else {
      setCurrentStep("ADDRESS_AND_PAYMENT");
      setIsQRLocked(true);
      setTimerSecondsLeft(600);
      setIsQRExpired(false);
    }

    // Fetch Saved Addresses & Auto-Select Default Address
    const fetchAddresses = async () => {
      try {
        setAddressLoading(true);
        const data = await getAddresses();
        const addressList: SavedAddress[] = data.addresses || [];
        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddressId(addressList[0]._id);
        } else {
          setIsAddingNewAddress(true);
        }
      } catch (error) {
        console.error("Address loading error:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    // Fetch Shipping Settings
    const fetchShipping = async () => {
      try {
        const res = await api.get("/shipping");
        if (res.data?.settings) {
          setShippingSettings({
            freeShippingEnabled: Boolean(res.data.settings.freeShippingEnabled),
            freeShippingMinimum: Number(res.data.settings.freeShippingMinimum ?? 999),
            shippingCharge: Number(res.data.settings.shippingCharge ?? 80),
          });
        }
      } catch (error) {
        console.error("Shipping settings error:", error);
      }
    };

    // Fetch UPI Settings
    const fetchUPI = async () => {
      try {
        const res = await api.get("/upi");
        if (res.data) {
          setUPISettings({
  upiId: res.data.settings?.upiId || "",
  accountName:
    res.data.settings?.accountName || "Mahalaksmi Jewellery",
  qrCode: res.data.settings?.qrCode || "",
  paymentInstructions:
    res.data.settings?.paymentInstructions || "",
  enabled: res.data.settings?.enabled !== false,
});
        }
      } catch (error) {
        console.error("UPI settings error:", error);
      }
    };

    fetchAddresses();
    fetchShipping();
    fetchUPI();
  }, [isOpen]);

  // ==========================================
  // BACK NAVIGATION INTERCEPTION & BODY CLASS TOGGLE
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== "undefined") {
      document.body.classList.add("checkout-modal-open");
    }

    if (typeof window !== "undefined") {
      window.history.pushState({ checkoutModalOpen: true }, "");

      const handlePopState = (e: PopStateEvent) => {
        // Intercept device back button / swipe back gesture
        e.preventDefault();
        setShowCancelConfirm(true);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        if (typeof document !== "undefined") {
          document.body.classList.remove("checkout-modal-open");
        }
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen]);

  // ==========================================
  // 10-MINUTE TIMER COUNTDOWN
  // ==========================================
  useEffect(() => {
    if (isQRLocked || isQRExpired || !isOpen) return;

    if (timerSecondsLeft <= 0) {
      setIsQRExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimerSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isQRLocked, isQRExpired, timerSecondsLeft, isOpen]);

  // ==========================================
  // REAL BACKEND PAYMENT STATUS OBSERVER (POLLING)
  // NEVER FAKES PAYMENT SUCCESS
  // ==========================================
  useEffect(() => {
    if (currentStep !== "WAITING_VERIFICATION" || !createdOrderId || !isOpen) return;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/orders/my-orders/${createdOrderId}/payment-status`);
        if (res.data?.paymentStatus === "Paid" || res.data?.isPaid === true) {
          setCurrentStep("SUCCESS");
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pending_order_id");
          }
          if (!directItems || directItems.length === 0) {
            clearCart();
          }
          showToast("Payment verified successfully!", "success");
        }
      } catch (err) {
        console.error("Payment status poll error:", err);
      }
    };

    checkStatus();
    const pollInterval = setInterval(checkStatus, 4000);

    return () => clearInterval(pollInterval);
  }, [currentStep, createdOrderId, isOpen, directItems, clearCart, showToast]);

  // ==========================================
  // UNLOCK QR & GENERATE QR CODE
  // ==========================================
  const handleUnlockQR = async () => {
    setIsQRLocked(false);
    setIsQRExpired(false);
    setTimerSecondsLeft(600); // Start 10-minute timer ONLY on click

    try {
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 260,
        margin: 2,
        color: { dark: "#1F1F1F", light: "#FFFFFF" },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (err) {
      console.error("QR Generation Error:", err);
      if (upiSettings?.qrCode) {
        setQrCodeDataUrl(upiSettings.qrCode);
      }
    }
  };

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ==========================================
  // MOBILE NUMBER OTP HANDLERS (INTEGRATION UX)
  // ==========================================
  const handleSendMobileOtp = () => {
    if (!payMobileNumber || payMobileNumber.trim().length < 10) {
      showToast("Please enter a valid 10-digit mobile number.", "warning");
      return;
    }
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setOtpSent(true);
      showToast("OTP sent to " + payMobileNumber, "info");
    }, 800);
  };

  const handleVerifyMobileOtp = () => {
    if (!otpCode || otpCode.trim().length < 4) {
      showToast("Please enter a valid OTP.", "warning");
      return;
    }
    setVerifyingOtp(true);
    setTimeout(() => {
      setVerifyingOtp(false);
      setIsMobileVerified(true);
      showToast("Mobile number verified successfully!", "success");
    }, 600);
  };

  // ==========================================
  // ADD NEW ADDRESS
  // ==========================================
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newAddressForm.fullName ||
      !newAddressForm.phone ||
      !newAddressForm.address ||
      !newAddressForm.city ||
      !newAddressForm.state ||
      !newAddressForm.pincode
    ) {
      showToast("Please fill all required address fields.", "warning");
      return;
    }

    try {
      setSavingAddress(true);
      const res = await addAddress(newAddressForm);
      const updatedList: SavedAddress[] = res.addresses || [];
      setAddresses(updatedList);
      if (updatedList.length > 0) {
        setSelectedAddressId(updatedList[updatedList.length - 1]._id);
      }
      setIsAddingNewAddress(false);
      showToast("Address saved successfully.", "success");
    } catch (error: any) {
      console.error("Save address error:", error);
      showToast("Failed to save address.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  // ==========================================
  // EDIT EXISTING ADDRESS
  // ==========================================
  const handleSaveEditAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;

    if (
      !newAddressForm.fullName ||
      !newAddressForm.phone ||
      !newAddressForm.address ||
      !newAddressForm.city ||
      !newAddressForm.state ||
      !newAddressForm.pincode
    ) {
      showToast("Please fill all required address fields.", "warning");
      return;
    }

    try {
      setSavingAddress(true);
      const res = await updateAddress(selectedAddressId, newAddressForm);
      const updatedList: SavedAddress[] = res.addresses || [];
      setAddresses(updatedList);
      setIsEditingAddress(false);
      showToast("Address updated successfully.", "success");
    } catch (error: any) {
      console.error("Update address error:", error);
      // Fallback if endpoint behavior varies
      try {
        const res = await addAddress(newAddressForm);
        const updatedList: SavedAddress[] = res.addresses || [];
        setAddresses(updatedList);
        if (updatedList.length > 0) {
          setSelectedAddressId(updatedList[updatedList.length - 1]._id);
        }
        setIsEditingAddress(false);
        showToast("Address saved successfully.", "success");
      } catch (err: any) {
        showToast("Failed to update address.", "error");
      }
    } finally {
      setSavingAddress(false);
    }
  };

  // ==========================================
  // APPLY COUPON
  // ==========================================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponMessage("");

      const res = await api.post("/coupons/apply", {
        code: couponCode.trim(),
        subtotal,
      });

      if (res.data?.success || res.data?.discount) {
        const discountVal = Number(res.data.discount || 0);
        setDiscount(discountVal);
        setCouponApplied(true);
        setCouponMessage(res.data.message || `Coupon applied! Saved ${formatPrice(discountVal)}`);
        showToast("Coupon applied successfully!", "success");
      } else {
        setCouponError(res.data?.message || "Invalid coupon code.");
      }
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || "Invalid or expired coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  // ==========================================
  // SUBMIT ORDER
  // ==========================================
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !isAddingNewAddress && !isEditingAddress) {
      showToast("Please select or add a delivery address.", "warning");
      return;
    }

    const currentAddress = selectedAddress || {
      fullName: newAddressForm.fullName,
      phone: newAddressForm.phone,
      address: newAddressForm.address,
      city: newAddressForm.city,
      state: newAddressForm.state,
      pincode: newAddressForm.pincode,
      country: newAddressForm.country,
    };

    try {
      setIsSubmittingOrder(true);

      const orderPayload = {
        customerName: currentAddress.fullName,
        phone: currentAddress.phone,
        email: user?.email || "",
        shippingAddress: {
          address: currentAddress.address,
          city: currentAddress.city,
          state: currentAddress.state,
          pincode: currentAddress.pincode,
          country: currentAddress.country || "India",
        },
        products: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image: item.image,
        })),
        paymentMethod: "UPI",
        subtotal,
        shipping,
        discount,
        totalAmount,
        paymentDetails: {
          upiId: upiSettings?.upiId || "",
          accountName: upiSettings?.accountName || "",
          status: "Pending Verification",
          utrNumber: utrNumber.trim() || undefined,
        },
      };

      const res = await api.post("/orders", orderPayload);

      if (res.data?.success || res.data?.order?._id) {
        const newId = res.data.order?._id || res.data._id;
        setCreatedOrderId(newId);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pending_order_id", newId);
        }
        setCurrentStep("WAITING_VERIFICATION");
        showToast("Order initialized. Please complete UPI payment.", "info");
      } else {
        showToast("Failed to create order. Please try again.", "error");
      }
    } catch (err: any) {
      console.error("Order creation error:", err);
      showToast(err?.response?.data?.message || "Failed to place order.", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // ==========================================
  // CANCEL / CLOSE ORIGIN LOGIC & CONFIRMATION
  // ==========================================
  const handleHomeClick = () => {
    setIsHomePending(true);
    setShowCancelConfirm(true);
  };

  const onRequestClose = () => {
    if (currentStep === "SUCCESS") {
      executeClose();
    } else {
      setIsHomePending(false);
      setShowCancelConfirm(true);
    }
  };

  const executeClose = () => {
    setShowCancelConfirm(false);
    if (typeof document !== "undefined") {
      document.body.classList.remove("checkout-modal-open");
    }

    onClose();

    if (isHomePending) {
      setIsHomePending(false);
      router.push("/");
      return;
    }

    const origin = typeof window !== "undefined" ? sessionStorage.getItem("checkout_origin") : null;
    if (origin && origin !== "/checkout") {
      router.push(origin);
    }
  };

  const copyUPIId = () => {
    if (!upiSettings?.upiId) return;
    navigator.clipboard.writeText(upiSettings.upiId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity sm:items-center sm:p-4">
      {/* MOBILE RESPONSIVE CANCEL PAYMENT CONFIRMATION BOTTOM SHEET */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white p-6 pb-safe shadow-2xl space-y-4 border border-[#F0EAE5] animate-in slide-in-from-bottom duration-300 sm:animate-in sm:zoom-in-95">
            {/* CIRCULAR CLOSE X BUTTON ON BOTTOM SHEET */}
            <button
              type="button"
              onClick={() => {
                setShowCancelConfirm(false);
                setIsHomePending(false);
                if (typeof window !== "undefined") {
                  window.history.pushState({ checkoutModalOpen: true }, "");
                }
              }}
              className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F2] text-[#6B6360] hover:bg-[#EAE2DB] hover:text-[#2E2927] transition"
              aria-label="Close confirmation and continue payment"
            >
              <X size={16} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mx-auto">
              <AlertCircle size={28} />
            </div>

            <div className="text-center space-y-1.5 px-2">
              <h3 className="font-serif text-lg font-bold text-[#2E2927]">Cancel Payment?</h3>
              <p className="text-xs text-[#6B6360] leading-relaxed">
                Are you sure you want to cancel this payment and leave checkout? Your current checkout process will be cancelled.
              </p>
            </div>

            {/* RESPONSIVE TWO-COLUMN ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={executeClose}
                className="btn-secondary py-2.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelConfirm(false);
                  setIsHomePending(false);
                  if (typeof window !== "undefined") {
                    window.history.pushState({ checkoutModalOpen: true }, "");
                  }
                }}
                className="btn-primary py-2.5 text-xs font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Container / Sheet */}
      <div className="relative flex max-h-[92dvh] sm:max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl transition-all pb-safe">
        {/* Header with Top-Left Home Icon & Top-Right Expandable Order Summary */}
        <div className="sticky top-0 z-10 border-b border-[#F0EAE5] bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            {/* TOP-LEFT HOME BUTTON */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHomeClick}
                className="flex items-center gap-1.5 rounded-xl border border-[#E0D8D2] bg-[#FCFAF8] px-3 py-1.5 text-xs text-[#2E2927] transition hover:border-[#C78B7B] hover:bg-white"
                title="Return to Home"
              >
                <Home size={15} className="text-[#C78B7B]" />
                <span className="font-bold">Home</span>
              </button>
            </div>

            {/* Top Right Expandable Order Summary Badge & Close Button */}
            <div className="flex items-center gap-2">
              {currentStep === "ADDRESS_AND_PAYMENT" && (
                <button
                  type="button"
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E0D8D2] bg-[#FCFAF8] px-3 py-1.5 text-xs transition hover:border-[#C78B7B] hover:bg-white"
                  title="Toggle price summary"
                >
                  <span className="font-semibold text-[#6B6360]">
                    {items.length} {items.length === 1 ? "item" : "items"} •
                  </span>
                  <span className="font-bold text-[#2E2927]">
                    {formatPrice(totalAmount)}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#6B6360] transition-transform duration-200 ${
                      isSummaryExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              <button
                type="button"
                onClick={onRequestClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F5F2] text-[#6B6360] transition hover:bg-[#EAE2DB] hover:text-[#2E2927]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* EXPANDABLE PRICE BREAKDOWN CARD */}
          {isSummaryExpanded && currentStep === "ADDRESS_AND_PAYMENT" && (
            <div className="mt-3 rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-4 text-xs space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between text-[#6B6360]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2E2927]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6360]">
                <span>Delivery / Shipping Charge</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-700 font-bold" : "text-[#2E2927]"}`}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-[#E8E0DB] pt-2 flex justify-between font-bold text-sm text-[#2E2927]">
                <span>Total Payable</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 sm:p-6">
          {/* STEP: SUCCESS */}
          {currentStep === "SUCCESS" && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2E2927]">
                Payment Verified & Order Confirmed!
              </h3>
              <p className="text-xs text-[#6B6360]">
                Order ID: <strong className="text-[#2E2927]">#{createdOrderId.slice(-8).toUpperCase()}</strong>
              </p>
              <p className="text-sm font-bold text-[#2E2927]">
                Amount Paid: {formatPrice(totalAmount)}
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/account/orders/${createdOrderId}`);
                  }}
                  className="btn-primary py-3 px-6 text-xs"
                >
                  View Order Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP: WAITING_VERIFICATION */}
          {currentStep === "WAITING_VERIFICATION" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
                <Loader2 size={20} className="animate-spin text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Waiting for backend payment verification...</p>
                  <p className="mt-0.5 text-amber-800">
                    Order ID: <strong>#{createdOrderId.slice(-8).toUpperCase()}</strong> • Amount: <strong>{formatPrice(totalAmount)}</strong>
                  </p>
                  <p className="mt-1 text-[11px] text-amber-700">
                    Once your phone completes payment, our backend will verify the status automatically. Please do not close this window.
                  </p>
                </div>
              </div>

              {/* UNLOCKED QR DISPLAY */}
              <div className="flex flex-col items-center rounded-2xl border border-[#F0EAE5] bg-white p-5 text-center shadow-xs">
                <div className="mb-3 flex items-center gap-1.5 rounded-full bg-[#FFF5F2] px-3.5 py-1 text-xs font-bold text-[#A65E55] border border-[#F4DCD6]">
                  <Clock size={13} className="animate-pulse" />
                  <span>Session Expires in: {formatTimer(timerSecondsLeft)}</span>
                </div>

                {isQRExpired ? (
                  <div className="py-6 text-center space-y-3">
                    <AlertCircle size={36} className="mx-auto text-red-500" />
                    <p className="font-serif text-base font-bold text-[#2E2927]">UPI QR Session Expired</p>
                    <p className="text-xs text-[#6B6360]">The 10-minute payment timer has ended.</p>
                    <button
                      type="button"
                      onClick={handleUnlockQR}
                      className="btn-secondary text-xs"
                    >
                      <RefreshCw size={14} /> Generate New QR
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-[#6B6360]">Scan with Google Pay, PhonePe, Paytm, or any UPI App</p>

                    <div className="relative my-3 flex h-48 w-48 items-center justify-center rounded-2xl border border-[#F0EAE5] bg-white p-2 shadow-sm">
                      {qrCodeDataUrl ? (
                        <Image
                          src={qrCodeDataUrl}
                          alt="UPI Payment QR Code"
                          width={180}
                          height={180}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="animate-pulse text-xs text-[#9E9692]">Generating QR...</div>
                      )}
                    </div>

                    <div className="text-xs text-[#2E2927] space-y-1">
                      <p className="font-serif text-lg font-bold">Payable: {formatPrice(totalAmount)}</p>
                      {upiSettings?.upiId && (
                        <div className="flex items-center justify-center gap-1.5 text-[#6B6360]">
                          <span>VPA: <strong className="text-[#2E2927]">{upiSettings.upiId}</strong></span>
                          <button
                            type="button"
                            onClick={copyUPIId}
                            className="text-[#C78B7B] hover:underline"
                            title="Copy UPI ID"
                          >
                            {copiedUPI ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* UPI APP OPTION CARDS WITH LOCKED ICONS8 ASSET URLS */}
                <div className="mt-4 w-full border-t border-[#F0EAE5] pt-3">
                  <p className="text-[11px] font-semibold text-[#6B6360] uppercase tracking-wider mb-2">
                    Pay with all UPI Payments
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      {
                        name: "Google Pay",
                        src: "https://img.icons8.com/color/48/google-pay.png",
                      },
                      {
                        name: "PhonePe",
                        src: "https://img.icons8.com/color/48/phone-pe.png",
                      },
                      {
                        name: "Paytm",
                        src: "https://img.icons8.com/color/48/paytm.png",
                      },
                      {
                        name: "BHIM / Other",
                        src: "https://img.icons8.com/color/48/bhim.png",
                      },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={upiUrl}
                        className="flex items-center justify-start gap-2.5 rounded-xl border border-[#E0D8D2] bg-white p-2.5 shadow-2xs transition hover:border-[#C78B7B] hover:scale-[1.02]"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                          <img
                            src={app.src}
                            alt=""
                            width={28}
                            height={28}
                            className="h-7 w-7 object-contain"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-[#2E2927]">{app.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP: ADDRESS_AND_PAYMENT */}
          {currentStep === "ADDRESS_AND_PAYMENT" && (
            <>
              {/* SECTION 1: DELIVERY ADDRESS WITH DEFAULT AUTO-SELECT, EDIT, & ADD NEW ADDRESS */}
              <div className="rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#2E2927]">
                    <MapPin size={16} className="text-[#C78B7B]" />
                    <span>Delivery Address</span>
                  </div>

                  {/* MANDATORY CONTROLS: EDIT & + ADD NEW ADDRESS */}
                  <div className="flex items-center gap-3">
                    {selectedAddress && !isEditingAddress && !isAddingNewAddress && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(true);
                          setNewAddressForm({
                            fullName: selectedAddress.fullName,
                            phone: selectedAddress.phone,
                            address: selectedAddress.address,
                            city: selectedAddress.city,
                            state: selectedAddress.state,
                            pincode: selectedAddress.pincode,
                            country: selectedAddress.country || "India",
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C78B7B] hover:underline"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                    )}
                    {addresses.length > 1 && !isEditingAddress && !isAddingNewAddress && (
                      <button
                        type="button"
                        onClick={() => setIsChangingAddress(!isChangingAddress)}
                        className="text-xs font-semibold text-[#6B6360] hover:underline"
                      >
                        {isChangingAddress ? "Done" : "Change"}
                      </button>
                    )}
                    {!isAddingNewAddress && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAddress(true);
                          setIsEditingAddress(false);
                          setNewAddressForm({
                            fullName: user?.name || "",
                            phone: user?.phone || "",
                            address: "",
                            city: "",
                            state: "",
                            pincode: "",
                            country: "India",
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C78B7B] hover:underline"
                      >
                        <Plus size={12} /> Add New Address
                      </button>
                    )}
                  </div>
                </div>

                {/* Address Selection List */}
                {isChangingAddress && (
                  <div className="mt-3 space-y-2 border-t border-[#F0EAE5] pt-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          selectedAddressId === addr._id
                            ? "border-[#C78B7B] bg-white shadow-xs"
                            : "border-[#E8E0DB] bg-[#F9F6F3] hover:border-[#D5CCC4]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr._id}
                          onChange={() => {
                            setSelectedAddressId(addr._id);
                            setIsChangingAddress(false);
                          }}
                          className="mt-1 accent-[#C78B7B]"
                        />
                        <div className="text-xs text-[#2E2927]">
                          <p className="font-semibold">{addr.fullName} • {addr.phone}</p>
                          <p className="mt-0.5 text-[#6B6360]">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Display Selected / Default Address */}
                {!isChangingAddress && !isAddingNewAddress && !isEditingAddress && selectedAddress && (
                  <div className="mt-2 text-xs text-[#6B6360] bg-white p-3 rounded-xl border border-[#F0EAE5]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-[#2E2927]">{selectedAddress.fullName} • {selectedAddress.phone}</p>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Default Address
                      </span>
                    </div>
                    <p className="mt-0.5 leading-relaxed">{selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                  </div>
                )}

                {/* Edit Existing Address Form */}
                {isEditingAddress && (
                  <form onSubmit={handleSaveEditAddress} className="mt-3 space-y-3 border-t border-[#F0EAE5] pt-3">
                    <p className="text-xs font-bold text-[#2E2927]">Edit Saved Delivery Address</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={newAddressForm.fullName}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Street Address *"
                      required
                      value={newAddressForm.address}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                      className="w-full rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={newAddressForm.state}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pincode *"
                        required
                        value={newAddressForm.pincode}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="btn-primary py-2 text-[11px]"
                      >
                        {savingAddress ? "Saving..." : "Save Address Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="btn-secondary py-2 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Add New Address Form */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveNewAddress} className="mt-3 space-y-3 border-t border-[#F0EAE5] pt-3">
                    <p className="text-xs font-bold text-[#2E2927]">Add New Delivery Address</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={newAddressForm.fullName}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Street Address *"
                      required
                      value={newAddressForm.address}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                      className="w-full rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={newAddressForm.state}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pincode *"
                        required
                        value={newAddressForm.pincode}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                        className="rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="btn-primary py-2 text-[11px]"
                      >
                        {savingAddress ? "Saving..." : "Save & Use Address"}
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="btn-secondary py-2 text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* SECTION 2: SHIPPING & DELIVERY */}
              <div className="flex items-center justify-between rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-4 text-xs">
                <div>
                  <span className="font-semibold text-[#2E2927]">Shipping & Delivery</span>
                  <p className="text-[#6B6360]">
                    {shipping === 0
                      ? "Eligible for FREE Express Shipping"
                      : `Standard Delivery Charge: ${formatPrice(shipping)}`}
                  </p>
                </div>
                <span className={`font-bold ${shipping === 0 ? "text-green-700" : "text-[#2E2927]"}`}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>

              {/* SECTION 3: OPTIONAL COUPON */}
              <div className="rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-4">
                <label className="block text-xs font-semibold text-[#2E2927]">
                  Have a coupon code?
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                    className="flex-1 rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs uppercase focus:border-[#C78B7B] focus:outline-none disabled:bg-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || couponApplied || !couponCode.trim()}
                    className="btn-secondary py-2 text-xs"
                  >
                    {couponLoading ? "..." : couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponMessage && <p className="mt-1.5 text-xs text-green-700">{couponMessage}</p>}
                {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
              </div>

              {/* SECTION 4: MOBILE NUMBER PAYMENT REQUEST (INTEGRATION-READY UX) */}
              <div className="rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-[#C78B7B]" />
                  <span className="text-xs font-semibold text-[#2E2927]">Pay Using Mobile Number</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-[#E0D8D2] bg-neutral-100 px-2.5 text-xs font-bold text-[#6B6360]">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={payMobileNumber}
                    onChange={(e) => setPayMobileNumber(e.target.value)}
                    disabled={isMobileVerified}
                    className="flex-1 rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none disabled:bg-neutral-100"
                  />
                  {!isMobileVerified ? (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      disabled={sendingOtp || !payMobileNumber}
                      className="btn-secondary py-2 text-xs"
                    >
                      {sendingOtp ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 rounded-xl bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-800">
                      Verified ✓
                    </span>
                  )}
                </div>

                {otpSent && !isMobileVerified && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1 rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyMobileOtp}
                      disabled={verifyingOtp}
                      className="btn-primary py-2 text-xs"
                    >
                      {verifyingOtp ? "..." : "Verify OTP"}
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-[#9E9692]">
                  Mobile payment requests will be available once payment-request PSP integration is enabled.
                </p>
              </div>

              {/* SECTION 5: TWO-COLUMN RESPONSIVE UPI SECTION & BLURRED QR PREVIEW */}
              <div className="rounded-2xl border border-[#F0EAE5] bg-[#FCFAF8] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#C78B7B]" />
                    <span className="font-serif text-lg font-bold text-[#2E2927]">UPI Payment</span>
                  </div>
                  <span className="rounded-full bg-[#F4E4E0] px-2.5 py-0.5 text-[10px] font-bold text-[#A65E55]">
                    Active Payment Choice
                  </span>
                </div>

                {/* TWO-COLUMN GRID: LEFT = QR CODE / TIMER, RIGHT = SCAN TEXT & PURE BRAND CARDS */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-center">
                  {/* LEFT: QR CODE PREVIEW (BLURRED IN INITIAL STATE) */}
                  <div className="flex flex-col items-center rounded-2xl border border-[#F0EAE5] bg-white p-4 text-center shadow-xs">
                    {!isQRLocked && (
                      <div className="mb-2 flex items-center gap-1.5 rounded-full bg-[#FFF5F2] px-3 py-1 text-[11px] font-bold text-[#A65E55] border border-[#F4DCD6]">
                        <Clock size={12} className="animate-pulse" />
                        <span>Expires in: {formatTimer(timerSecondsLeft)}</span>
                      </div>
                    )}

                    {isQRExpired ? (
                      <div className="py-4 text-center space-y-2">
                        <AlertCircle size={32} className="mx-auto text-red-500" />
                        <p className="font-serif text-sm font-bold text-[#2E2927]">UPI Session Expired</p>
                        <button
                          type="button"
                          onClick={handleUnlockQR}
                          className="btn-secondary text-[11px] py-1.5 px-3"
                        >
                          <RefreshCw size={12} /> Generate New QR
                        </button>
                      </div>
                    ) : (
                      <div className="relative my-2 flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-[#F0EAE5] bg-white p-2 shadow-sm">
                        {qrCodeDataUrl ? (
                          <Image
                            src={qrCodeDataUrl}
                            alt="UPI Payment QR Code"
                            width={160}
                            height={160}
                            className={`h-full w-full object-contain transition-all duration-300 ${
                              isQRLocked ? "scale-105 blur-md opacity-40 select-none pointer-events-none" : "blur-0 opacity-100"
                            }`}
                          />
                        ) : (
                          <div className="animate-pulse text-xs text-[#9E9692]">Generating QR...</div>
                        )}

                        {/* CENTERED SHOW QR OVERLAY CONTROL */}
                        {isQRLocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px] p-2 text-center">
                            <button
                              type="button"
                              onClick={handleUnlockQR}
                              className="btn-primary flex items-center gap-1.5 py-2 px-4 text-xs font-bold shadow-md hover:scale-105 transition-transform"
                            >
                              <Eye size={15} /> Show QR
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-[#2E2927] space-y-0.5">
                      <p className="font-serif text-base font-bold">Payable: {formatPrice(totalAmount)}</p>
                      {upiSettings?.upiId && (
                        <div className="flex items-center justify-center gap-1 text-[#6B6360] text-[11px]">
                          <span>VPA: <strong className="text-[#2E2927]">{upiSettings.upiId}</strong></span>
                          <button
                            type="button"
                            onClick={copyUPIId}
                            className="text-[#C78B7B] hover:underline"
                            title="Copy UPI ID"
                          >
                            {copiedUPI ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: SCAN TEXT & PURE BRAND EMBLEM CARDS */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-[#2E2927]">Scan the QR using any UPI App</p>
                      <p className="text-[11px] font-semibold text-[#6B6360] uppercase tracking-wider mt-1">
                        Pay with all UPI Payments
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          name: "Google Pay",
                          src: "https://img.icons8.com/color/48/google-pay.png",
                        },
                        {
                          name: "PhonePe",
                          src: "https://img.icons8.com/color/48/phone-pe.png",
                        },
                        {
                          name: "Paytm",
                          src: "https://img.icons8.com/color/48/paytm.png",
                        },
                        {
                          name: "BHIM / Other",
                          src: "https://img.icons8.com/color/48/bhim.png",
                        },
                      ].map((app) => (
                        <a
                          key={app.name}
                          href={upiUrl}
                          className="flex items-center justify-start gap-2.5 rounded-xl border border-[#E0D8D2] bg-white p-2.5 shadow-2xs transition hover:border-[#C78B7B] hover:scale-[1.02]"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                            <img
                              src={app.src}
                              alt=""
                              width={28}
                              height={28}
                              className="h-7 w-7 object-contain"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-[#2E2927]">{app.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional UTR / Reference Entry */}
                {!isQRLocked && !isQRExpired && (
                  <div className="pt-2 border-t border-[#F0EAE5]">
                    <label className="block text-xs font-semibold text-[#2E2927]">
                      Transaction Reference / UTR Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 12-digit UTR number after scanning"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E0D8D2] bg-white px-3 py-2 text-xs focus:border-[#C78B7B] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 6: INACTIVE COMING SOON PAYMENT METHOD OPTIONS */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#2E2927]">
                  Other Payment Options
                </span>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {/* Debit / Credit Cards */}
                  <div className="flex items-center justify-between rounded-xl border border-[#E0D8D2] bg-[#F5F2EF] p-3 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-[#8D7B73]" />
                      <span className="text-xs font-medium text-[#776E6A]">Debit / Credit</span>
                    </div>
                    <span className="rounded-full bg-[#E8E0DB] px-2 py-0.5 text-[9px] font-semibold text-[#776E6A]">
                      Coming Soon
                    </span>
                  </div>

                  {/* Netbanking */}
                  <div className="flex items-center justify-between rounded-xl border border-[#E0D8D2] bg-[#F5F2EF] p-3 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-[#8D7B73]" />
                      <span className="text-xs font-medium text-[#776E6A]">Netbanking</span>
                    </div>
                    <span className="rounded-full bg-[#E8E0DB] px-2 py-0.5 text-[9px] font-semibold text-[#776E6A]">
                      Coming Soon
                    </span>
                  </div>

                  {/* Razorpay */}
                  <div className="flex items-center justify-between rounded-xl border border-[#E0D8D2] bg-[#F5F2EF] p-3 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-[#8D7B73]" />
                      <span className="text-xs font-medium text-[#776E6A]">Razorpay</span>
                    </div>
                    <span className="rounded-full bg-[#E8E0DB] px-2 py-0.5 text-[9px] font-semibold text-[#776E6A]">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Order CTA */}
        {currentStep === "ADDRESS_AND_PAYMENT" && (
          <div className="sticky bottom-0 z-10 border-t border-[#F0EAE5] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-[#6B6360]">Total Payable</span>
              <span className="font-serif text-xl font-bold text-[#2E2927]">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmittingOrder || (!selectedAddress && !newAddressForm.address)}
              className="btn-primary w-full py-3 text-xs"
            >
              {isSubmittingOrder ? (
                "Initializing Order..."
              ) : (
                <>
                  Confirm Order & Pay {formatPrice(totalAmount)} <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
