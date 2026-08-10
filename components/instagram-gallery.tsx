"use client";

import { useState } from "react";
import { X, Heart, MessageCircle, ShoppingCart } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";

interface InstagramProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  stock?: number;
}

interface InstagramItemProps {
  image: string;
  likes: number;
  comments: number;
  product?: InstagramProduct;
}

interface InstagramGalleryItemProps extends InstagramItemProps {
  onClick: () => void;
}

export function InstagramGalleryItem({
  image,
  likes,
  comments,
  onClick,
}: InstagramGalleryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden bg-[#F9F7F4] text-left"
      aria-label="View product"
    >
      {/* Instagram Image */}

      <img
        src={image}
        alt="Instagram jewellery"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}

      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
        <div className="text-center text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex justify-center gap-6 text-sm font-semibold">
            {/* Likes */}

            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-current" />
              {likes}
            </div>

            {/* Comments */}

            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {comments}
            </div>
          </div>

          {/* Shop The Look */}

          <p className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#2E2E2E]">
            Shop The Look
          </p>
        </div>
      </div>
    </button>
  );
}

interface InstagramGalleryProps {
  items: InstagramItemProps[];
}

export function InstagramGallery({
  items,
}: InstagramGalleryProps) {
  const [selectedItem, setSelectedItem] =
    useState<InstagramItemProps | null>(null);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  // ============================
  // Add Product To Cart
  // ============================

  const handleAddToCart = () => {
    if (!selectedItem?.product) {
      showToast(
        "Product information is unavailable.",
        "error"
      );
      return;
    }

    const product = selectedItem.product;

    if (product.stock !== undefined && product.stock <= 0) {
      showToast(
        "This product is out of stock.",
        "error"
      );
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock ?? 1,
      quantity: 1,
    });

    showToast(
      "Added to cart successfully!",
      "success"
    );

    setSelectedItem(null);
  };

  // ============================
  // Close Modal
  // ============================

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      {/* ============================
          Instagram Grid
      ============================ */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {items.map((item, idx) => (
          <InstagramGalleryItem
            key={`${item.image}-${idx}`}
            {...item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* ============================
          Shop The Look Modal
      ============================ */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#FCFAF7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2E2E2E] shadow-lg transition hover:scale-105 hover:bg-[#C78B7B] hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* ============================
                  Instagram Image
              ============================ */}

              <div className="aspect-square bg-[#F4EEE8]">
                <img
                  src={selectedItem.image}
                  alt="Instagram jewellery"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* ============================
                  Product Details
              ============================ */}

              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C78B7B]">
                  Shop The Look
                </span>

                {selectedItem.product ? (
                  <>
                    <h2 className="mt-4 font-serif text-3xl text-[#2E2E2E] md:text-4xl">
                      {selectedItem.product.name}
                    </h2>

                    <div className="mt-5">
                      <span className="text-3xl font-bold text-[#C78B7B]">
                        ₹{selectedItem.product.price}
                      </span>
                    </div>

                    <p className="mt-5 leading-7 text-[#6B6B6B]">
                      Discover this beautiful piece from our
                      premium jewellery collection.
                    </p>

                    {/* Stock */}

                    {selectedItem.product.stock !==
                      undefined && (
                      <p className="mt-4 text-sm text-gray-500">
                        {selectedItem.product.stock > 0
                          ? `${selectedItem.product.stock} pieces available`
                          : "Currently unavailable"}
                      </p>
                    )}

                    {/* Add To Cart */}

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={
                        selectedItem.product.stock !==
                          undefined &&
                        selectedItem.product.stock <= 0
                      }
                      className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#C78B7B] px-6 py-4 font-semibold text-white transition hover:bg-[#B5776B] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ShoppingCart size={20} />

                      {selectedItem.product.stock !==
                        undefined &&
                      selectedItem.product.stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>

                    {/* View Product */}

                    <a
                      href={`/shop/${selectedItem.product._id}`}
                      className="mt-4 flex w-full items-center justify-center rounded-full border border-[#D8C8BE] px-6 py-4 font-semibold text-[#2E2E2E] transition hover:border-[#C78B7B] hover:text-[#C78B7B]"
                    >
                      View Product
                    </a>
                  </>
                ) : (
                  <>
                    <h2 className="mt-4 font-serif text-3xl text-[#2E2E2E]">
                      Featured Jewellery
                    </h2>

                    <p className="mt-5 leading-7 text-[#6B6B6B]">
                      This look is currently unavailable
                      for direct shopping.
                    </p>

                    <a
                      href="/shop"
                      className="mt-8 flex w-full items-center justify-center rounded-full bg-[#C78B7B] px-6 py-4 font-semibold text-white transition hover:bg-[#B5776B]"
                    >
                      Explore Collection
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}