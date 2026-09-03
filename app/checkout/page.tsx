"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CheckoutPaymentModal from "@/components/checkout/CheckoutPaymentModal";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CheckoutPage() {
  const router = useRouter();

  const handleClose = () => {
    const origin = typeof window !== "undefined" ? sessionStorage.getItem("checkout_origin") : null;
    if (origin && origin !== "/checkout") {
      router.push(origin);
    } else {
      router.push("/cart");
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FCFAF7]">
        <Navbar />
        <CheckoutPaymentModal isOpen={true} onClose={handleClose} />
        <Footer />
      </main>
    </ProtectedRoute>
  );
}