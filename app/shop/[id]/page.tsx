"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
} from "lucide-react";

import api from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  // ==========================================
  // Product
  // ==========================================

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // ==========================================
  // Quantity / Options
  // ==========================================

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // ==========================================
  // Reviews
  // ==========================================

  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });

  // ==========================================
  // Product Tabs
  // ==========================================

  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");

  // ==========================================
  // Delivery
  // ==========================================

  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  // ==========================================
  // Fetch
  // ==========================================

  useEffect(() => {
    if (!id) return;

    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  // ==========================================
  // Fetch Product
  // ==========================================

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);

      const productData = response.data.product;

      setProduct(productData);

      // First image becomes main image
      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0]);
      }

      if (productData.colors?.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      if (productData.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (error) {
      console.error("Product Error:", error);
    }
  };

  // ==========================================
  // Related Products
  // ==========================================

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get(
        `/products/related/${id}`
      );

      const products = response.data.products.map(
        (item: any) => ({
          id: item._id,
          name: item.name,
          price:
            item.discountPrice > 0
              ? item.discountPrice
              : item.price,
          originalPrice: item.price,
          image:
            item.images?.[0] ||
            "/hero-jewelry.png",
          hoverImage:
            item.images?.[1],
          category: item.category,
          badge: item.featured
            ? "Featured"
            : "",
        })
      );

      setRelatedProducts(products);
    } catch (error) {
      console.error(
        "Related Products Error:",
        error
      );
    }
  };

  // ==========================================
  // Reviews
  // ==========================================

  const fetchReviews = async () => {
    try {
      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(response.data.reviews || []);

      setAverageRating(
        Number(
          response.data.averageRating || 0
        )
      );

      setTotalReviews(
        Number(
          response.data.totalReviews || 0
        )
      );
    } catch (error) {
      console.error("Review Error:", error);
    }
  };

  // ==========================================
  // Submit Review
  // ==========================================

  const submitReview = async () => {
    if (
      !reviewForm.customerName.trim() ||
      !reviewForm.comment.trim()
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      await api.post("/reviews", {
        product: product._id,
        customerName:
          reviewForm.customerName,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      alert(
        "Review submitted successfully.\nIt will appear after admin approval."
      );

      setReviewForm({
        customerName: "",
        rating: 5,
        comment: "",
      });

      fetchReviews();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FCFAF8]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#C78B7B] border-t-transparent" />

            <p className="text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // Product Calculations
  // ==========================================

  const favorite = isInWishlist(product._id);

  const hasDiscount =
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) <
      Number(product.price);

  const sellingPrice = hasDiscount
    ? Number(product.discountPrice)
    : Number(product.price);

  const discount = hasDiscount
    ? Math.round(
        ((Number(product.price) -
          Number(product.discountPrice)) /
          Number(product.price)) *
          100
      )
    : 0;

  // ==========================================
  // Cart
  // ==========================================

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    if (
      product.colors?.length > 0 &&
      !selectedColor
    ) {
      alert("Please select a color.");
      return;
    }

    if (
      product.sizes?.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      image:
        product.images?.[0] ||
        "/placeholder-product.jpg",
      price: sellingPrice,
      stock: product.stock,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  // ==========================================
  // Wishlist
  // ==========================================

  const handleWishlist = () => {
    if (favorite) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        image:
          product.images?.[0] ||
          "/placeholder-product.jpg",
        price: sellingPrice,
      });
    }
  };

  // ==========================================
  // Buy Now
  // ==========================================

  const handleBuyNow = () => {
    if (product.stock <= 0) return;

    if (
      product.colors?.length > 0 &&
      !selectedColor
    ) {
      alert("Please select a color.");
      return;
    }

    if (
      product.sizes?.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      image:
        product.images?.[0] ||
        "/placeholder-product.jpg",
      price: sellingPrice,
      stock: product.stock,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });

    router.push("/checkout");
  };

  // ==========================================
  // Delivery Check
  // ==========================================

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    setDeliveryMessage(
      "Delivery available to your location."
    );
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="bg-[#FCFAF8]">

        {/* ======================================
            Breadcrumb
        ====================================== */}

        <div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">

            <Link
              href="/"
              className="transition hover:text-[#C78B7B]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href={`/shop?category=${encodeURIComponent(
                product.category
              )}`}
              className="transition hover:text-[#C78B7B]"
            >
              {product.category}
            </Link>

            <span>/</span>

            <span className="max-w-[250px] truncate text-gray-700">
              {product.name}
            </span>

          </div>
        </div>

        {/* ======================================
            Main Product
        ====================================== */}

        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-12">

            {/* ==================================
                LEFT - PRODUCT GALLERY
            ================================== */}

            <div className="grid gap-4 sm:grid-cols-[78px_minmax(0,1fr)]">

              {/* ================================
                  Product Thumbnails
              ================================= */}

              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">

                {product.images?.map(
                  (
                    image: string,
                    index: number
                  ) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      aria-label={
                        index === 0
                          ? "View product image"
                          : "View worn image"
                      }
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                        selectedImage === image
                          ? "border-[#C78B7B] ring-2 ring-[#C78B7B]/20"
                          : "border-[#E7DED8] hover:border-[#C78B7B]"
                      }`}
                    >

                      <Image
                        src={
                          image ||
                          "/hero-jewelry.png"
                        }
                        alt={`${product.name} ${
                          index === 0
                            ? "Product Image"
                            : "Wear Image"
                        }`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />

                      {/* Thumbnail Label */}

                      <span className="absolute bottom-0 left-0 right-0 bg-black/45 px-1 py-1 text-center text-[8px] font-medium uppercase tracking-wider text-white">
                        {index === 0
                          ? "Product"
                          : "Wear"}
                      </span>

                    </button>
                  )
                )}

              </div>

              {/* ================================
                  Main Image
              ================================= */}

              <div className="order-1 sm:order-2">

                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F0EC]">

                  <Image
                    src={
                      selectedImage ||
                      product.images?.[0] ||
                      "/placeholder-product.jpg"
                    }
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Featured Badge */}

                  {product.featured && (
                    <span className="absolute left-5 top-5 rounded-full bg-[#C78B7B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                      Featured
                    </span>
                  )}

                  {/* Discount Badge */}

                  {hasDiscount && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#3A2528] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                      {discount}% OFF
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* ==================================
                RIGHT - PRODUCT INFO
            ================================== */}

            <div className="lg:pt-1">

              {/* Category */}

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                {product.category}
              </p>

              {/* Product Name */}

              <h1 className="mt-2 font-serif text-3xl leading-tight text-[#2E2E2E] sm:text-4xl">
                {product.name}
              </h1>

              {/* Collection */}

              {product.collection && (
                <p className="mt-2 text-sm text-[#8A6A62]">
                  {product.collection}
                </p>
              )}

              {/* Rating */}

              <div className="mt-4 flex items-center gap-3">

                <div className="flex items-center gap-0.5">

                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={
                        index <
                        Math.round(
                          averageRating || 0
                        )
                          ? "fill-[#D6B36A] text-[#D6B36A]"
                          : "text-[#D6B36A]/30"
                      }
                    />
                  ))}

                </div>

                <span className="text-sm font-medium text-[#444]">
                  {averageRating > 0
                    ? averageRating.toFixed(1)
                    : "No rating"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("reviews")
                  }
                  className="text-sm text-gray-500 underline-offset-4 hover:underline"
                >
                  {totalReviews} Reviews
                </button>

              </div>

              {/* Divider */}

              <div className="my-5 h-px bg-[#E8E0DB]" />

              {/* Price */}

              <div className="flex flex-wrap items-center gap-3">

                <span className="font-serif text-3xl font-semibold text-[#2E2E2E]">
                  ₹{sellingPrice.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </span>

                    <span className="rounded-full bg-[#F4E4E0] px-2.5 py-1 text-xs font-semibold text-[#A65E55]">
                      {discount}% OFF
                    </span>
                  </>
                )}

              </div>

              {/* Free Delivery */}

              {sellingPrice >= 499 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#596B55]">
                  <Truck size={16} />

                  <span>
                    Free delivery available
                  </span>
                </div>
              )}

              {/* Description */}

              {product.description && (
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#6B6B6B]">
                  {product.description}
                </p>
              )}

              {/* Stock */}

              <div className="mt-5">

                {product.stock > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-[#EAF4E7] px-3 py-1.5 text-xs font-medium text-[#55734E]">
                    {product.stock} Available
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-[#FCE8E8] px-3 py-1.5 text-xs font-medium text-red-600">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* Color Selection */}

              {product.colors?.length > 0 && (
                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                      Color
                    </p>

                    <span className="text-xs text-[#777]">
                      {selectedColor}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.colors.map(
                      (color: string) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setSelectedColor(
                              color
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            selectedColor ===
                            color
                              ? "border-[#3A2528] bg-[#3A2528] text-white"
                              : "border-[#DCD3CE] bg-white text-[#444] hover:border-[#C78B7B]"
                          }`}
                        >
                          {color}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Size Selection */}

              {product.sizes?.length > 0 && (
                <div className="mt-5">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                      Size
                    </p>

                    <span className="text-xs text-[#777]">
                      {selectedSize}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.sizes.map(
                      (size: string) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(size)
                          }
                          className={`min-w-[52px] rounded-full border px-4 py-2 text-sm transition ${
                            selectedSize ===
                            size
                              ? "border-[#3A2528] bg-[#3A2528] text-white"
                              : "border-[#DCD3CE] bg-white text-[#444] hover:border-[#C78B7B]"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Quantity */}

              <div className="mt-6">

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                  Quantity
                </p>

                <div className="flex h-11 w-fit items-center rounded-full border border-[#DED5D0] bg-white">

                  <button
                    type="button"
                    onClick={() =>
                      quantity > 1 &&
                      setQuantity(
                        quantity - 1
                      )
                    }
                    className="flex h-full w-11 items-center justify-center rounded-l-full transition hover:bg-[#F7F2EF]"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-10 text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    disabled={
                      quantity >=
                      product.stock
                    }
                    onClick={() =>
                      quantity <
                        product.stock &&
                      setQuantity(
                        quantity + 1
                      )
                    }
                    className="flex h-full w-11 items-center justify-center rounded-r-full transition hover:bg-[#F7F2EF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>

                </div>

              </div>

              {/* Actions */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#3A2528] px-4 text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={handleBuyNow}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#C78B7B] px-4 text-sm font-semibold text-white transition hover:bg-[#B87969] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap size={17} />
                  Buy Now
                </button>

              </div>

              {/* Wishlist */}

              <button
                type="button"
                onClick={handleWishlist}
                className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition ${
                  favorite
                    ? "border-[#C78B7B] bg-[#FCF1EE] text-[#C78B7B]"
                    : "border-[#DCD3CE] bg-white text-[#444] hover:border-[#C78B7B] hover:text-[#C78B7B]"
                }`}
              >
                <Heart
                  size={17}
                  className={
                    favorite
                      ? "fill-current"
                      : ""
                  }
                />

                {favorite
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>

              {/* Delivery Check */}

              <div className="mt-6 rounded-xl border border-[#E8E0DB] bg-white p-4">

                <div className="mb-3 flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-[#C78B7B]"
                  />

                  <p className="text-sm font-semibold text-[#333]">
                    Check Delivery
                  </p>

                </div>

                <div className="flex gap-2">

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter pincode"
                    className="h-10 min-w-0 flex-1 rounded-lg border border-[#DED5D0] px-3 text-sm outline-none focus:border-[#C78B7B]"
                  />

                  <button
                    type="button"
                    onClick={checkDelivery}
                    className="h-10 rounded-lg bg-[#F4EEEB] px-4 text-sm font-semibold text-[#3A2528] transition hover:bg-[#EDE2DD]"
                  >
                    Check
                  </button>

                </div>

                {deliveryMessage && (
                  <p className="mt-2 text-xs text-[#66705F]">
                    {deliveryMessage}
                  </p>
                )}

              </div>

              {/* Service Features */}

              <div className="mt-5 grid grid-cols-3 gap-2">

                <div className="rounded-lg border border-[#E8E0DB] bg-white p-3 text-center">

                  <Truck
                    size={18}
                    className="mx-auto text-[#C78B7B]"
                  />

                  <p className="mt-2 text-[10px] font-medium text-[#555]">
                    Free Shipping
                  </p>

                </div>

                <div className="rounded-lg border border-[#E8E0DB] bg-white p-3 text-center">

                  <ShieldCheck
                    size={18}
                    className="mx-auto text-[#C78B7B]"
                  />

                  <p className="mt-2 text-[10px] font-medium text-[#555]">
                    Secure Payment
                  </p>

                </div>

                <div className="rounded-lg border border-[#E8E0DB] bg-white p-3 text-center">

                  <RotateCcw
                    size={18}
                    className="mx-auto text-[#C78B7B]"
                  />

                  <p className="mt-2 text-[10px] font-medium text-[#555]">
                    Easy Returns
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================
            DESCRIPTION / SPECS / REVIEWS
        ====================================== */}

        <section className="border-t border-[#E8E0DB] bg-white">

          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

            {/* Tabs */}

            <div className="flex overflow-x-auto border-b border-[#E8E0DB]">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("description")
                }
                className={`whitespace-nowrap border-b-2 px-5 pb-4 text-sm font-medium transition ${
                  activeTab === "description"
                    ? "border-[#C78B7B] text-[#3A2528]"
                    : "border-transparent text-gray-500 hover:text-[#3A2528]"
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("specifications")
                }
                className={`whitespace-nowrap border-b-2 px-5 pb-4 text-sm font-medium transition ${
                  activeTab ===
                  "specifications"
                    ? "border-[#C78B7B] text-[#3A2528]"
                    : "border-transparent text-gray-500 hover:text-[#3A2528]"
                }`}
              >
                Specifications
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("reviews")
                }
                className={`whitespace-nowrap border-b-2 px-5 pb-4 text-sm font-medium transition ${
                  activeTab === "reviews"
                    ? "border-[#C78B7B] text-[#3A2528]"
                    : "border-transparent text-gray-500 hover:text-[#3A2528]"
                }`}
              >
                Reviews ({totalReviews})
              </button>

            </div>

            {/* Description */}

            {activeTab === "description" && (
              <div className="max-w-4xl py-8">

                <h2 className="font-serif text-2xl text-[#2E2E2E]">
                  Product Description
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#666]">
                  {product.description ||
                    "A beautiful jewellery piece designed to complement your everyday style and special occasions."}
                </p>

              </div>
            )}

            {/* Specifications */}

            {activeTab ===
              "specifications" && (
              <div className="max-w-3xl py-8">

                <h2 className="font-serif text-2xl text-[#2E2E2E]">
                  Product Specifications
                </h2>

                <div className="mt-5 overflow-hidden rounded-xl border border-[#E8E0DB]">

                  <div className="grid grid-cols-2 border-b border-[#E8E0DB] bg-[#FCFAF8]">

                    <span className="p-4 text-sm font-medium text-[#555]">
                      Category
                    </span>

                    <span className="p-4 text-sm text-[#666]">
                      {product.category ||
                        "Jewellery"}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 border-b border-[#E8E0DB]">

                    <span className="p-4 text-sm font-medium text-[#555]">
                      Collection
                    </span>

                    <span className="p-4 text-sm text-[#666]">
                      {product.collection ||
                        "—"}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 border-b border-[#E8E0DB] bg-[#FCFAF8]">

                    <span className="p-4 text-sm font-medium text-[#555]">
                      Availability
                    </span>

                    <span className="p-4 text-sm text-[#666]">
                      {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>

                  </div>

                  <div className="grid grid-cols-2">

                    <span className="p-4 text-sm font-medium text-[#555]">
                      Product ID
                    </span>

                    <span className="break-all p-4 text-sm text-[#666]">
                      {product._id}
                    </span>

                  </div>

                </div>

              </div>
            )}

            {/* Reviews */}

            {activeTab === "reviews" && (
              <div className="py-8">

                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

                  {/* Rating Summary */}

                  <div className="rounded-xl border border-[#E8E0DB] bg-[#FCFAF8] p-6">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C78B7B]">
                      Customer Reviews
                    </p>

                    <div className="mt-4 flex items-center gap-3">

                      <span className="font-serif text-4xl text-[#2E2E2E]">
                        {averageRating
                          ? averageRating.toFixed(
                              1
                            )
                          : "0.0"}
                      </span>

                      <div>

                        <div className="flex">

                          {Array.from({
                            length: 5,
                          }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                size={15}
                                className={
                                  index <
                                  Math.round(
                                    averageRating
                                  )
                                    ? "fill-[#D6B36A] text-[#D6B36A]"
                                    : "text-[#D6B36A]/30"
                                }
                              />
                            )
                          )}

                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {totalReviews} Reviews
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Reviews List */}

                  <div>

                    {reviews.length === 0 ? (
                      <p className="rounded-xl border border-[#E8E0DB] p-6 text-sm text-gray-500">
                        No reviews yet. Be the
                        first to review this
                        product.
                      </p>
                    ) : (
                      <div className="space-y-4">

                        {reviews.map(
                          (review) => (
                            <div
                              key={review._id}
                              className="rounded-xl border border-[#E8E0DB] bg-white p-5"
                            >

                              <div className="flex items-center gap-1">

                                {[
                                  1,
                                  2,
                                  3,
                                  4,
                                  5,
                                ].map(
                                  (star) => (
                                    <Star
                                      key={
                                        star
                                      }
                                      size={
                                        14
                                      }
                                      className={
                                        star <=
                                        review.rating
                                          ? "fill-[#D6B36A] text-[#D6B36A]"
                                          : "text-gray-300"
                                      }
                                    />
                                  )
                                )}

                              </div>

                              <h4 className="mt-2 text-sm font-semibold text-[#333]">
                                {
                                  review.customerName
                                }
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                {
                                  review.comment
                                }
                              </p>

                            </div>
                          )
                        )}

                      </div>
                    )}

                    {/* Review Form */}

                    <div className="mt-8 rounded-xl border border-[#E8E0DB] bg-[#FCFAF8] p-6">

                      <h3 className="font-serif text-xl text-[#2E2E2E]">
                        Write a Review
                      </h3>

                      <div className="mt-5 space-y-4">

                        <input
                          placeholder="Your Name"
                          value={
                            reviewForm.customerName
                          }
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              customerName:
                                e.target.value,
                            })
                          }
                          className="h-11 w-full rounded-lg border border-[#DDD4CF] bg-white px-4 text-sm outline-none focus:border-[#C78B7B]"
                        />

                        <select
                          value={
                            reviewForm.rating
                          }
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              rating: Number(
                                e.target.value
                              ),
                            })
                          }
                          className="h-11 w-full rounded-lg border border-[#DDD4CF] bg-white px-4 text-sm outline-none focus:border-[#C78B7B]"
                        >
                          <option value={5}>
                            ★★★★★
                          </option>

                          <option value={4}>
                            ★★★★☆
                          </option>

                          <option value={3}>
                            ★★★☆☆
                          </option>

                          <option value={2}>
                            ★★☆☆☆
                          </option>

                          <option value={1}>
                            ★☆☆☆☆
                          </option>
                        </select>

                        <textarea
                          rows={4}
                          placeholder="Write your review..."
                          value={
                            reviewForm.comment
                          }
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              comment:
                                e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-[#DDD4CF] bg-white p-4 text-sm outline-none focus:border-[#C78B7B]"
                        />

                        <button
                          type="button"
                          onClick={
                            submitReview
                          }
                          className="rounded-full bg-[#3A2528] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#29181B]"
                        >
                          Submit Review
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ======================================
            RELATED PRODUCTS
        ====================================== */}

        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

            <div className="mb-8 flex items-end justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                  Complete Your Look
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                  You May Also Like
                </h2>

              </div>

              <Link
                href="/shop"
                className="hidden text-sm font-medium text-[#3A2528] underline-offset-4 hover:underline sm:block"
              >
                View All
              </Link>

            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">

              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={item.id}
                    {...item}
                  />
                )
              )}

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}