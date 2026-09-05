"use client";

import Link from "next/link";
import ProductCard from "@/components/product-card";
import { useEffect, useState } from "react";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const featured = data
          .filter((item: any) => item.featured)
          .slice(0, 8);

        setProducts(featured);
      });
  }, []);

  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-12">

          <div>

            <p className="uppercase tracking-[0.3em] text-[#C78B7B] text-sm font-semibold">
              Trending
            </p>

            <h2 className="font-luxury mt-2 text-5xl text-[#2E2E2E]">
  Trending Collection
</h2>

          </div>

          <Link
            href="/shop"
            className="text-[#C78B7B] font-semibold hover:underline"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {products.map((product: any) => (
            <ProductCard
    key={product._id}
    id={product._id}
    name={product.name}
    price={product.price}
    originalPrice={product.originalPrice}
    image={product.images?.[0] || product.image}
    hoverImage={product.images?.[1]}
    category={product.category}
    badge={product.featured ? "Featured" : ""}
/>
          ))}

        </div>

      </div>

    </section>
  );
}