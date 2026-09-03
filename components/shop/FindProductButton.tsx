"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Search,
  X,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";

import api from "@/lib/api";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function FindProductButton() {
  const router = useRouter();

  // ==========================================
  // Modal State & Active Tab
  // ==========================================

  const [open, setOpen] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"url" | "screenshot">("url");

  useScrollLock(open);

  const openModal = () => {
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

  // ==========================================
  // Tab 1: Instagram URL State
  // ==========================================

  const [productLink, setProductLink] = useState("");
  const [searchingUrl, setSearchingUrl] = useState(false);

  // ==========================================
  // Tab 2: Screenshot State
  // ==========================================

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [searchingImage, setSearchingImage] = useState(false);

  // ==========================================
  // Search Results & Error
  // ==========================================

  const [matches, setMatches] = useState<any[]>([]);
  const [exactMatch, setExactMatch] = useState<any | null>(null);
  const [error, setError] = useState("");

  // ==========================================
  // Escape Key & Preview Cleanup
  // ==========================================

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
  // Tab 1: Search Product by Instagram URL
  // ==========================================

  const searchProductByUrl = async () => {
    setError("");
    setMatches([]);
    setExactMatch(null);

    const link = productLink.trim();

    if (!link) {
      setError("Please paste an Instagram product URL.");
      return;
    }

    try {
      setSearchingUrl(true);

      const response = await api.post("/image-search/url", {
        url: link,
      });

      if (response.data?.success && response.data?.redirectUrl) {
        closeModal();
        router.push(response.data.redirectUrl);
        return;
      }

      setError(
        response.data?.message || "No matching product found in our catalogue."
      );
    } catch (err: any) {
      console.error("Instagram URL Search Error:", err);
      setError(
        err?.response?.data?.message ||
          "No matching product found in our catalogue for this Instagram link."
      );
    } finally {
      setSearchingUrl(false);
    }
  };

  // ==========================================
  // Tab 2: Handle Image Selection (Temporary Preview)
  // ==========================================

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
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
    setError("");
  };

  // ==========================================
  // Tab 2: Visual Catalogue Matching (Temporary Screenshot)
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

      const formData = new FormData();
      formData.append("media", selectedImage);

      const response = await api.post("/image-search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to analyze image.");
        return;
      }

      const matchCandidates = response.data.matches || [];
      const primaryMatch = response.data.exactMatch || null;

      setExactMatch(primaryMatch);
      setMatches(matchCandidates);

      if (matchCandidates.length === 0 && !primaryMatch) {
        setError("No matching products found in our catalogue. Try another screenshot.");
      }
    } catch (err: any) {
      console.error("Screenshot Search Error:", err);
      setError(
        err?.response?.data?.message || "Unable to process screenshot. Please try again."
      );
    } finally {
      setSearchingImage(false);
    }
  };

  // ==========================================
  // Reset Screenshot Selection
  // ==========================================

  const removeScreenshot = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview("");
    setMatches([]);
    setExactMatch(null);
    setError("");
  };

  return (
    <>
      {/* ==================================================
          FLOATING ACTION BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={openModal}
        aria-label="Find Your Product"
        title="Find Your Product"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3A2528] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      >
        <Search size={20} />
      </button>

      {/* ==================================================
          FIND YOUR PRODUCT MODAL
      ================================================== */}

      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            onClick={closeModal}
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs ${
              isClosingModal ? "animate-backdrop-fade-out" : "animate-backdrop-fade"
            }`}
          />

          {/* MODAL CONTAINER (MORPHS TO/FROM FLOATING ICON ORIGIN) */}
          <div
            className={`relative z-10 w-full max-w-xl rounded-3xl border border-[#EEE5DE] bg-white p-6 shadow-2xl md:p-8 ${
              isClosingModal ? "animate-icon-modal-close" : "animate-icon-modal-open"
            }`}
          >
            
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#F4EEE9] pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3A2528]">
                  Find Your Product
                </h2>
                <p className="text-xs text-[#777]">
                  Locate jewellery from our catalogue by Instagram URL or screenshot
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EBE6] text-[#3A2528] transition hover:bg-[#E8D9D1]"
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#FCFAF7] p-1.5 border border-[#E8DFD9]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("url");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  activeTab === "url"
                    ? "bg-[#3A2528] text-white shadow-sm"
                    : "text-[#555] hover:text-[#3A2528]"
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
                    ? "bg-[#3A2528] text-white shadow-sm"
                    : "text-[#555] hover:text-[#3A2528]"
                }`}
              >
                <ImageIcon size={14} />
                <span>Upload Screenshot</span>
              </button>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            {/* TAB 1: INSTAGRAM URL */}
            {activeTab === "url" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#3A2528]">
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
                    className="w-full rounded-xl border border-[#E5DDD8] px-4 py-3 text-xs font-medium text-[#3A2528] outline-none transition focus:border-[#C78B7B]"
                  />
                </div>

                <button
                  type="button"
                  onClick={searchProductByUrl}
                  disabled={searchingUrl || !productLink.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#29181B] disabled:opacity-50"
                >
                  {searchingUrl ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Searching Catalogue...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Search Product</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: UPLOAD SCREENSHOT */}
            {activeTab === "screenshot" && (
              <div className="mt-6 space-y-5">
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DDD5CF] bg-[#FCFAF7] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#C78B7B]" />
                    <p className="text-xs font-bold text-[#3A2528]">
                      Select a jewellery screenshot
                    </p>
                    <p className="mt-1 text-[11px] text-[#777]">
                      Upload JPG, PNG, or WEBP (Max 10MB)
                    </p>
                    <label className="mt-4 cursor-pointer rounded-xl bg-[#3A2528] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#29181B]">
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
                    {/* TEMPORARY LOCAL PREVIEW */}
                    <div className="relative flex items-center gap-4 rounded-2xl border border-[#E8DFD9] bg-[#FCFAF7] p-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {/* Temporary local preview only - Object URL */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Local screenshot preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-bold text-[#3A2528]">
                          {selectedImage?.name}
                        </p>
                        <p className="text-[10px] text-[#888]">
                          Temporary preview (not saved on server)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EBE6] text-[#3A2528] hover:bg-[#E8D9D1]"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>

                    {!matches.length && !searchingImage && (
                      <button
                        type="button"
                        onClick={findProductByScreenshot}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3A2528] py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#29181B]"
                      >
                        <Sparkles size={16} />
                        <span>Scan &amp; Match Catalogue</span>
                      </button>
                    )}

                    {searchingImage && (
                      <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[#3A2528]">
                        <Loader2 size={18} className="animate-spin text-[#C78B7B]" />
                        <span>Scanning catalogue for matching jewellery...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* MATCHED CATALOGUE PRODUCTS */}
                {matches.length > 0 && (
                  <div className="mt-4 border-t border-[#F4EEE9] pt-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3A2528]">
                      Catalogue Matches ({matches.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {matches.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            closeModal();
                            router.push(`/shop/${item._id}`);
                          }}
                          className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E8DFD9] bg-white p-2.5 transition hover:border-[#C78B7B] hover:shadow-md"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
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
                            <p className="truncate text-xs font-bold text-[#3A2528] group-hover:text-[#C78B7B]">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-semibold text-[#8D4E67]">
                              ₹{item.price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <ArrowRight size={14} className="text-[#888] group-hover:text-[#C78B7B]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}