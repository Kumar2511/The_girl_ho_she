"use client";

import { useEffect, useRef, useState } from "react";
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Bell,
  X,
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

  const [selectedImage, setSelectedImage] =
    useState("");

  const [selectedMedia, setSelectedMedia] =
    useState<"image" | "video">("image");

  const [relatedProducts, setRelatedProducts] =
    useState<any[]>([]);

  // ==========================================
  // Gallery Viewer
  // ==========================================

  const [isGalleryOpen, setIsGalleryOpen] =useState(false);

  const [galleryIndex, setGalleryIndex] =useState(0);
  const [touchStartX, setTouchStartX] =
  useState<number | null>(null);

const [touchEndX, setTouchEndX] =
  useState<number | null>(null);

  // ==========================================
  // Video Player
  // ==========================================

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const [isVideoPlaying, setIsVideoPlaying] =
    useState(true);

  const [isVideoMuted, setIsVideoMuted] =
    useState(true);

  const [videoProgress, setVideoProgress] =
    useState(0);

  const [videoCurrentTime, setVideoCurrentTime] =
    useState(0);

  const [videoDuration, setVideoDuration] =
    useState(0);

  // ==========================================
  // Quantity / Options
  // ==========================================

  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

    // ==========================================
// STOCK NOTIFICATION
// ==========================================

const [showNotifyModal, setShowNotifyModal] =
  useState(false);

const [notifyEmail, setNotifyEmail] =
  useState("");

const [notifyLoading, setNotifyLoading] =
  useState(false);

const [notifySuccess, setNotifySuccess] =
  useState("");
  
  // ==========================================
  // Reviews
  // ==========================================

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  // Verified purchase review eligibility

  const [reviewOrderId, setReviewOrderId] =
    useState<string | null>(null);

  const [canReview, setCanReview] =
    useState(false);

  const [reviewChecking, setReviewChecking] =
    useState(false);

  const [reviewForm, setReviewForm] =
    useState({
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

  const [pincode, setPincode] =
    useState("");

  const [deliveryMessage, setDeliveryMessage] =
    useState("");

  // ==========================================
  // Fetch
  // ==========================================

  useEffect(() => {
    if (!id) return;

    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
    findReviewOrder();
  }, [id]);

  // ==========================================
  // Fetch Product
  // ==========================================

  const fetchProduct = async () => {
    try {
      const response = await api.get(
        `/products/${id}`
      );

      const data = response.data.product;

      const productImages =
        Array.isArray(data.images)
          ? data.images.filter(Boolean)
          : [];

      setProduct({
        _id: data._id,

        name: data.name,

        description:
          data.description || "",

        category:
          data.category || "Jewellery",

        collection:
          data.collection || "",

        price: data.price || 0,

        discountPrice:
          data.discountPrice || 0,

        images: productImages,

        video: data.video || "",

        colors: data.colors || [],

        sizes: data.sizes || [],

        stock: data.stock || 0,

        featured:
          data.featured || false,

        bestSeller:
          data.bestSeller || false,

        newArrival:
          data.newArrival || false,

        trending:
          data.trending || false,

        instagramLink:
          data.instagramLink || "",

        specifications: {
          material:
            data.specifications?.material || "",

          jewelleryType:
            data.specifications
              ?.jewelleryType || "",

          metalPlating:
            data.specifications
              ?.metalPlating || "",

          stone:
            data.specifications?.stone || "",

          weight:
            data.specifications?.weight || "",

          occasion:
            data.specifications?.occasion || "",

          countryOfOrigin:
            data.specifications
              ?.countryOfOrigin ||
            "India",
        },
      });

      // ==========================================
      // Default first media = first image
      // ==========================================

      if (productImages.length > 0) {
        setSelectedImage(
          productImages[0]
        );

        setSelectedMedia("image");

        setGalleryIndex(0);
      } else if (data.video) {
        setSelectedImage("");

        setSelectedMedia("video");
      }
    } catch (error) {
      console.error(
        "Fetch Product Error:",
        error
      );

      alert(
        "❌ Failed to load product"
      );
    }
  };

  // ==========================================
  // Related Products
  // ==========================================

  const fetchRelatedProducts =
    async () => {
      try {
        const response =
          await api.get(
            `/products/related/${id}`
          );

        const products =
          response.data.products.map(
            (item: any) => ({
              id: item._id,

              name: item.name,

              price:
                item.discountPrice > 0
                  ? item.discountPrice
                  : item.price,

              originalPrice:
                item.price,

              image:
                item.images?.[0] ||
                "/hero-jewelry.png",

              hoverImage:
                item.images?.[1],

              category:
                item.category,

              badge:
                item.featured
                  ? "Featured"
                  : "",
            })
          );

        setRelatedProducts(
          products
        );
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
      const response =
        await api.get(
          `/reviews/product/${id}`
        );

      setReviews(
        response.data.reviews || []
      );

      setAverageRating(
        Number(
          response.data
            .averageRating || 0
        )
      );

      setTotalReviews(
        Number(
          response.data.totalReviews || 0
        )
      );
    } catch (error) {
      console.error(
        "Review Error:",
        error
      );
    }
  };

  // ==========================================
  // Check Review Eligibility
  // ==========================================

  const findReviewOrder =
    async () => {
      if (!id) return;

      try {
        setReviewChecking(true);

        const response =
          await api.get(
            "/orders/my-orders"
          );

        const orders =
          response.data?.orders || [];

        const deliveredOrder =
          orders.find(
            (order: any) =>
              order.orderStatus ===
                "Delivered" &&
              order.products?.some(
                (item: any) =>
                  String(
                    item.productId
                  ) === String(id)
              )
          );

        if (deliveredOrder) {
          setReviewOrderId(
            String(
              deliveredOrder._id
            )
          );

          setCanReview(true);
        } else {
          setReviewOrderId(null);
          setCanReview(false);
        }
      } catch (error: any) {
        if (
          error?.response?.status !==
          401
        ) {
          console.error(
            "❌ Review Eligibility Error:",
            error?.response?.data ||
              error
          );
        }

        setReviewOrderId(null);
        setCanReview(false);
      } finally {
        setReviewChecking(false);
      }
    };

  // ==========================================
  // Submit Review
  // ==========================================

  const submitReview = async () => {
    if (
      !reviewOrderId ||
      !canReview
    ) {
      alert(
        "You can review this product only after purchasing and receiving it."
      );

      return;
    }

    if (
      !reviewForm.comment.trim()
    ) {
      alert(
        "Please write a review."
      );

      return;
    }

    try {
      const response =
        await api.post(
          "/reviews",
          {
            orderId:
              reviewOrderId,

            productId:
              product._id,

            rating:
              reviewForm.rating,

            comment:
              reviewForm.comment.trim(),
          }
        );

      alert(
        response.data?.message ||
          "Review submitted successfully. It will appear after admin approval."
      );

      setReviewForm({
        rating: 5,
        comment: "",
      });

      setCanReview(false);

      setReviewOrderId(null);

      await fetchReviews();
    } catch (error: any) {
      console.error(
        "❌ REVIEW ERROR:",
        error
      );

      console.error(
        "❌ STATUS:",
        error?.response?.status
      );

      console.error(
        "❌ SERVER RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        "Failed to submit review.";

      if (
        error?.response?.status ===
          400 &&
        message
          .toLowerCase()
          .includes(
            "already reviewed"
          )
      ) {
        setCanReview(false);
        setReviewOrderId(null);
      }

      alert(message);
    }
  };

  // ==========================================
  // Gallery Helpers
  // ==========================================

  const galleryImages =
    product?.images || [];

  const selectImage = (index: number) => {
  if (!galleryImages[index]) return;

  // Stop and reset video when switching back to an image
  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }

  setSelectedImage(galleryImages[index]);
  setSelectedMedia("image");
  setGalleryIndex(index);

  // Reset video state
  setVideoProgress(0);
  setVideoCurrentTime(0);
  setIsVideoPlaying(false);
};

  const selectVideo = () => {
  if (!product?.video) return;

  // Switch to video
  setSelectedMedia("video");

  // Reset video UI state
  setVideoProgress(0);
  setVideoCurrentTime(0);
  setIsVideoPlaying(true);
  setIsVideoMuted(true);

  // Wait until video element is rendered
  setTimeout(() => {
    const video = videoRef.current;

    if (!video) return;

    // Start from beginning
    video.currentTime = 0;

    // Always start muted
    video.muted = true;

    // Play automatically
    video
      .play()
      .then(() => {
        setIsVideoPlaying(true);
      })
      .catch((error) => {
        console.error(
          "Video autoplay failed:",
          error
        );

        setIsVideoPlaying(false);
      });
  }, 100);
};

  const openGallery = (
    index: number
  ) => {
    if (!galleryImages.length)
      return;

    setGalleryIndex(index);

    setSelectedImage(
      galleryImages[index] ||
        galleryImages[0] ||
        ""
    );

    setSelectedMedia("image");

    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const showPreviousImage = () => {
    const handleTouchStart = (
  e: React.TouchEvent
) => {
  setTouchStartX(e.touches[0].clientX);
  setTouchEndX(null);
};

const handleTouchMove = (
  e: React.TouchEvent
) => {
  setTouchEndX(e.touches[0].clientX);
};

const handleTouchEnd = () => {
  if (
    touchStartX === null ||
    touchEndX === null
  ) {
    return;
  }

  const distance =
    touchStartX - touchEndX;

  const minSwipeDistance = 50;

  if (
    Math.abs(distance) <
    minSwipeDistance
  ) {
    setTouchStartX(null);
    setTouchEndX(null);
    return;
  }

  // ==============================
  // SWIPE LEFT → NEXT MEDIA
  // ==============================

  if (distance > 0) {
    if (
      selectedMedia === "image" &&
      galleryImages.length > 0
    ) {
      if (
        galleryIndex <
        galleryImages.length - 1
      ) {
        showNextImage();
      } else if (product?.video) {
        selectVideo();
      }
    }
  }

  // ==============================
  // SWIPE RIGHT → PREVIOUS MEDIA
  // ==============================

  if (distance < 0) {
    if (selectedMedia === "video") {
      // Go back to the last image
      if (galleryImages.length > 0) {
        const lastIndex =
          galleryImages.length - 1;

        selectImage(lastIndex);
      }
    } else if (
      selectedMedia === "image" &&
      galleryImages.length > 0
    ) {
      if (galleryIndex > 0) {
        showPreviousImage();
      }
    }
  }

  setTouchStartX(null);
  setTouchEndX(null);
};
    if (!galleryImages.length)
      return;

    const nextIndex =
      (galleryIndex -
        1 +
        galleryImages.length) %
      galleryImages.length;

    setGalleryIndex(nextIndex);

    setSelectedImage(
      galleryImages[nextIndex]
    );

    setSelectedMedia("image");

    setVideoProgress(0);

    setVideoCurrentTime(0);
  };

  const showNextImage = () => {
    if (!galleryImages.length)
      return;

    const nextIndex =
      (galleryIndex + 1) %
      galleryImages.length;

    setGalleryIndex(nextIndex);

    setSelectedImage(
      galleryImages[nextIndex]
    );

    setSelectedMedia("image");

    setVideoProgress(0);

    setVideoCurrentTime(0);
  };

  // ==========================================
  // VIDEO CONTROLS
  // ==========================================

  const toggleVideoPlay =
    () => {
      if (!videoRef.current)
        return;

      if (
        videoRef.current.paused
      ) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(
              true
            );
          })
          .catch((error) => {
            console.error(
              "Video Play Error:",
              error
            );
          });
      } else {
        videoRef.current.pause();

        setIsVideoPlaying(
          false
        );
      }
    };

  const toggleVideoMute =
    () => {
      if (!videoRef.current)
        return;

      videoRef.current.muted =
        !videoRef.current.muted;

      setIsVideoMuted(
        videoRef.current.muted
      );
    };

  const handleVideoTimeUpdate =
    () => {
      if (!videoRef.current)
        return;

      const current =
        videoRef.current
          .currentTime;

      const duration =
        videoRef.current
          .duration || 0;

      setVideoCurrentTime(
        current
      );

      if (duration > 0) {
        setVideoProgress(
          (current / duration) *
            100
        );
      }
    };

  const handleVideoLoadedMetadata =
    () => {
      if (!videoRef.current)
        return;

      setVideoDuration(
        videoRef.current
          .duration || 0
      );
    };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);

    setVideoProgress(100);
  };

  const handleVideoProgressClick =
    (
      e: React.MouseEvent<HTMLDivElement>
    ) => {
      if (!videoRef.current)
        return;

      const rect =
        e.currentTarget.getBoundingClientRect();

      const clickPosition =
        e.clientX - rect.left;

      const percentage =
        Math.max(
          0,
          Math.min(
            1,
            clickPosition /
              rect.width
          )
        );

      const duration =
        videoRef.current
          .duration || 0;

      videoRef.current.currentTime =
        percentage * duration;

      setVideoCurrentTime(
        percentage * duration
      );

      setVideoProgress(
        percentage * 100
      );
    };

  const formatVideoTime = (
    seconds: number
  ) => {
    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {
      return "00:00";
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const replayVideo = () => {
    if (!videoRef.current)
      return;

    videoRef.current.currentTime = 0;

    setVideoCurrentTime(0);

    setVideoProgress(0);

    videoRef.current
      .play()
      .then(() => {
        setIsVideoPlaying(
          true
        );
      })
      .catch((error) => {
        console.error(
          "Replay Error:",
          error
        );
      });
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

  const favorite =
    isInWishlist(
      product._id
    );

  const hasDiscount =
    Number(
      product.discountPrice
    ) > 0 &&
    Number(
      product.discountPrice
    ) <
      Number(
        product.price
      );

  const sellingPrice =
    hasDiscount
      ? Number(
          product.discountPrice
        )
      : Number(product.price);

  const discount =
    hasDiscount
      ? Math.round(
          (
            (Number(
              product.price
            ) -
              Number(
                product.discountPrice
              )) /
            Number(
              product.price
            )
          ) * 100
        )
      : 0;

  // ==========================================
  // Cart
  // ==========================================

  const handleAddToCart =
    () => {
      if (
        product.stock <= 0
      )
        return;

      if (
        product.colors?.length >
          0 &&
        !selectedColor
      ) {
        alert(
          "Please select a color."
        );

        return;
      }

      if (
        product.sizes?.length >
          0 &&
        !selectedSize
      ) {
        alert(
          "Please select a size."
        );

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

  const handleWishlist =
    () => {
      if (favorite) {
        removeFromWishlist(
          product._id
        );
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

  const handleBuyNow =
    () => {
      if (
        product.stock <= 0
      )
        return;

      if (
        product.colors?.length >
          0 &&
        !selectedColor
      ) {
        alert(
          "Please select a color."
        );

        return;
      }

      if (
        product.sizes?.length >
          0 &&
        !selectedSize
      ) {
        alert(
          "Please select a size."
        );

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

      router.push(
        "/checkout"
      );
    };

    // ==========================================
// NOTIFY ME WHEN BACK IN STOCK
// ==========================================

const handleNotifyMe = async () => {
  if (!product?._id) {
    return;
  }

  if (!notifyEmail.trim()) {
    alert("Please enter your email address.");
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(notifyEmail.trim())) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    setNotifyLoading(true);
    setNotifySuccess("");

    const response = await api.post(
  "/stock-notifications",
  {
    productId: product._id,
    email: notifyEmail.trim(),
  }
);

    if (response.data?.success) {
      setNotifySuccess(
        response.data?.message ||
          "You will be notified when this product is back in stock."
      );

      setNotifyEmail("");

      setTimeout(() => {
        setShowNotifyModal(false);
        setNotifySuccess("");
      }, 2000);
    } else {
      throw new Error(
        response.data?.message ||
          "Unable to save your notification request."
      );
    }
  } catch (error: any) {
    console.error(
      "Notify Me Error:",
      error
    );

    alert(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to save your notification request."
    );
  } finally {
    setNotifyLoading(false);
  }
};
  // ==========================================
// Delivery
// ==========================================

const checkDelivery = async () => {
  const trimmedPincode = pincode.trim();

  // Basic validation
  if (!/^\d{6}$/.test(trimmedPincode)) {
    setDeliveryMessage(
      "Please enter a valid 6-digit pincode."
    );
    return;
  }

  try {
    setDeliveryMessage("Checking delivery availability...");

    const response = await api.get(
      `/shipping/check/${trimmedPincode}`
    );

    if (response.data?.success) {
      const deliveryDays =
        response.data?.deliveryDays;

      if (deliveryDays) {
        setDeliveryMessage(
          `✓ Delivery available to your location. Estimated delivery: ${deliveryDays} business days.`
        );
      } else {
        setDeliveryMessage(
          "✓ Delivery available to your location."
        );
      }
    } else {
      setDeliveryMessage(
        response.data?.message ||
          "Sorry, delivery is not available to this pincode."
      );
    }
  } catch (error: any) {
    console.error(
      "Check Delivery Error:",
      error
    );

    setDeliveryMessage(
      error?.response?.data?.message ||
        "Sorry, delivery is not available to this pincode."
    );
  }
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
            MAIN PRODUCT
        ====================================== */}

        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-12">

            {/* ==================================
                LEFT - PRODUCT GALLERY
            ================================== */}

            <div className="lg:sticky lg:top-24">

              <div className="grid gap-4 sm:grid-cols-[78px_minmax(0,1fr)]">

                {/* ==================================
                    THUMBNAIL RAIL
                ================================== */}

                <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">

                  {/* PRODUCT IMAGE */}

                  {product.images?.[0] && (
                    <button
                      type="button"
                      onClick={() =>
                        selectImage(0)
                      }
                      aria-label="View main product image"
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                        selectedMedia ===
                          "image" &&
                        selectedImage ===
                          product.images[0]
                          ? "border-[#C78B7B] ring-2 ring-[#C78B7B]/20"
                          : "border-[#E7DED8] hover:border-[#C78B7B]"
                      }`}
                    >

                      <Image
                        src={
                          product.images[0]
                        }
                        alt={`${product.name} product image`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />

                      <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-1 text-center text-[8px] font-semibold uppercase tracking-wider text-white">
                        Product
                      </span>

                    </button>
                  )}

                  {/* WEAR / LIFESTYLE IMAGE */}

                  {product.images?.[1] && (
                    <button
                      type="button"
                      onClick={() =>
                        selectImage(1)
                      }
                      aria-label="View product worn image"
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                        selectedMedia ===
                          "image" &&
                        selectedImage ===
                          product.images[1]
                          ? "border-[#C78B7B] ring-2 ring-[#C78B7B]/20"
                          : "border-[#E7DED8] hover:border-[#C78B7B]"
                      }`}
                    >

                      <Image
                        src={
                          product.images[1]
                        }
                        alt={`${product.name} worn image`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />

                      <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-1 text-center text-[8px] font-semibold uppercase tracking-wider text-white">
                        Wear
                      </span>

                    </button>
                  )}

                  {/* ADDITIONAL IMAGES */}

                  {product.images
                    ?.slice(2)
                    .map(
                      (
                        image: string,
                        index: number
                      ) => {
                        const actualIndex =
                          index + 2;

                        return (
                          <button
                            key={`${image}-${actualIndex}`}
                            type="button"
                            onClick={() =>
                              selectImage(
                                actualIndex
                              )
                            }
                            aria-label={`View product image ${
                              actualIndex +
                              1
                            }`}
                            className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                              selectedMedia ===
                                "image" &&
                              selectedImage ===
                                image
                                ? "border-[#C78B7B] ring-2 ring-[#C78B7B]/20"
                                : "border-[#E7DED8] hover:border-[#C78B7B]"
                            }`}
                          >

                            <Image
                              src={image}
                              alt={`${product.name} image ${
                                actualIndex +
                                1
                              }`}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />

                            <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-1 py-1 text-center text-[8px] font-semibold uppercase tracking-wider text-white">
                              View
                            </span>

                          </button>
                        );
                      }
                    )}

                  {/* PRODUCT VIDEO */}

                  {product.video && (
                    <button
                      type="button"
                      onClick={
                        selectVideo
                      }
                      aria-label="Play product video"
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#3A2528] transition-all duration-300 ${
                        selectedMedia ===
                          "video"
                          ? "border-[#C78B7B] ring-2 ring-[#C78B7B]/20"
                          : "border-[#E7DED8] hover:border-[#C78B7B]"
                      }`}
                    >

                      <div className="absolute inset-0 flex items-center justify-center">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">

                          <Play
                            size={17}
                            className="ml-0.5 fill-[#3A2528] text-[#3A2528]"
                          />

                        </div>

                      </div>

                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider text-white">
                        Video
                      </span>

                    </button>
                  )}

                </div>

                {/* ==================================
                    MAIN MEDIA
                ================================== */}

                <div className="order-1 sm:order-2">

                  <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F5F0EC]">

                    {/* ==================================
                        PREMIUM VIDEO PLAYER
                    ================================== */}

                    {selectedMedia ===
                      "video" &&
                    product.video ? (

                      <div className="absolute inset-0 bg-black">
 <video
  ref={videoRef}
  key={product.video}
  src={product.video}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  onPlay={() => setIsVideoPlaying(true)}
  onPause={() => setIsVideoPlaying(false)}
  onTimeUpdate={handleVideoTimeUpdate}
  onLoadedMetadata={handleVideoLoadedMetadata}
  onEnded={handleVideoEnded}
  className="absolute inset-0 h-full w-full object-cover bg-black"
/>

  {/* Product Video Label */}
  <div className="absolute left-5 top-5 z-10 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
    Product Video
  </div>
</div>


                    ) : (

                      /* ==================================
                         IMAGE
                      ================================== */

                      <button
                        type="button"
                        onClick={() =>
                          openGallery(
                            Math.max(
                              galleryIndex,
                              0
                            )
                          )
                        }
                        className="absolute inset-0 h-full w-full cursor-zoom-in"
                        aria-label="Open product image viewer"
                      >

                        <Image
                          src={
                            selectedImage ||
                            galleryImages[0] ||
                            "/placeholder-product.jpg"
                          }
                          alt={
                            product.name
                          }
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 55vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                      </button>

                    )}

                    {/* IMAGE ZOOM HINT */}

                    {selectedMedia ===
                      "image" &&
                      galleryImages.length >
                        0 && (

                        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          Click to enlarge
                        </div>
                      )}

                    {/* IMAGE COUNTER */}

                    {selectedMedia ===
                      "image" &&
                      galleryImages.length >
                        1 && (

                        <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#3A2528] shadow-sm backdrop-blur-sm">
                          {galleryIndex +
                            1}{" "}
                          /{" "}
                          {
                            galleryImages.length
                          }
                        </div>
                      )}

                    {/* FEATURED BADGE */}

                    {product.featured &&
                      selectedMedia !==
                        "video" && (

                        <span className="absolute left-5 top-5 rounded-full bg-[#C78B7B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                          Featured
                        </span>
                      )}

                    {/* DISCOUNT BADGE */}

                    {hasDiscount &&
                      selectedMedia !==
                        "video" && (

                        <span className="absolute right-5 top-5 rounded-full bg-[#3A2528] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                          {discount}% OFF
                        </span>
                      )}

                    {/* IMAGE NAVIGATION */}

                    {selectedMedia ===
                      "image" &&
                      galleryImages.length >
                        1 && (
                        <>

                          <button
                            type="button"
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              showPreviousImage();
                            }}
                            aria-label="Previous product image"
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#3A2528] opacity-0 shadow-md transition-all duration-300 hover:scale-105 group-hover:opacity-100"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              showNextImage();
                            }}
                            aria-label="Next product image"
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#3A2528] opacity-0 shadow-md transition-all duration-300 hover:scale-105 group-hover:opacity-100"
                          >
                            ›
                          </button>

                        </>
                      )}

                  </div>

                </div>

              </div>

              {/* ==================================
                  MOBILE MEDIA DOTS
              ================================== */}

              {galleryImages.length >
                1 && (

                <div className="mt-4 flex justify-center gap-1.5 sm:hidden">

                  {galleryImages.map(
                    (
                      image: string,
                      index: number
                    ) => (

                      <button
                        key={`dot-${index}`}
                        type="button"
                        onClick={() =>
                          selectImage(
                            index
                          )
                        }
                        aria-label={`Go to image ${
                          index + 1
                        }`}
                        className={`h-1.5 rounded-full transition-all ${
                          selectedMedia ===
                            "image" &&
                          galleryIndex ===
                            index
                            ? "w-6 bg-[#3A2528]"
                            : "w-1.5 bg-[#D8CEC8]"
                        }`}
                      />

                    )
                  )}

                </div>
              )}

            </div>

            {/* ==================================
                RIGHT - PRODUCT INFO
            ================================== */}

            <div className="lg:pt-1">

              {/* Category */}

              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A77868]">
                {product.category}
              </p>

              {/* Product Name */}

              <h1 className="mt-2 font-serif text-3xl leading-tight text-[#2E2E2E] sm:text-4xl lg:text-[42px]">
                {product.name}
              </h1>

              {/* Collection */}

              {product.collection && (
                <p className="mt-2 text-sm text-[#8A6A62]">
                  {product.collection}
                </p>
              )}

              {/* Rating */}

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-0.5">

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
                            averageRating ||
                              0
                          )
                            ? "fill-[#D6B36A] text-[#D6B36A]"
                            : "text-[#D6B36A]/30"
                        }
                      />

                    )
                  )}

                </div>

                <span className="text-sm font-medium text-[#444]">
                  {averageRating >
                  0
                    ? averageRating.toFixed(
                        1
                      )
                    : "No rating"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "reviews"
                    )
                  }
                  className="text-sm text-gray-500 underline-offset-4 hover:underline"
                >
                  {totalReviews}{" "}
                  Reviews
                </button>

              </div>

              <div className="my-6 h-px bg-[#E8E0DB]" />

              {/* PRICE */}

              <div className="mt-6">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="font-serif text-4xl font-semibold text-[#2E2E2E]">
                    ₹
                    {sellingPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span className="rounded-full bg-[#F4E4E0] px-3 py-1.5 text-xs font-semibold text-[#A65E55]">
                        Save{" "}
                        {discount}%
                      </span>
                    </>
                  )}

                </div>

                <p className="mt-2 text-xs text-[#8B817D]">
                  Inclusive of applicable taxes
                </p>

              </div>

              {/* Free Delivery */}

              {sellingPrice >=
                499 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#596B55]">

                  <Truck size={16} />

                  <span>
                    Free delivery available
                  </span>

                </div>
              )}

              {/* STOCK */}

              <div className="mt-5">

                {product.stock >
                0 ? (

                  <div className="flex items-center gap-3">

                    <span className="flex items-center gap-2 text-sm font-medium text-[#55734E]">

                      <span className="h-2.5 w-2.5 rounded-full bg-[#6C9A72]" />

                      In Stock

                    </span>

                    {product.stock <=
                      5 && (

                      <span className="text-xs font-medium text-[#A65E55]">
                        Only{" "}
                        {
                          product.stock
                        }{" "}
                        left
                      </span>
                    )}

                  </div>

                ) : (

                  <span className="font-medium text-red-600">
                    Currently unavailable
                  </span>
                )}

              </div>

              {/* COLOR */}

              {product.colors?.length >
                0 && (

                <div className="mt-7">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                      Color
                    </p>

                    {selectedColor && (
                      <span className="text-xs text-[#777]">
                        {
                          selectedColor
                        }
                      </span>
                    )}

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.colors.map(
                      (
                        color: string
                      ) => (

                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setSelectedColor(
                              color
                            )
                          }
                          className={`rounded-full border px-5 py-2.5 text-sm transition ${
                            selectedColor ===
                            color
                              ? "border-[#3A2528] bg-[#3A2528] text-white shadow-sm"
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

              {/* SIZE */}

              {product.sizes?.length >
                0 && (

                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                      Size
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          "specifications"
                        )
                      }
                      className="text-xs font-medium text-[#A77868] underline underline-offset-4"
                    >
                      View Size Information
                    </button>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.sizes.map(
                      (
                        size: string
                      ) => (

                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                          className={`min-w-[58px] rounded-lg border px-4 py-2.5 text-sm transition ${
                            selectedSize ===
                            size
                              ? "border-[#3A2528] bg-[#3A2528] text-white shadow-sm"
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

              {/* QUANTITY */}

              <div className="mt-7">

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
                  Quantity
                </p>

                <div className="flex h-12 w-fit items-center rounded-full border border-[#DED5D0] bg-white">

                  <button
                    type="button"
                    onClick={() =>
                      quantity > 1 &&
                      setQuantity(
                        quantity - 1
                      )
                    }
                    className="flex h-full w-12 items-center justify-center rounded-l-full transition hover:bg-[#F7F2EF]"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-12 text-center text-sm font-semibold">
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
                    className="flex h-full w-12 items-center justify-center rounded-r-full transition hover:bg-[#F7F2EF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>

                </div>

              </div>

            {/* ==========================================
    ACTIONS
========================================== */}

<div className="mt-7">

  {product.stock > 0 ? (

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

      {/* ADD TO CART */}

      <button
        type="button"
        onClick={handleAddToCart}
        className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#3A2528] px-4 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#29181B] hover:shadow-xl"
      >
        <ShoppingCart size={18} />

        Add to Cart
      </button>

      {/* BUY NOW */}

      <button
        type="button"
        onClick={handleBuyNow}
        className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#3A2528] px-4 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:bg-[#29181B]"
      >
        <Zap size={18} />

        Buy Now
      </button>

    </div>

  ) : (

    /* ======================================
       OUT OF STOCK
    ====================================== */

    <div className="space-y-3">

      <button
        type="button"
        onClick={() => {
          setNotifySuccess("");
          setShowNotifyModal(true);
        }}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] px-4 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#29181B] hover:shadow-xl"
      >
        <Bell size={18} />

        Notify Me When Available
      </button>

      <p className="text-center text-xs text-[#817671]">
        We'll notify you when this product is back in stock.
      </p>

    </div>

  )}

  {/* SECURITY MESSAGE */}

  <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#817671]">

    <ShieldCheck
      size={14}
      className="text-[#C78B7B]"
    />

    Secure checkout · Carefully packed · Easy returns

  </div>

</div>

              {/* WISHLIST */}

              <button
                type="button"
                onClick={
                  handleWishlist
                }
                className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ${
                  favorite
                    ? "border-[#C78B7B] bg-[#FCF1EE] text-[#C78B7B]"
                    : "border-[#DCD3CE] bg-white text-[#444] hover:border-[#C78B7B] hover:text-[#C78B7B]"
                }`}
              >

                <Heart
                  size={18}
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

              {/* DELIVERY */}
              {product.stock > 0 && (
              <div className="mt-6 rounded-2xl border border-[#E8E0DB] bg-white p-5">

                <div className="mb-4 flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8EEE9]">

                    <MapPin
                      size={18}
                      className="text-[#C78B7B]"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#333]">
                      Check Delivery
                    </p>

                    <p className="mt-1 text-xs text-[#817671]">
                      Enter your pincode to check delivery availability.
                    </p>

                  </div>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            6
                          )
                      )
                    }
                    placeholder="Enter 6-digit pincode"
                    className="h-12 min-w-0 flex-1 rounded-xl border border-[#DED5D0] bg-[#FCFAF8] px-4 text-sm outline-none transition focus:border-[#C78B7B]"
                  />

                  <button
                    type="button"
                    onClick={
                      checkDelivery
                    }
                    className="h-12 rounded-xl bg-[#F4EEEB] px-6 text-sm font-semibold text-[#3A2528] transition hover:bg-[#EDE2DD]"
                  >
                    Check
                  </button>

                </div>

                {deliveryMessage && (
  <div
    className={`mt-4 rounded-xl p-4 ${
      deliveryMessage.startsWith("✓")
        ? "bg-[#F3F8F1]"
        : deliveryMessage.includes("Checking")
        ? "bg-[#F8F3EF]"
        : "bg-[#FFF1F1]"
    }`}
  >
    <p
      className={`text-sm font-medium ${
        deliveryMessage.startsWith("✓")
          ? "text-[#55734E]"
          : deliveryMessage.includes("Checking")
          ? "text-[#8A6A62]"
          : "text-red-600"
      }`}
    >
      {deliveryMessage}
    </p>
  </div>
)}
</div>
)}

              {/* TRUST / SERVICE FEATURES */}

              <div className="mt-5 grid grid-cols-3 gap-2">

                <div className="rounded-xl border border-[#E8E0DB] bg-white p-3 text-center">

                  <Truck
                    size={18}
                    className="mx-auto text-[#C78B7B]"
                  />

                  <p className="mt-2 text-[10px] font-medium text-[#555]">
                    Free Shipping
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E0DB] bg-white p-3 text-center">

                  <ShieldCheck
                    size={18}
                    className="mx-auto text-[#C78B7B]"
                  />

                  <p className="mt-2 text-[10px] font-medium text-[#555]">
                    Secure Payment
                  </p>

                </div>

                <div className="rounded-xl border border-[#E8E0DB] bg-white p-3 text-center">

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
                  setActiveTab(
                    "description"
                  )
                }
                className={`whitespace-nowrap border-b-2 px-5 pb-4 text-sm font-medium transition ${
                  activeTab ===
                  "description"
                    ? "border-[#C78B7B] text-[#3A2528]"
                    : "border-transparent text-gray-500 hover:text-[#3A2528]"
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "specifications"
                  )
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
                  setActiveTab(
                    "reviews"
                  )
                }
                className={`whitespace-nowrap border-b-2 px-5 pb-4 text-sm font-medium transition ${
                  activeTab ===
                  "reviews"
                    ? "border-[#C78B7B] text-[#3A2528]"
                    : "border-transparent text-gray-500 hover:text-[#3A2528]"
                }`}
              >
                Reviews ({totalReviews})
              </button>

            </div>

            {/* DESCRIPTION */}

            {activeTab ===
              "description" && (

              <div className="max-w-4xl py-8">

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                  About this piece
                </p>

                <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E]">
                  Product Description
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#666]">
                  {product.description ||
                    "A beautiful jewellery piece designed to complement your everyday style and special occasions."}
                </p>

              </div>
            )}

            {/* SPECIFICATIONS */}

            {activeTab ===
              "specifications" && (

              <div className="max-w-4xl py-8">

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                  Product information
                </p>

                <h2 className="mt-2 font-serif text-2xl text-[#2E2E2E]">
                  Jewellery Specifications
                </h2>

                <div className="mt-6 overflow-hidden rounded-2xl border border-[#E8E0DB]">

                  {[
                    [
                      "Material",
                      product
                        .specifications
                        ?.material,
                    ],

                    [
                      "Jewellery Type",
                      product
                        .specifications
                        ?.jewelleryType,
                    ],

                    [
                      "Metal / Plating",
                      product
                        .specifications
                        ?.metalPlating,
                    ],

                    [
                      "Stone",
                      product
                        .specifications
                        ?.stone,
                    ],

                    [
                      "Weight",
                      product
                        .specifications
                        ?.weight,
                    ],

                    [
                      "Occasion",
                      product
                        .specifications
                        ?.occasion,
                    ],

                    [
                      "Country of Origin",
                      product
                        .specifications
                        ?.countryOfOrigin,
                    ],

                    [
                      "Category",
                      product.category,
                    ],

                    [
                      "Collection",
                      product.collection,
                    ],

                    [
                      "Colour",
                      product.colors
                        ?.length
                        ? product.colors.join(
                            ", "
                          )
                        : "",
                    ],

                    [
                      "Available Sizes",
                      product.sizes
                        ?.length
                        ? product.sizes.join(
                            ", "
                          )
                        : "",
                    ],

                    [
                      "Availability",
                      product.stock >
                      0
                        ? `${product.stock} available`
                        : "Out of stock",
                    ],
                  ].map(
                    (
                      [label, value],
                      index
                    ) =>
                      value ? (
                        <div
                          key={String(
                            label
                          )}
                          className={`grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-6 ${
                            index % 2 ===
                            0
                              ? "bg-[#FCFAF8]"
                              : "bg-white"
                          } ${
                            index !== 0
                              ? "border-t border-[#E8E0DB]"
                              : ""
                          }`}
                        >

                          <span className="text-sm font-medium text-[#4A403C]">
                            {label}
                          </span>

                          <span className="text-sm leading-6 text-[#6D625E]">
                            {value}
                          </span>

                        </div>
                      ) : null
                  )}

                </div>

              </div>
            )}

            {/* REVIEWS */}

            {activeTab ===
              "reviews" && (

              <div className="py-8">

                {/* Header */}

                <div className="mb-8">

                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                    Customer Experience
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#2E2E2E]">
                    What Our Customers Say
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77706C]">
                    Honest feedback from customers who have experienced this piece.
                  </p>

                </div>

                {/* Rating Summary */}

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                  {/* Overall */}

                  <div className="rounded-2xl border border-[#E8E0DB] bg-[#FCFAF8] p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C78B7B]">
                      Overall Rating
                    </p>

                    <div className="mt-5 flex items-end gap-3">

                      <span className="font-serif text-5xl leading-none text-[#2E2E2E]">
                        {averageRating >
                        0
                          ? averageRating.toFixed(
                              1
                            )
                          : "0.0"}
                      </span>

                      <span className="pb-1 text-sm text-[#817772]">
                        / 5
                      </span>

                    </div>

                    <div className="mt-4 flex items-center gap-1">

                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (

                          <Star
                            key={
                              index
                            }
                            size={18}
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

                    <p className="mt-3 text-sm text-[#77706C]">
                      Based on{" "}
                      <span className="font-semibold text-[#3A302D]">
                        {
                          totalReviews
                        }
                      </span>{" "}
                      {totalReviews ===
                      1
                        ? "review"
                        : "reviews"}
                    </p>

                  </div>

                  {/* Rating Distribution */}

                  <div className="rounded-2xl border border-[#E8E0DB] bg-white p-7">

                    <h3 className="text-sm font-semibold text-[#3A302D]">
                      Customer Ratings
                    </h3>

                    <div className="mt-5 space-y-3">

                      {[5, 4, 3, 2, 1].map(
                        (rating) => {

                          const count =
                            reviews.filter(
                              (
                                review
                              ) =>
                                Number(
                                  review.rating
                                ) ===
                                rating
                            ).length;

                          const percentage =
                            totalReviews >
                            0
                              ? Math.round(
                                  (count /
                                    totalReviews) *
                                    100
                                )
                              : 0;

                          return (
                            <div
                              key={
                                rating
                              }
                              className="flex items-center gap-3"
                            >

                              <span className="w-8 text-xs font-medium text-[#625A56]">
                                {
                                  rating
                                }{" "}
                                ★
                              </span>

                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEE8E4]">

                                <div
                                  className="h-full rounded-full bg-[#C78B7B] transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />

                              </div>

                              <span className="w-10 text-right text-xs text-[#817772]">
                                {
                                  count
                                }
                              </span>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                </div>

                {/* Reviews List */}

                <div className="mt-10">

                  <div className="mb-5 flex items-center justify-between">

                    <h3 className="font-serif text-2xl text-[#2E2E2E]">
                      Customer Reviews
                    </h3>

                    <span className="text-xs text-[#817772]">
                      {
                        totalReviews
                      }{" "}
                      total
                    </span>

                  </div>

                  {reviews.length ===
                  0 ? (

                    <div className="rounded-2xl border border-dashed border-[#DCD2CC] bg-[#FCFAF8] px-6 py-12 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">

                        <Star
                          size={22}
                          className="text-[#C78B7B]"
                        />

                      </div>

                      <h4 className="mt-5 font-serif text-xl text-[#2E2E2E]">
                        Be the first to share your experience
                      </h4>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817772]">
                        Your feedback helps other customers discover beautiful pieces with confidence.
                      </p>

                    </div>

                  ) : (

                    <div className="space-y-4">

                      {reviews.map(
                        (
                          review
                        ) => (

                          <div
                            key={
                              review._id
                            }
                            className="rounded-2xl border border-[#E8E0DB] bg-white p-6 transition hover:shadow-sm"
                          >

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                              <div>

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7EDE9] text-sm font-semibold text-[#A77868]">

                                    {String(
                                      review.customerName ||
                                        "C"
                                    )
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}

                                  </div>

                                  <div>

                                    <h4 className="text-sm font-semibold text-[#302A27]">
                                      {review.customerName ||
                                        "Customer"}
                                    </h4>

                                    <p className="text-xs text-[#918782]">
                                      Customer Review
                                    </p>

                                  </div>

                                </div>

                              </div>

                              <div className="flex items-center gap-1">

                                {Array.from({
                                  length: 5,
                                }).map(
                                  (
                                    _,
                                    index
                                  ) => (

                                    <Star
                                      key={
                                        index
                                      }
                                      size={
                                        15
                                      }
                                      className={
                                        index <
                                        Number(
                                          review.rating
                                        )
                                          ? "fill-[#D6B36A] text-[#D6B36A]"
                                          : "text-[#DDD5D0]"
                                      }
                                    />

                                  )
                                )}

                              </div>

                            </div>

                            <p className="mt-5 text-sm leading-7 text-[#625A56]">
                              {
                                review.comment
                              }
                            </p>

                            <div className="mt-5 flex items-center gap-2 border-t border-[#F0EAE6] pt-4">

                              <CheckCircle2
                                size={
                                  14
                                }
                                className="text-[#6C9A72]"
                              />

                              <span className="text-xs font-medium text-[#6C9A72]">
                                Review approved
                              </span>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* Write Review */}

                <div className="mt-10 rounded-2xl border border-[#E8E0DB] bg-[#FCFAF8] p-6 sm:p-8">

                  <div className="max-w-2xl">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C78B7B]">
                      Share Your Experience
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#2E2E2E]">
                      Write a Review
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#817772]">
                      Reviews are available to customers who have purchased and received this jewellery piece.
                    </p>

                    {reviewChecking ? (

                      <div className="mt-6 rounded-2xl border border-[#E8E0DB] bg-white p-5">

                        <div className="flex items-center gap-3">

                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#C78B7B] border-t-transparent" />

                          <p className="text-sm text-[#817772]">
                            Checking your purchase history...
                          </p>

                        </div>

                      </div>

                    ) : canReview &&
                      reviewOrderId ? (

                      <>

                        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">

                          <CheckCircle2
                            size={
                              20
                            }
                            className="mt-0.5 shrink-0 text-green-600"
                          />

                          <div>

                            <p className="text-sm font-semibold text-green-800">
                              Verified Purchase
                            </p>

                            <p className="mt-1 text-xs leading-5 text-green-700">
                              You purchased and received this product. You can now share your experience.
                            </p>

                          </div>

                        </div>

                        <div className="mt-6 space-y-5">

                          <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#625A56]">
                              Your Rating
                            </label>

                            <div className="flex h-12 items-center gap-1 rounded-xl border border-[#DDD4CF] bg-white px-4">

                              {[1, 2, 3, 4, 5].map(
                                (
                                  rating
                                ) => (

                                  <button
                                    key={
                                      rating
                                    }
                                    type="button"
                                    onClick={() =>
                                      setReviewForm(
                                        {
                                          ...reviewForm,
                                          rating,
                                        }
                                      )
                                    }
                                    aria-label={`Rate ${rating} out of 5`}
                                    className="transition hover:scale-110"
                                  >

                                    <Star
                                      size={
                                        20
                                      }
                                      className={
                                        rating <=
                                        reviewForm.rating
                                          ? "fill-[#D6B36A] text-[#D6B36A]"
                                          : "text-[#D8D0CB]"
                                      }
                                    />

                                  </button>

                                )
                              )}

                              <span className="ml-2 text-xs text-[#817772]">
                                {
                                  reviewForm.rating
                                }
                                /5
                              </span>

                            </div>

                          </div>

                          <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#625A56]">
                              Your Review
                            </label>

                            <textarea
                              rows={5}
                              placeholder="Share your experience with this piece..."
                              value={
                                reviewForm.comment
                              }
                              onChange={(
                                e
                              ) =>
                                setReviewForm(
                                  {
                                    ...reviewForm,
                                    comment:
                                      e.target
                                        .value,
                                  }
                                )
                              }
                              className="w-full resize-none rounded-xl border border-[#DDD4CF] bg-white p-4 text-sm leading-6 text-[#333] outline-none transition placeholder:text-[#AAA09B] focus:border-[#C78B7B] focus:ring-2 focus:ring-[#C78B7B]/10"
                            />

                          </div>

                          <button
                            type="button"
                            onClick={
                              submitReview
                            }
                            disabled={
                              !reviewForm.comment.trim()
                            }
                            className="inline-flex h-12 items-center justify-center rounded-full bg-[#3A2528] px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#29181B] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Submit Review
                          </button>

                          <p className="text-xs leading-5 text-[#918782]">
                            Your review will be checked by our team before appearing publicly.
                          </p>

                        </div>

                      </>

                    ) : (

                      <div className="mt-6 rounded-2xl border border-[#E8E0DB] bg-white p-6">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8EEE9]">

                            <ShieldCheck
                              size={
                                19
                              }
                              className="text-[#C78B7B]"
                            />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-[#3A302D]">
                              Purchase required
                            </p>

                            <p className="mt-1 text-sm leading-6 text-[#817772]">
                              Reviews are available only to customers who have purchased and received this product.
                            </p>

                            <Link
                              href="/shop"
                              className="mt-4 inline-flex rounded-full bg-[#3A2528] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#29181B]"
                            >
                              Continue Shopping
                            </Link>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ======================================
            RELATED PRODUCTS
        ====================================== */}

        {relatedProducts.length >
          0 && (

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
                    key={
                      item.id
                    }
                    {...item}
                  />

                )
              )}

            </div>

          </section>
        )}

      </main>

      {/* ==========================================
          FULLSCREEN PRODUCT IMAGE VIEWER
      ========================================== */}

      {isGalleryOpen &&
        galleryImages.length >
          0 && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Product image viewer"
            onClick={
              closeGallery
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={
                closeGallery
              }
              aria-label="Close image viewer"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ×
            </button>

            {/* Counter */}

            <div className="absolute left-5 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
              {galleryIndex +
                1}{" "}
              /{" "}
              {
                galleryImages.length
              }
            </div>

            {/* Previous */}

            {galleryImages.length >
              1 && (

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  showPreviousImage();
                }}
                aria-label="Previous image"
                className="absolute left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur-md transition hover:bg-white/20 sm:left-8"
              >
                ‹
              </button>
            )}

            {/* Image */}

            <div
              className="relative h-[82vh] w-[92vw] max-w-6xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <Image
                src={
                  galleryImages[
                    galleryIndex
                  ] ||
                  "/placeholder-product.jpg"
                }
                alt={
                  product.name
                }
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />

            </div>

            {/* Next */}

            {galleryImages.length >
              1 && (

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  showNextImage();
                }}
                aria-label="Next image"
                className="absolute right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur-md transition hover:bg-white/20 sm:right-8"
              >
                ›
              </button>
            )}

            {/* Thumbnail Strip */}

            {galleryImages.length >
              1 && (

              <div
                className="absolute bottom-5 left-1/2 z-20 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl bg-black/35 p-2 backdrop-blur-md"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {galleryImages.map(
                  (
                    image: string,
                    index: number
                  ) => (

                    <button
                      key={`viewer-thumb-${index}`}
                      type="button"
                      onClick={() => {
                        setGalleryIndex(
                          index
                        );

                        setSelectedImage(
                          image
                        );

                        setSelectedMedia(
                          "image"
                        );
                      }}
                      aria-label={`View image ${
                        index + 1
                      }`}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        galleryIndex ===
                        index
                          ? "border-white"
                          : "border-white/30 hover:border-white/70"
                      }`}
                    >

                      <Image
                        src={
                          image ||
                          "/hero-jewelry.png"
                        }
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />

                    </button>

                  )
                )}

              </div>
            )}

          </div>
        )}
        {/* ==========================================
    NOTIFY ME MODAL
========================================== */}

{showNotifyModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      {/* CLOSE */}

      <button
        type="button"
        onClick={() => {
          if (!notifyLoading) {
            setShowNotifyModal(false);
            setNotifySuccess("");
          }
        }}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2EF] text-[#3A2528] transition hover:bg-[#EDE2DD]"
      >
        <X size={18} />
      </button>

      {/* ICON */}

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8EEE9]">

        <Bell
          size={25}
          className="text-[#C78B7B]"
        />

      </div>

      {/* TITLE */}

      <h2 className="mt-5 text-center font-serif text-2xl text-[#2E2E2E]">
        Notify Me When Available
      </h2>

      <p className="mt-2 text-center text-sm leading-6 text-[#777]">
        Enter your email address and we'll let you know when{" "}
        <span className="font-semibold text-[#3A2528]">
          {product.name}
        </span>{" "}
        is back in stock.
      </p>

      {/* SUCCESS */}

      {notifySuccess ? (

        <div className="mt-5 rounded-xl bg-[#F3F8F1] p-4 text-center">

          <CheckCircle2
            size={22}
            className="mx-auto text-[#55734E]"
          />

          <p className="mt-2 text-sm font-medium text-[#55734E]">
            {notifySuccess}
          </p>

        </div>

      ) : (

        <>
          {/* EMAIL */}

          <div className="mt-6">

            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">
              Email Address
            </label>

            <input
              type="email"
              value={notifyEmail}
              onChange={(e) =>
                setNotifyEmail(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNotifyMe();
                }
              }}
              placeholder="Enter your email"
              disabled={notifyLoading}
              className="h-12 w-full rounded-xl border border-[#DED5D0] bg-[#FCFAF8] px-4 text-sm outline-none transition focus:border-[#C78B7B] disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="button"
            onClick={handleNotifyMe}
            disabled={notifyLoading}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] text-sm font-semibold text-white transition hover:bg-[#29181B] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Bell size={17} />

            {notifyLoading
              ? "Saving..."
              : "Notify Me"}

          </button>

          <p className="mt-3 text-center text-[11px] text-[#999]">
            We only use your email to notify you about this product.
          </p>

        </>

      )}

    </div>

  </div>
)}
      <Footer />
    </>
  );
}