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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">

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
            product.stock ?? 0
          }
        />

      ))}

    </div>
  );
}