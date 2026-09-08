"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import { useRouter, usePathname } from "next/navigation";

import {
  Search,
  X,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Camera,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import api from "@/lib/api";
import { useScrollLock } from "@/hooks/useScrollLock";

// ======================================================
// TYPES & HELPER UTILITIES
// ======================================================

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category?: string;
  image?: string;
  images?: string[];
}

type MatchType = "exact" | "category" | "similar" | "none" | null;
type ErrorType = "invalid" | "not_found" | "generic" | null;

const normalizeInstagramUrl = (urlStr: string): string => {
  if (!urlStr) return "";
  try {
    return urlStr
      .trim()
      .toLowerCase()
      .split("?")[0]
      .replace(/\/+$/, "");
  } catch {
    return urlStr.trim().toLowerCase();
  }
};

const formatImageUrl = (img?: string): string => {
  if (!img || typeof img !== "string") return "https://images.pexels.com/photos/28985980/pexels-photo-28985980.jpeg";
  const trimmed = img.trim();
  if (!trimmed) return "https://images.pexels.com/photos/28985980/pexels-photo-28985980.jpeg";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

/**
 * Deduplicates product array by _id to prevent duplicate card rendering.
 */
const deduplicateProducts = (list: any[]): ProductItem[] => {
  if (!Array.isArray(list)) return [];
  const unique: ProductItem[] = [];
  const seen = new Set<string>();

  for (const item of list) {
    if (!item || !item._id) continue;
    const idStr = String(item._id);
    if (!seen.has(idStr)) {
      seen.add(idStr);
      unique.push(item);
    }
  }

  return unique;
};

// ======================================================
// 8 CANONICAL GIRL HOUSE CATEGORIES
// ======================================================
const GIRL_HOUSE_8_CATEGORIES = [
  {
    name: "Necklaces",
    slug: "Necklaces",
    image: "https://images.pexels.com/photos/28985980/pexels-photo-28985980.jpeg",
  },
  {
    name: "Chains",
    slug: "Chains",
    image: "https://images.pexels.com/photos/6689398/pexels-photo-6689398.jpeg",
  },
  {
    name: "Bracelets",
    slug: "Bracelets",
    image: "https://images.pexels.com/photos/14111395/pexels-photo-14111395.jpeg",
  },
  {
    name: "Earrings",
    slug: "Earrings",
    image: "https://images.pexels.com/photos/28985981/pexels-photo-28985981.jpeg",
  },
  {
    name: "Rings",
    slug: "Rings",
    image: "https://images.pexels.com/photos/9173459/pexels-photo-9173459.jpeg",
  },
  {
    name: "Pendants",
    slug: "Pendants",
    image: "https://images.pexels.com/photos/6716446/pexels-photo-6716446.jpeg",
  },
  {
    name: "Jewelry Sets",
    slug: "Jewelry Sets",
    image: "https://images.pexels.com/photos/5116272/pexels-photo-5116272.jpeg",
  },
  {
    name: "Accessories",
    slug: "Accessories",
    image: "https://images.pexels.com/photos/6716443/pexels-photo-6716443.jpeg",
  },
];

export default function FindProductButton({
  isNavbarTrigger = false,
}: {
  isNavbarTrigger?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Modal State
  const [open, setOpen] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"url" | "screenshot">("url");
  const [originStyle, setOriginStyle] = useState<{ transformOrigin: string }>({
    transformOrigin: "center center",
  });

  useScrollLock(open);

  // Category & Image State
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Instagram Link State
  const [productLink, setProductLink] = useState("");
  const [searchingUrl, setSearchingUrl] = useState(false);

  // Screenshot Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [searchingImage, setSearchingImage] = useState(false);

  // Search Results
  const [exactMatch, setExactMatch] = useState<ProductItem | null>(null);
  const [matches, setMatches] = useState<ProductItem[]>([]);
  const [matchType, setMatchType] = useState<MatchType>(null);
  const [detectedCategoryName, setDetectedCategoryName] = useState<string>("");

  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>(null);

  const resetSearchState = () => {
    setExactMatch(null);
    setMatches([]);
    setMatchType(null);
    setDetectedCategoryName("");
    setError("");
    setErrorType(null);
  };

  // Close modal automatically on route change
  useEffect(() => {
    if (open) {
      setOpen(false);
      setIsClosingModal(false);
      resetSearchState();
    }
  }, [pathname]);

  const openModal = (e?: MouseEvent<HTMLButtonElement>) => {
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOriginStyle({
        transformOrigin: `${centerX}px ${centerY}px`,
      });
    }
    setIsClosingModal(false);
    setOpen(true);
    resetSearchState();
  };

  const closeModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosingModal(false);
      resetSearchState();
      setProductLink("");
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(null);
      setImagePreview("");
    }, 260);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Load Real Category Image Assets
  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        const response = await api.get("/categories");
        const list = Array.isArray(response.data?.categories)
          ? response.data.categories.filter((c: any) => c.isActive !== false)
          : [];
        if (mounted) {
          setDbCategories(list);
        }
      } catch (err) {
        console.error("FindProduct category fetch error:", err);
      }
    };
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const isLegacyImage = (image?: string) => {
    if (!image) return true;
    const val = String(image).toLowerCase();
    return (
      val.includes("/products/necklace-1.") ||
      val.includes("/products/chain-1.") ||
      val.includes("/products/bracelet-1.") ||
      val.includes("/products/earrings-1.") ||
      val.includes("/products/ring-1.")
    );
  };

  const finalCategories = GIRL_HOUSE_8_CATEGORIES.map((defCat) => {
    const dbCat = dbCategories.find(
      (c) => String(c.name).toLowerCase() === defCat.name.toLowerCase()
    );
    const dbImg = dbCat?.image && !isLegacyImage(dbCat.image) ? dbCat.image : null;
    return {
      name: defCat.name,
      slug: defCat.slug,
      image: dbImg || defCat.image,
      fallback: defCat.image,
    };
  });

  // ======================================================
  // 1. INSTAGRAM URL EXACT MATCH SEARCH
  // ======================================================
  const searchProductByUrl = async () => {
    resetSearchState();
    const link = productLink.trim();
    if (!link) {
      setError("Please paste a valid Instagram product URL.");
      setErrorType("generic");
      return;
    }

    const normalizedInputUrl = normalizeInstagramUrl(link);

    try {
      setSearchingUrl(true);

      try {
        const response = await api.post("/image-search/url", { url: link });
        if (response.data?.success && response.data?.redirectUrl) {
          closeModal();
          router.push(response.data.redirectUrl);
          return;
        }
        if (response.data?.product || response.data?.exactMatch) {
          const matchProd = response.data.exactMatch || response.data.product;
          setExactMatch(matchProd);
          setMatches([]);
          setMatchType("exact");
          return;
        }
      } catch {
        // Fallback to client catalogue check
      }

      const productsResponse = await api.get("/products");
      const catalogue: any[] = productsResponse.data?.products || productsResponse.data || [];
      const exactProduct = catalogue.find((product: any) => {
        if (!product.instagramLink) return false;
        return normalizeInstagramUrl(product.instagramLink) === normalizedInputUrl;
      });

      if (exactProduct) {
        setExactMatch(exactProduct);
        setMatches([]);
        setMatchType("exact");
        return;
      }

      setMatchType("none");
      setError("Sorry, we can't find this product in our store.");
      setErrorType("not_found");
    } catch (err) {
      console.error("Instagram URL Search Error:", err);
      setMatchType("none");
      setError("Sorry, we can't find this product in our store.");
      setErrorType("not_found");
    } finally {
      setSearchingUrl(false);
    }
  };

  // ======================================================
  // 2. SCREENSHOT UPLOAD SEARCH
  // ======================================================
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid product image (JPG, PNG, or WEBP).");
      setErrorType("invalid");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Please upload an image smaller than 10MB.");
      setErrorType("generic");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);
    resetSearchState();
  };

  const findProductByScreenshot = async () => {
    if (!selectedImage) {
      setError("Please upload a valid jewellery image or product screenshot.");
      setErrorType("invalid");
      return;
    }

    try {
      setSearchingImage(true);
      resetSearchState();

      const formData = new FormData();
      formData.append("media", selectedImage);

      const response = await api.post("/image-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resData = response.data || {};

      // CASE 1: EXACT MATCH (SHOW ONLY ONE PRODUCT)
      if (resData.matchType === "exact" && resData.exactMatch) {
        setExactMatch(resData.exactMatch);
        setMatches([]);
        setMatchType("exact");
        setError("");
        setErrorType(null);
        return;
      }

      // CASE 2: CATEGORY MATCH (NO EXACT MATCH, BUT VALID JEWELLERY)
      if (
        (resData.matchType === "category" || resData.matchType === "similar") &&
        Array.isArray(resData.matches) &&
        resData.matches.length > 0
      ) {
        const uniqueCatProds = deduplicateProducts(resData.matches);
        setExactMatch(null);
        setMatches(uniqueCatProds);
        setMatchType("category");
        setDetectedCategoryName(resData.category || "");
        setError("");
        setErrorType(null);
        return;
      }

      // CASE 3: INVALID / UNRELATED IMAGE REJECTION (ZERO PRODUCTS)
      setExactMatch(null);
      setMatches([]);
      setMatchType("none");
      setError(
        resData.message || "Please upload a valid jewellery image or product screenshot."
      );
      setErrorType("invalid");
    } catch (err: any) {
      console.error("Screenshot Search Error:", err);
      setExactMatch(null);
      setMatches([]);
      setMatchType("none");
      setError("Please upload a valid jewellery image or product screenshot.");
      setErrorType("invalid");
    } finally {
      setSearchingImage(false);
    }
  };

  const removeScreenshot = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview("");
    resetSearchState();
  };

  const handleCategoryClick = (catSlug: string) => {
    closeModal();
    router.push(`/shop?category=${encodeURIComponent(catSlug)}`);
  };

  const handleProductClick = (productId: string) => {
    setOpen(false);
    setIsClosingModal(false);
    resetSearchState();
    setProductLink("");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview("");
    router.push(`/shop/${productId}`);
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      {isNavbarTrigger ? (
        <button
          type="button"
          onClick={openModal}
          aria-label="Find Your Product via Visual Search"
          title="Find Your Product"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#3A302D] transition-all hover:bg-[#FAF7F2] hover:text-[#C98C78] active:scale-95"
        >
          <Camera className="h-[19px] w-[19px] stroke-[1.8]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-[#C98C78]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          aria-label="Find Your Product"
          title="Find Your Product"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4A3428] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#C98C78]"
        >
          <Camera size={20} />
        </button>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            onClick={closeModal}
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs ${
              isClosingModal ? "animate-backdrop-fade-out" : "animate-backdrop-fade"
            }`}
          />

          <div
            style={originStyle}
            className={`relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-2xl md:p-8 ${
              isClosingModal ? "animate-icon-modal-close" : "animate-icon-modal-open"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
              <div>
                <h2 className="flex items-center gap-2 font-serif text-xl font-normal text-[#4A3428]">
                  <Camera className="h-5 w-5 text-[#C98C78]" />
                  <span>Find Your Product</span>
                </h2>
                <p className="mt-0.5 text-xs text-[#4A3428]/70">
                  Find exact jewellery from our catalogue by Instagram URL or full screenshot
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#4A3428] transition hover:bg-[#EFE8DE]"
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#EFE8DE] bg-[#FAF7F2] p-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("url");
                  resetSearchState();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition ${
                  activeTab === "url"
                    ? "bg-[#C98C78] text-white shadow-xs"
                    : "text-[#4A3428]/80 hover:text-[#4A3428]"
                }`}
              >
                <LinkIcon size={14} />
                Instagram URL
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("screenshot");
                  resetSearchState();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition ${
                  activeTab === "screenshot"
                    ? "bg-[#C98C78] text-white shadow-xs"
                    : "text-[#4A3428]/80 hover:text-[#4A3428]"
                }`}
              >
                <ImageIcon size={14} />
                Upload Screenshot
              </button>
            </div>

            {/* ERROR / REJECTION MESSAGE */}
            {error && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs ${
                  errorType === "invalid" || matchType === "none"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-[#E9C6BC] bg-[#FFF7F4] text-[#6F4338]"
                }`}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* TAB 1: INSTAGRAM URL */}
            {activeTab === "url" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#4A3428]">
                    Paste Instagram Product URL
                  </label>
                  <input
                    type="url"
                    value={productLink}
                    onChange={(e) => {
                      setProductLink(e.target.value);
                      resetSearchState();
                    }}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full rounded-xl border border-[#EFE8DE] px-4 py-3 text-xs text-[#4A3428] outline-none transition focus:border-[#C98C78] focus:ring-2 focus:ring-[#C98C78]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={searchProductByUrl}
                  disabled={searchingUrl || !productLink.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98C78] py-3 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-[#B5776B] disabled:opacity-50"
                >
                  {searchingUrl ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Searching Catalogue...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Find Exact Product
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: UPLOAD SCREENSHOT */}
            {activeTab === "screenshot" && (
              <div className="mt-6 space-y-5">
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#EFE8DE] bg-[#FAF7F2] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#C98C78]" />
                    <p className="text-xs font-medium text-[#4A3428]">
                      Upload your product screenshot
                    </p>
                    <p className="mt-1 max-w-sm text-[11px] text-[#4A3428]/60">
                      No cropping required. Upload the full screenshot containing the jewellery.
                    </p>
                    <label className="mt-4 cursor-pointer rounded-xl bg-[#C98C78] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#B5776B]">
                      Browse File
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-[#EFE8DE] bg-[#FAF7F2] p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#EFE8DE] bg-white">
                        <img
                          src={imagePreview}
                          alt="Screenshot preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[#4A3428]">
                          {selectedImage?.name}
                        </p>
                        <p className="mt-1 text-[10px] text-[#4A3428]/60">
                          Full screenshot selected
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        aria-label="Remove screenshot"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EFE8DE] bg-white text-[#4A3428]"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>

                    {!searchingImage && matchType === null && (
                      <button
                        type="button"
                        onClick={findProductByScreenshot}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98C78] py-3 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-[#B5776B]"
                      >
                        <Sparkles size={16} />
                        Scan &amp; Match Catalogue
                      </button>
                    )}

                    {searchingImage && (
                      <div className="flex flex-col items-center justify-center gap-2 py-5 text-xs text-[#4A3428]">
                        <Loader2 size={20} className="animate-spin text-[#C98C78]" />
                        Analyzing full screenshot against catalogue...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                CASE 1: EXACT MATCH RESULT (SHOWS ONLY ONE PRODUCT)
            ================================================== */}
            {matchType === "exact" && exactMatch && (
              <div className="mt-5 border-t border-[#EFE8DE] pt-4">
                <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-green-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Exact Product Found
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50/50 p-3.5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-green-200 bg-white">
                    <img
                      src={formatImageUrl(exactMatch.image || exactMatch.images?.[0])}
                      alt={exactMatch.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-[#4A3428]">
                      {exactMatch.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#C98C78]">
                      ₹{(exactMatch.discountPrice && exactMatch.discountPrice > 0
                        ? exactMatch.discountPrice
                        : exactMatch.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProductClick(exactMatch._id)}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#C98C78] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#B5776B]"
                  >
                    View Product
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                CASE 2: CATEGORY MATCH RESULT (DEDUPLICATED CARDS)
            ================================================== */}
            {matchType === "category" && matches.length > 0 && (
              <div className="mt-5 border-t border-[#EFE8DE] pt-4">
                <p className="mb-3 text-xs font-medium text-[#4A3428]">
                  {detectedCategoryName
                    ? `We couldn't find the exact product, but these ${detectedCategoryName} items may be related:`
                    : "We couldn't find the exact product, but these items may be related:"}
                </p>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 max-h-60 overflow-y-auto pr-1">
                  {matches.map((product: ProductItem) => {
                    const price =
                      product.discountPrice && product.discountPrice > 0
                        ? product.discountPrice
                        : product.price || 0;

                    return (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className="group flex flex-col cursor-pointer rounded-xl border border-[#EFE8DE] bg-[#FAF7F2] p-2 transition hover:border-[#C98C78] hover:shadow-xs"
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                          <img
                            src={formatImageUrl(product.image || product.images?.[0])}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <p className="mt-1.5 truncate text-[11px] font-medium text-[#4A3428]">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[10px] font-semibold text-[#C98C78]">
                          ₹{price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================
                MINIATURE CATEGORY MARQUEE (SHOWN ONLY WHEN NOT REJECTED)
            ================================================== */}
            {matchType !== "none" && (
              <div className="mt-5 border-t border-[#EFE8DE] pt-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#4A3428]/70">
                  Explore by Category
                </p>

                <div className="relative w-full overflow-hidden py-1">
                  <div className="find-category-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
                    {[
                      ...finalCategories,
                      ...finalCategories,
                      ...finalCategories,
                      ...finalCategories,
                    ].map((category, index) => (
                      <button
                        type="button"
                        key={`${category.name}-${index}`}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="group flex w-20 shrink-0 flex-col items-center"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-[#EFE8DE] bg-[#FAF7F2]">
                          <img
                            src={category.image}
                            alt={category.name}
                            onError={(event) => {
                              event.currentTarget.src = category.fallback;
                            }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <span className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-[#4A3428] group-hover:text-[#C98C78]">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MARQUEE CSS */}
            <style jsx>{`
              @keyframes categoryMarqueeMove {
                from {
                  transform: translateX(-50%);
                }
                to {
                  transform: translateX(0%);
                }
              }

              .find-category-marquee {
                animation: categoryMarqueeMove 22s linear infinite;
              }

              @media (prefers-reduced-motion: reduce) {
                .find-category-marquee {
                  animation: none;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}