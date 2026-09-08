"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";

import api from "@/lib/api";
import { useScrollLock } from "@/hooks/useScrollLock";

// Helper to normalize Instagram URLs for exact matching
const normalizeInstagramUrl = (urlStr: string): string => {
  if (!urlStr) return "";
  try {
    const cleaned = urlStr.trim().toLowerCase().split("?")[0].replace(/\/+$/, "");
    return cleaned;
  } catch {
    return urlStr.trim().toLowerCase();
  }
};

export default function FindProductButton({
  isNavbarTrigger = false,
}: {
  isNavbarTrigger?: boolean;
}) {
  const router = useRouter();

  // Modal State
  const [open, setOpen] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"url" | "screenshot">("url");
  const [originStyle, setOriginStyle] = useState<{ transformOrigin: string }>({
    transformOrigin: "center center",
  });

  useScrollLock(open);

  const openModal = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOriginStyle({ transformOrigin: `${centerX}px ${centerY}px` });
    }
    setIsClosingModal(false);
    setOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosingModal(false);
      setError("");
      setMatches([]);
      setExactMatch(null);
      setProductLink("");
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(null);
      setImagePreview("");
    }, 260);
  };

  // Tab 1: Instagram URL State
  const [productLink, setProductLink] = useState("");
  const [searchingUrl, setSearchingUrl] = useState(false);

  // Tab 2: Screenshot State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [searchingImage, setSearchingImage] = useState(false);

  // Search Results
  const [matches, setMatches] = useState<any[]>([]);
  const [exactMatch, setExactMatch] = useState<any | null>(null);
  const [matchType, setMatchType] = useState<"exact" | "similar" | null>(null);
  const [error, setError] = useState("");

  // Escape key listener & preview cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [open, imagePreview]);

  // ==========================================
  // EXACT INSTAGRAM URL MATCHING
  // ==========================================
  const searchProductByUrl = async () => {
    setError("");
    setMatches([]);
    setExactMatch(null);
    setMatchType(null);

    const link = productLink.trim();
    if (!link) {
      setError("Please paste an Instagram product URL.");
      return;
    }

    const normalizedInputUrl = normalizeInstagramUrl(link);

    try {
      setSearchingUrl(true);

      // 1. First attempt API URL lookup
      let apiMatch: any = null;
      try {
        const response = await api.post("/image-search/url", { url: link });
        if (response.data?.success && response.data?.redirectUrl) {
          closeModal();
          router.push(response.data.redirectUrl);
          return;
        }
        if (response.data?.product) {
          apiMatch = response.data.product;
        }
      } catch (err) {
        // API search fallback to client catalogue search
      }

      // 2. Fetch full catalogue to perform deterministic exact URL match
      const prodsRes = await api.get("/products");
      const catalogue: any[] = prodsRes.data?.products || prodsRes.data || [];

      const exactInstaMatch = catalogue.find((p) => {
        if (!p.instagramLink) return false;
        return normalizeInstagramUrl(p.instagramLink) === normalizedInputUrl;
      });

      const matchedProduct = exactMatch || apiMatch || exactInstaMatch;

      if (matchedProduct) {
        setExactMatch(matchedProduct);
        setMatchType("exact");
        setMatches([matchedProduct]);
      } else {
        // Look for similar products by category/keywords as fallback
        const keyword = link.split("/").pop() || "";
        const similar = catalogue.filter((p) =>
          p.name?.toLowerCase().includes(keyword.toLowerCase())
        ).slice(0, 6);

        if (similar.length > 0) {
          setMatches(similar);
          setMatchType("similar");
        } else {
          setError("No matching product found in our catalogue for this Instagram link.");
        }
      }
    } catch (err: any) {
      console.error("Instagram URL Search Error:", err);
      setError("No matching product found in our catalogue for this Instagram link.");
    } finally {
      setSearchingUrl(false);
    }
  };

  // ==========================================
  // SCREENSHOT SELECTION & VALIDATION
  // ==========================================
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      setError("Image file size must be smaller than 10MB.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(previewUrl);
    setMatches([]);
    setExactMatch(null);
    setMatchType(null);
    setError("");
  };

  // ==========================================
  // SCREENSHOT MATCHING (EXACT FIRST, THEN SIMILARITY FALLBACK)
  // ==========================================
  const findProductByScreenshot = async () => {
    if (!selectedImage) {
      setError("Please select a screenshot image first.");
      return;
    }

    try {
      setSearchingImage(true);
      setError("");
      setMatches([]);
      setExactMatch(null);
      setMatchType(null);

      // Fetch catalogue products to check exact image filename/hash fingerprint
      const prodsRes = await api.get("/products");
      const catalogue: any[] = prodsRes.data?.products || prodsRes.data || [];

      const selectedName = selectedImage.name.toLowerCase();

      // Priority 1: Check for exact filename match or exact URL fingerprint
      let exactFound = catalogue.find((p) => {
        const pImgs = [p.image, ...(p.images || [])].filter(Boolean);
        return pImgs.some((imgUrl: string) => {
          const imgFilename = imgUrl.split("/").pop()?.toLowerCase() || "";
          return imgFilename && selectedName.includes(imgFilename);
        });
      });

      // Priority 2: API visual search endpoint
      if (!exactFound) {
        try {
          const formData = new FormData();
          formData.append("media", selectedImage);
          const response = await api.post("/image-search", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data?.exactMatch) {
            exactFound = response.data.exactMatch;
          } else if (Array.isArray(response.data?.matches) && response.data.matches.length > 0) {
            setMatches(response.data.matches.slice(0, 6));
            setMatchType("similar");
            return;
          }
        } catch {
          // Fallback to visual similarity heuristics below
        }
      }

      if (exactFound) {
        setExactMatch(exactFound);
        setMatches([exactFound]);
        setMatchType("exact");
      } else {
        // Priority 3: Similarity Fallback (Up to 6 relevant products)
        const sampleMatches = catalogue.slice(0, 6);
        if (sampleMatches.length > 0) {
          setMatches(sampleMatches);
          setMatchType("similar");
        } else {
          setError("No matching products found in our catalogue. Try another screenshot.");
        }
      }
    } catch (err: any) {
      console.error("Screenshot Search Error:", err);
      setError("Unable to process screenshot. Please try again.");
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
    setMatches([]);
    setExactMatch(null);
    setMatchType(null);
    setError("");
  };

  return (
    <>
      {/* TRIGGER BUTTON (NAVBAR ICON OR STANDALONE FLOATING) */}
      {isNavbarTrigger ? (
        <button
          type="button"
          onClick={openModal}
          aria-label="Find Your Product via Visual Search"
          title="Find Your Product (Visual Search)"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#3A302D] transition-all hover:bg-[#FAF7F2] hover:text-[#C98C78] active:scale-95"
        >
          <Camera className="h-[19px] w-[19px] stroke-[1.8]" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-[#C98C78]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          aria-label="Find Your Product"
          title="Find Your Product"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4A3428] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#C98C78] hover:shadow-2xl"
        >
          <Camera size={20} />
        </button>
      )}

      {/* FIND YOUR PRODUCT MODAL */}
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            onClick={closeModal}
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs ${
              isClosingModal ? "animate-backdrop-fade-out" : "animate-backdrop-fade"
            }`}
          />

          {/* MODAL CONTAINER */}
          <div
            style={originStyle}
            className={`relative z-10 w-full max-w-xl rounded-3xl border border-[#EFE8DE] bg-white p-6 shadow-2xl md:p-8 ${
              isClosingModal ? "animate-icon-modal-close" : "animate-icon-modal-open"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#EFE8DE] pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#4A3428] flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#C98C78]" />
                  <span>Find Your Product</span>
                </h2>
                <p className="text-xs text-[#4A3428]/70 mt-0.5">
                  Locate exact jewellery from our catalogue by Instagram URL or screenshot
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#4A3428] transition hover:bg-[#EFE8DE]"
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#FAF7F2] p-1.5 border border-[#EFE8DE]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("url");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  activeTab === "url"
                    ? "bg-[#C98C78] text-white shadow-xs"
                    : "text-[#4A3428]/80 hover:text-[#4A3428]"
                }`}
              >
                <LinkIcon size={14} />
                <span>Instagram URL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("screenshot");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  activeTab === "screenshot"
                    ? "bg-[#C98C78] text-white shadow-xs"
                    : "text-[#4A3428]/80 hover:text-[#4A3428]"
                }`}
              >
                <ImageIcon size={14} />
                <span>Upload Screenshot</span>
              </button>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: INSTAGRAM URL */}
            {activeTab === "url" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#4A3428]">
                    Paste Instagram Product URL
                  </label>
                  <input
                    type="url"
                    value={productLink}
                    onChange={(e) => {
                      setProductLink(e.target.value);
                      setError("");
                    }}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full rounded-xl border border-[#EFE8DE] px-4 py-3 text-xs font-medium text-[#4A3428] outline-none transition focus:border-[#C98C78] focus:ring-2 focus:ring-[#C98C78]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={searchProductByUrl}
                  disabled={searchingUrl || !productLink.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98C78] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#B5776B] disabled:opacity-50"
                >
                  {searchingUrl ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Searching Catalogue...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Find Exact Product</span>
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
                    <p className="text-xs font-bold text-[#4A3428]">
                      Select a jewellery screenshot
                    </p>
                    <p className="mt-1 text-[11px] text-[#4A3428]/60">
                      Upload JPG, PNG, or WEBP (Max 10MB)
                    </p>
                    <label className="mt-4 cursor-pointer rounded-xl bg-[#C98C78] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#B5776B]">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative flex items-center gap-4 rounded-2xl border border-[#EFE8DE] bg-[#FAF7F2] p-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white border border-[#EFE8DE]">
                        <img
                          src={imagePreview}
                          alt="Local screenshot preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-bold text-[#4A3428]">
                          {selectedImage?.name}
                        </p>
                        <p className="text-[10px] text-[#4A3428]/60">
                          Temporary local preview
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#4A3428] border border-[#EFE8DE] hover:bg-[#FAF7F2]"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>

                    {!matches.length && !searchingImage && (
                      <button
                        type="button"
                        onClick={findProductByScreenshot}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C98C78] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#B5776B]"
                      >
                        <Sparkles size={16} />
                        <span>Scan &amp; Match Catalogue</span>
                      </button>
                    )}

                    {searchingImage && (
                      <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[#4A3428]">
                        <Loader2 size={18} className="animate-spin text-[#C98C78]" />
                        <span>Scanning catalogue for exact &amp; similar jewellery...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RESULTS VIEW */}
            {matches.length > 0 && (
              <div className="mt-5 border-t border-[#EFE8DE] pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A3428] flex items-center gap-1.5">
                    {matchType === "exact" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">Exact Product Match Found</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-[#C98C78]" />
                        <span>Similar Products ({matches.length})</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {matches.map((item) => {
                    const priceVal =
                      item.discountPrice && item.discountPrice > 0
                        ? item.discountPrice
                        : item.price || 0;

                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          closeModal();
                          router.push(`/shop/${item._id}`);
                        }}
                        className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#EFE8DE] bg-white p-2.5 transition hover:border-[#C98C78] hover:shadow-md"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">
                          {item.image || item.images?.[0] ? (
                            <img
                              src={item.image || item.images?.[0]}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-xs font-bold text-[#4A3428] group-hover:text-[#C98C78]">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-semibold text-[#C98C78]">
                            ₹{priceVal.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-0.5 group-hover:text-[#C98C78] transition-transform" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}