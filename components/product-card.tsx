"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  hoverImage?: string;
  price: number;
  originalPrice?: number;
  badge?: string;

  averageRating?: number;
  numReviews?: number;
  stock?: number;
}

export default function ProductCard({
  id,
  name,
  category,
  image,
  hoverImage,
  price,
  originalPrice,
  badge,
  averageRating = 4.8,
  numReviews = 0,
  stock = 100,
}: ProductCardProps) {

  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const favorite = isInWishlist(id);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  return (

    <div className="group overflow-hidden rounded-lg border border-[#E8E3DC] bg-white transition duration-300 hover:shadow-xl">

      {/* IMAGE */}

      <Link href={`/shop/${id}`}>

        <div
          className="relative aspect-square overflow-hidden bg-[#FAF7F4]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          <Image
            src={image || "/placeholder-product.jpg"}
            alt={name}
            fill
            sizes="(max-width:768px)100vw,25vw"
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {hoverImage && (

            <Image
              src={hoverImage}
              alt={name}
              fill
              sizes="(max-width:768px)100vw,25vw"
              className={`absolute inset-0 object-cover transition-opacity duration-300 ${
                isHovered
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />

          )}

          {/* Badge */}

          {badge && (

            <span className="absolute left-4 top-4 rounded bg-[#8B4A5A] px-2 py-1 text-xs font-semibold text-white">

              {badge}

            </span>

          )}

          {/* Discount */}

          {discount > 0 && (

            <span className="absolute left-4 top-4 rounded bg-[#8B4A5A] px-2 py-1 text-xs font-semibold text-white">

              -{discount}%

            </span>

          )}

          {/* Wishlist */}

          <button
            onClick={(e) => {
              e.preventDefault();

              favorite
                ? removeFromWishlist(id)
                : addToWishlist({
                    _id: id,
                    name,
                    image,
                    price,
                  });
            }}
            className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md transition duration-300 hover:scale-110"
          >

            <Heart
              className={`h-4 w-4 ${
                favorite
                  ? "fill-[#C78B7B] text-[#C78B7B]"
                  : "text-gray-600"
              }`}
            />

          </button>

        </div>

      </Link>

      {/* PRODUCT INFO */}
            <div className="space-y-3 p-5">

        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#B68C7A]">
          {category}
        </p>

        <Link href={`/shop/${id}`}>
          <h3 className="line-clamp-2 font-serif text-[22px] leading-8 text-[#2E2E2E] transition hover:text-[#C78B7B]">
            {name}
          </h3>
        </Link>

        {/* Rating */}

        <div className="flex items-center gap-1 text-sm">

          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

          <span className="text-sm font-medium text-gray-700">
            {averageRating.toFixed(1)}
          </span>

          <span className="text-sm text-gray-500">
            ({numReviews})
          </span>

        </div>

        {/* Price */}

        <div className="flex items-center gap-2">

          <span className="text-3xl font-bold text-[#2E2E2E]">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice && originalPrice > price && (

            <span className="text-base text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>

          )}

        </div>

        

        {/* Buttons */}

        <div className="mt-5">

          <button
  type="button"
  onClick={(e) => {
    e.preventDefault();

    addToCart({
      _id: id,
      name,
      image,
      price,
    });
  }}
  className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#3A2528] text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#281719]"
>
  <ShoppingCart className="h-4 w-4" />
  ADD TO CART
</button>

          

        </div>

      </div>

    </div>

  );

}