"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Upload, CheckCircle, Image as ImageIcon } from "lucide-react";

import api from "@/lib/api";

interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

interface Order {
  _id: string;
  customerName: string;
  email: string;
  orderStatus: string;
  products: OrderProduct[];
}

export default function ShareYourLookPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [image, setImage] = useState<File | null>(
    null
  );

  const [preview, setPreview] = useState("");

  const [instagramUsername, setInstagramUsername] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const [rating, setRating] = useState(5);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Load Order
  // ==========================================

  useEffect(() => {
    if (!orderId) {
      setError(
        "No order was provided."
      );

      setLoading(false);

      return;
    }

    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/orders/my-orders/${orderId}`
      );

      const fetchedOrder =
        res.data.order;

      // Only delivered orders
      if (
        fetchedOrder.orderStatus !==
        "Delivered"
      ) {
        setError(
          "You can share your look after your order has been delivered."
        );

        return;
      }

      setOrder(fetchedOrder);

      // Select first product automatically
      if (
        fetchedOrder.products?.length > 0
      ) {
        setSelectedProduct(
          fetchedOrder.products[0].productId
        );
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Image Selection
  // ==========================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Please select an image smaller than 5MB."
      );

      return;
    }

    // Image type validation
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image."
      );

      return;
    }

    setError("");

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // Upload Image
  // ==========================================

  const uploadImage = async () => {
    if (!image) {
      throw new Error(
        "Please select an image."
      );
    }

    const formData = new FormData();

    formData.append(
      "image",
      image
    );

    const res = await api.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data.imageUrl;
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!order) {
      setError(
        "Order information is missing."
      );

      return;
    }

    if (!selectedProduct) {
      setError(
        "Please select a product."
      );

      return;
    }

    if (!image) {
      setError(
        "Please upload your photo."
      );

      return;
    }

    try {
      setSubmitting(true);

      // ========================================
      // Upload to Cloudinary
      // ========================================

      setUploading(true);

      const imageUrl =
        await uploadImage();

      setUploading(false);

      // ========================================
      // Submit Customer Look
      // ========================================

      await api.post(
        "/customer-looks",
        {
          orderId: order._id,

          productId:
            selectedProduct,

          image: imageUrl,

          instagramUsername:
            instagramUsername.trim(),

          feedback:
            feedback.trim(),

          rating,
        }
      );

      setSuccess(true);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit your look."
      );
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD5] border-t-[#C78B7B]" />

          <p className="mt-4 text-[#6B5A55]">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // Success
  // ==========================================

  if (success) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle
              size={42}
              className="text-green-600"
            />
          </div>

          <h1 className="mt-6 font-serif text-4xl text-[#2E2E2E]">
            Thank You! ❤️
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
            Your look has been submitted
            successfully.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Our team will review your photo
            before featuring it on our
            website or Instagram.
          </p>

          <button
            type="button"
            onClick={() =>
              (window.location.href = "/")
            }
            className="mt-8 rounded-full bg-[#C78B7B] px-8 py-3 font-semibold text-white transition hover:bg-[#B5776B]"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // Error / Invalid Order
  // ==========================================

  if (!order || error) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

          <h1 className="font-serif text-3xl text-[#2E2E2E]">
            Unable to Share Your Look
          </h1>

          <p className="mt-4 text-gray-600">
            {error ||
              "We couldn't find your order."}
          </p>

          <button
            type="button"
            onClick={() =>
              (window.location.href = "/")
            }
            className="mt-8 rounded-full bg-[#C78B7B] px-8 py-3 font-semibold text-white"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // Main Page
  // ==========================================

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 md:py-20">

      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="mb-10 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C78B7B]">
            Customer Love
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#2E2E2E] md:text-5xl">
            Share Your Look
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
            Love your new jewellery?
            Show us how you style it. ❤️
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-xl md:p-10"
        >

          {/* Product */}

          <div>

            <label className="mb-4 block text-sm font-semibold text-[#2E2E2E]">
              Which product are you
              wearing?
            </label>

            <div className="grid gap-4 md:grid-cols-2">

              {order.products.map(
                (product) => (
                  <button
                    key={
                      product.productId
                    }
                    type="button"
                    onClick={() =>
                      setSelectedProduct(
                        product.productId
                      )
                    }
                    className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                      selectedProduct ===
                      product.productId
                        ? "border-[#C78B7B] bg-[#FFF7F3]"
                        : "border-gray-200 hover:border-[#D8B5A9]"
                    }`}
                  >

                    <img
                      src={
                        product.image ||
                        "/placeholder.jpg"
                      }
                      alt={
                        product.name
                      }
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-semibold text-[#2E2E2E]">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      {selectedProduct ===
                        product.productId && (
                        <p className="mt-1 text-xs font-semibold text-[#C78B7B]">
                          Selected ✓
                        </p>
                      )}
                    </div>

                  </button>
                )
              )}

            </div>
          </div>

          {/* Upload */}

          <div className="mt-10">

            <label className="mb-4 block text-sm font-semibold text-[#2E2E2E]">
              Upload your photo
            </label>

            <label className="block cursor-pointer">

              <div className="overflow-hidden rounded-2xl border-2 border-dashed border-[#D8C8BE] bg-[#FCFAF7] p-6 text-center transition hover:border-[#C78B7B]">

                {preview ? (
                  <div>

                    <img
                      src={preview}
                      alt="Your preview"
                      className="mx-auto max-h-96 rounded-xl object-contain"
                    />

                    <p className="mt-4 text-sm font-semibold text-[#C78B7B]">
                      Choose another photo
                    </p>

                  </div>
                ) : (
                  <div className="py-10">

                    <Upload
                      size={36}
                      className="mx-auto text-[#C78B7B]"
                    />

                    <p className="mt-4 font-semibold text-[#2E2E2E]">
                      Upload your look
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG or WEBP ·
                      Maximum 5MB
                    </p>

                  </div>
                )}

              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>
          </div>

          {/* Instagram */}

          <div className="mt-8">

            <label className="mb-2 block text-sm font-semibold text-[#2E2E2E]">
              Instagram Username
              <span className="ml-2 font-normal text-gray-400">
                Optional
              </span>
            </label>

            <input
              type="text"
              value={
                instagramUsername
              }
              onChange={(e) =>
                setInstagramUsername(
                  e.target.value
                )
              }
              placeholder="@yourusername"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/20"
            />

          </div>

          {/* Feedback */}

          <div className="mt-8">

            <label className="mb-2 block text-sm font-semibold text-[#2E2E2E]">
              Your Feedback
            </label>

            <textarea
              value={feedback}
              onChange={(e) =>
                setFeedback(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Tell us what you think about your jewellery..."
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/20"
            />

          </div>

          {/* Rating */}

          <div className="mt-8">

            <label className="mb-3 block text-sm font-semibold text-[#2E2E2E]">
              Your Rating
            </label>

            <div className="flex gap-2">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={30}
                      className={
                        star <= rating
                          ? "fill-[#D6B36A] text-[#D6B36A]"
                          : "text-gray-300"
                      }
                    />
                  </button>
                )
              )}

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={
              submitting ||
              uploading
            }
            className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-[#C78B7B] px-6 py-4 font-semibold text-white transition hover:bg-[#B5776B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ||
            uploading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                {uploading
                  ? "Uploading Photo..."
                  : "Submitting..."}
              </>
            ) : (
              <>
                <ImageIcon
                  size={20}
                />

                Submit Your Look
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            By submitting, you agree that
            your photo and feedback may be
            featured on our website or
            social media after approval.
          </p>

        </form>
      </div>
    </main>
  );
}