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
  Image as ImageIcon,
  QrCode,
  Trash2,
} from "lucide-react";

import api from "@/lib/api";

export default function FindProductButton() {
  const router = useRouter();

  // ==========================================
  // Modal
  // ==========================================

  const [open, setOpen] = useState(false);

  // ==========================================
  // Product Link
  // ==========================================

  const [productLink, setProductLink] =
    useState("");

  // ==========================================
  // Error
  // ==========================================

  const [error, setError] = useState("");

  // ==========================================
  // Screenshot
  // ==========================================

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // ==========================================
  // Image Search Loading
  // ==========================================

  const [searchingImage, setSearchingImage] =
    useState(false);

  // ==========================================
  // Image Search Result
  // ==========================================

  const [uploadedImageUrl, setUploadedImageUrl] =
    useState("");

  // ==========================================
  // Cleanup Preview
  // ==========================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ==========================================
  // Find Product From Link
  // ==========================================

  const findProduct = () => {
    setError("");

    const value = productLink.trim();

    if (!value) {
      setError(
        "Please enter a product link."
      );

      return;
    }

    try {
      let productId = "";

      // ========================================
      // Full URL
      // ========================================

      if (
        value.startsWith("http://") ||
        value.startsWith("https://")
      ) {
        const url = new URL(value);

        const parts = url.pathname
          .split("/")
          .filter(Boolean);

        if (
          parts.length >= 2 &&
          parts[0] === "shop"
        ) {
          productId = parts[1];
        }
      }

      // ========================================
      // Relative URL
      // ========================================

      else if (
        value.startsWith("/shop/")
      ) {
        const parts = value
          .split("/")
          .filter(Boolean);

        if (parts[0] === "shop") {
          productId = parts[1] || "";
        }
      }

      // ========================================
      // Direct Product ID
      // ========================================

      else {
        productId = value;
      }

      if (!productId) {
        setError(
          "We couldn't find a product from this link."
        );

        return;
      }

      // ========================================
      // Navigate
      // ========================================

      setOpen(false);
      setProductLink("");
      setError("");

      router.push(
        `/shop/${productId}`
      );
    } catch (error) {
      console.error(
        "Find Product Error:",
        error
      );

      setError(
        "Please enter a valid product link."
      );
    }
  };

  // ==========================================
  // Screenshot Upload
  // ==========================================

  const handleImageSelect = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // ========================================
    // Validate Type
    // ========================================

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );

      return;
    }

    // ========================================
    // Validate Size
    // ========================================

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image must be smaller than 10MB."
      );

      return;
    }

    // ========================================
    // Remove Previous Preview
    // ========================================

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    // ========================================
    // Create Preview
    // ========================================

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
    setUploadedImageUrl("");
    setError("");
  };

  // ==========================================
  // Remove Screenshot
  // ==========================================

  const removeScreenshot = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);
    setImagePreview("");
    setUploadedImageUrl("");
    setError("");
  };

  // ==========================================
  // Find Product By Image
  // ==========================================

  const findProductByImage = async () => {
    if (!selectedImage) {
      setError(
        "Please select a screenshot first."
      );

      return;
    }

    try {
      setSearchingImage(true);
      setError("");
      setUploadedImageUrl("");

      // ========================================
      // Form Data
      // ========================================

      const formData = new FormData();

      formData.append(
        "image",
        selectedImage
      );

      // ========================================
      // API Request
      // ========================================

      const response = await api.post(
        "/image-search",
        formData
      );

      console.log(
        "IMAGE SEARCH RESPONSE:",
        response.data
      );

      // ========================================
      // API Error
      // ========================================

      if (!response.data?.success) {
        setError(
          response.data?.message ||
            "Image search failed."
        );

        return;
      }

      // ========================================
      // Uploaded Image
      // ========================================

      if (response.data.imageUrl) {
        setUploadedImageUrl(
          response.data.imageUrl
        );
      }

      // ========================================
      // Temporary Success
      // ========================================

      alert(
        "Screenshot uploaded successfully! 🔥"
      );
    } catch (error: any) {
      console.error(
        "IMAGE SEARCH ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to search this image."
      );
    } finally {
      setSearchingImage(false);
    }
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const closeModal = () => {
    setOpen(false);
    setError("");
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <>
      {/* ==================================================
          FLOATING BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
        }}
        aria-label="Find Your Product"
        className="
          fixed
          bottom-6
          right-6
          z-[90]
          flex
          items-center
          gap-2
          rounded-full
          bg-[#3A2528]
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-xl
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-[#29181B]
          hover:shadow-2xl
          active:scale-95
        "
      >
        <Search size={17} />

        <span>
          Find Your Product
        </span>
      </button>

      {/* ==================================================
          MODAL
      ================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/50
            px-5
            py-8
            backdrop-blur-sm
          "
          onClick={closeModal}
        >
          {/* ==================================================
              MODAL CARD
          ================================================== */}

          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-7
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ==================================================
                CLOSE
            ================================================== */}

            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-800
              "
            >
              <X size={19} />
            </button>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="pr-8">
              <div
                className="
                  mb-3
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F5E8E4]
                  text-[#8D4E67]
                "
              >
                <Search size={20} />
              </div>

              <h2
                className="
                  font-serif
                  text-3xl
                  text-[#2E2024]
                "
              >
                Find Your Product
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Found something you love on
                Instagram? Find the same
                product on our website.
              </p>
            </div>

            {/* ==================================================
                PRODUCT LINK
            ================================================== */}

            <div className="mt-7">
              <div className="mb-2 flex items-center gap-2">
                <LinkIcon
                  size={16}
                  className="text-[#C78B7B]"
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#555]
                  "
                >
                  Paste Product Link
                </span>
              </div>

              <input
                type="text"
                value={productLink}
                onChange={(event) => {
                  setProductLink(
                    event.target.value
                  );

                  setError("");
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    findProduct();
                  }
                }}
                placeholder="https://your-site.com/shop/..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E5DDD8]
                  bg-white
                  px-4
                  text-sm
                  text-[#2E2024]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#C78B7B]
                  focus:ring-2
                  focus:ring-[#C78B7B]/10
                "
              />

              {/* Error */}

              {error && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-red-500
                  "
                >
                  {error}
                </p>
              )}

              {/* Find Product */}

              <button
                type="button"
                onClick={findProduct}
                className="
                  mt-3
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#3A2528]
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[#29181B]
                  hover:shadow-lg
                  active:scale-[0.98]
                "
              >
                <Search size={17} />

                Find Product
              </button>
            </div>

            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E8E0DB]" />

              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-gray-400
                "
              >
                Or
              </span>

              <div className="h-px flex-1 bg-[#E8E0DB]" />
            </div>

            {/* ==================================================
                SCREENSHOT + QR
            ================================================== */}

            <div className="grid grid-cols-2 gap-3">

              {/* Screenshot */}

              <label
                className="
                  cursor-pointer
                  rounded-2xl
                  border
                  border-dashed
                  border-[#DDD2CC]
                  bg-[#FCFAF7]
                  p-4
                  text-center
                  transition
                  hover:border-[#C78B7B]
                  hover:bg-[#F9F1ED]
                "
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleImageSelect
                  }
                />

                <ImageIcon
                  size={22}
                  className="
                    mx-auto
                    text-[#8D4E67]
                  "
                />

                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    text-[#2E2024]
                  "
                >
                  Upload Screenshot
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-gray-500
                  "
                >
                  Choose an Instagram
                  screenshot
                </p>
              </label>

              {/* QR */}

              <button
                type="button"
                disabled
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-[#DDD2CC]
                  bg-[#FCFAF7]
                  p-4
                  text-center
                  opacity-60
                "
              >
                <QrCode
                  size={22}
                  className="
                    mx-auto
                    text-[#8D4E67]
                  "
                />

                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    text-[#2E2024]
                  "
                >
                  Scan QR Code
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-gray-500
                  "
                >
                  Coming soon
                </p>
              </button>
            </div>

            {/* ==================================================
                SCREENSHOT PREVIEW
            ================================================== */}

            {selectedImage &&
              imagePreview && (
                <div className="mt-5">

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-[#555]
                      "
                    >
                      Selected Screenshot
                    </p>

                    <button
                      type="button"
                      onClick={
                        removeScreenshot
                      }
                      className="
                        flex
                        items-center
                        gap-1
                        text-xs
                        font-medium
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      <Trash2 size={13} />

                      Remove
                    </button>
                  </div>

                  <div
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E5DDD8]
                      bg-[#FCFAF7]
                    "
                  >
                    <img
                      src={imagePreview}
                      alt="Selected Instagram screenshot"
                      className="
                        max-h-64
                        w-full
                        object-contain
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      truncate
                      text-[10px]
                      text-gray-400
                    "
                  >
                    {selectedImage.name}
                  </p>

                  {/* ==================================================
                      FIND MATCHING PRODUCT
                  ================================================== */}

                  <button
                    type="button"
                    onClick={
                      findProductByImage
                    }
                    disabled={
                      searchingImage
                    }
                    className="
                      mt-3
                      w-full
                      rounded-xl
                      bg-[#3A2528]
                      py-3
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#29181B]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {searchingImage
                      ? "Uploading Screenshot..."
                      : "Find Matching Product"}
                  </button>

                  {/* ==================================================
                      UPLOADED IMAGE URL
                  ================================================== */}

                  {uploadedImageUrl && (
                    <div
                      className="
                        mt-3
                        rounded-xl
                        bg-green-50
                        p-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-green-700
                        "
                      >
                        Screenshot uploaded
                        successfully ✓
                      </p>

                      <p
                        className="
                          mt-1
                          break-all
                          text-[10px]
                          text-green-600
                        "
                      >
                        Cloudinary image
                        received successfully.
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* ==================================================
                INFO
            ================================================== */}

            <p
              className="
                mt-5
                text-center
                text-[10px]
                leading-5
                text-gray-400
              "
            >
              Upload an Instagram screenshot
              and we'll search your jewellery
              catalogue.
            </p>

          </div>
        </div>
      )}
    </>
  );
}