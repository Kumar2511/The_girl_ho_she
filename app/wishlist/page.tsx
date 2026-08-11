"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FCFAF7] py-8">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="font-serif text-3xl text-[#2E2E2E] sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-[#777]">
              Save your favourite jewellery and purchase anytime.
            </p>
          </div>

          {wishlist.length === 0 ? (
            /* =========================
               EMPTY WISHLIST
            ========================= */
            <div className="border border-[#E8DFD9] bg-white py-20 text-center">

              <Heart
                className="mx-auto mb-5 text-[#C78B7B]"
                size={52}
              />

              <h2 className="mb-3 font-serif text-2xl text-[#2E2E2E]">
                Your Wishlist is Empty
              </h2>

              <p className="mb-7 text-sm text-[#777]">
                Save your favourite jewellery here.
              </p>

              <Link
                href="/shop"
                className="inline-flex h-10 items-center justify-center bg-[#3A2528] px-7 text-sm font-semibold text-white transition hover:bg-[#29181B]"
              >
                Continue Shopping
              </Link>

            </div>
          ) : (
            /* =========================
               WISHLIST GRID
            ========================= */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="group overflow-hidden border border-[#E8DFD9] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* =========================
                     IMAGE
                  ========================= */}
                  <div className="relative aspect-square overflow-hidden bg-[#FAF7F4]">

                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item._id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
                    >
                      <Heart
                        className="fill-red-500 text-red-500"
                        size={15}
                      />
                    </button>

                  </div>

                  {/* =========================
                     DETAILS
                  ========================= */}
                  <div className="p-3 sm:p-4">

                    <h2 className="line-clamp-2 min-h-[40px] font-serif text-base leading-5 text-[#2E2E2E] sm:text-lg">
                      {item.name}
                    </h2>

                    {/* Rating */}
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-[#777]">
                      <span className="text-[#C96B4B]">★</span>
                      <span>4.5</span>
                    </div>

                    {/* Price */}
                    <p className="mt-2 text-base font-bold text-[#2E2E2E] sm:text-lg">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                    {/* Add To Cart */}
                    <button
  type="button"
  onClick={() => {
    addToCart({
      _id: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      stock: 1,
      quantity: 1,
    });
  }}
  className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 bg-[#3A2528] text-xs font-semibold text-white transition hover:bg-[#29181B] sm:h-10 sm:text-sm"
>
  <ShoppingBag size={15} />
  Add to Cart
</button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}