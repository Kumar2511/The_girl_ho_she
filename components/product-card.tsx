"use client";

import ShopProductCard from "@/components/shop/ProductCard";

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
  averageRating = 0,
  numReviews = 0,
  stock,
}: ProductCardProps) {
  const isDiscounted = Boolean(originalPrice && originalPrice > price);

  const productObj = {
    _id: id,
    id: id,
    name,
    category,
    image,
    hoverImage,
    price: isDiscounted ? (originalPrice as number) : price,
    discountPrice: isDiscounted ? price : 0,
    originalPrice: originalPrice || price,
    badge,
    averageRating,
    numReviews,
    stock,
  };

  return <ShopProductCard product={productObj} />;
}