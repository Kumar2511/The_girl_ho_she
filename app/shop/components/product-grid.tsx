"use client";

import ProductCard from "@/components/product-card";
import EmptyState from "./empty-state";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (!products.length) {
    return <EmptyState />;
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-x-[10px]
        gap-y-[20px]
        sm:gap-x-4
        sm:gap-y-8
        md:grid-cols-3
        lg:grid-cols-4
        lg:gap-x-6
        lg:gap-y-10
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          id={product._id || product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          originalPrice={
            product.discountPrice &&
            product.discountPrice > product.price
              ? product.discountPrice
              : undefined
          }
          image={
            product.images?.[0] ||
            "/placeholder-product.jpg"
          }
          hoverImage={product.images?.[1]}
          badge={
            product.newArrival
              ? "NEW"
              : product.bestSeller
                ? "BEST"
                : undefined
          }
          averageRating={
            product.averageRating || 4.8
          }
          numReviews={
            product.numReviews || 0
          }
          stock={
            product.stock ?? undefined
          }
        />
      ))}
    </div>
  );
}