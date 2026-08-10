"use client";

import type { ComponentType, CSSProperties } from "react";

import EmptyState from "@/components/shop/EmptyState";
import LoadingSkeleton from "@/components/shop/LoadingSkeleton";
import ProductCard from "@/components/shop/ProductCard";

export interface ProductGridProps<TProduct = any> {
  products?: TProduct[];
  isLoading?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid<TProduct = any>({
  products = [],
  isLoading = false,
  className = "",
  emptyTitle = "Your collection awaits",
  emptyDescription = "We could not find pieces matching those selections. Try adjusting your filters.",
}: ProductGridProps<TProduct>) {
  // ==========================================
  // Loading
  // ==========================================

  if (isLoading) {
    return (
      <section
        className={`grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14 ${className}`}
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <LoadingSkeleton key={index} />
          )
        )}
      </section>
    );
  }

  // ==========================================
  // Empty
  // ==========================================

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  // ==========================================
  // Product Grid
  // ==========================================

  return (
    <section
      className={`grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14 ${className}`}
      aria-label="Product collection"
    >
      {products.map((product, index) => (
        <div
          key={
            (product as any)._id ||
            (product as any).id ||
            index
          }
          className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{
            animationDelay: `${Math.min(
              index * 80,
              640
            )}ms`,
            animationFillMode: "both",
          }}
        >
          <ProductCard
            product={product as any}
          />
        </div>
      ))}
    </section>
  );
}

export default ProductGrid;