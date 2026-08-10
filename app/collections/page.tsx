'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ProductCard from '@/components/product-card';
import Footer from '@/components/footer';
export default function CollectionsPage() {

  const searchParams = useSearchParams();

  const selectedCollection =
    searchParams.get("collection");

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");

      setProducts(response.data.products);

    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = selectedCollection
    ? products.filter(
        (product: any) =>
          product.collection === selectedCollection
      )
    : products;

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-[#E8E3DC] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl text-[#2E2E2E] mb-4">Collections</h1>
          <p className="text-lg text-[#6B6B6B]">
            Curated collections of premium artificial jewelry for every style and occasion
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {filteredProducts.map((product: any) => (
      <ProductCard
        key={product._id}
        id={product._id}
        name={product.name}
        price={product.discountPrice}
        originalPrice={product.price}
image={product.images?.[0] || "/placeholder-product.jpg"}        category={product.category}
        badge={product.featured ? "Featured" : ""}
      />
    ))}
  </div>
) : (
  <div className="text-center py-20">
    <h2 className="text-3xl font-bold text-[#2E2E2E]">
      No Products Found
    </h2>

    <p className="text-gray-500 mt-2">
      No products available in this collection.
    </p>
  </div>
)}
        </div>
      </section>

      {/* Gift Collection CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl text-[#2E2E2E] mb-6">Gift Collections</h2>
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                Looking for the perfect gift? Our curated gift collections are beautifully packaged and ready to impress. From birthdays to anniversaries, we have something special for everyone.
              </p>
              <ul className="space-y-3 mb-8 text-[#2E2E2E]">
                <li>✓ Complimentary gift wrapping</li>
                <li>✓ Personalized message cards</li>
                <li>✓ Express shipping available</li>
                <li>✓ 100% satisfaction guaranteed</li>
              </ul>
              <Link
                href="/shop?category=gift"
                className="inline-block px-8 py-3 bg-[#C78B7B] hover:bg-[#B5776B] text-white font-semibold rounded-lg transition-colors"
              >
                Shop Gift Collections
              </Link>
            </div>
            <div className="bg-[#F4EEE8] rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-[#C0B9AE]">
                <p className="text-6xl mb-4">🎁</p>
                <p>Premium Gift Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Trends */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-[#2E2E2E] mb-12">Trending This Season</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                trend: 'Layered Necklaces',
                description: 'Mix and match delicate chains for a sophisticated look',
                icon: '✨',
              },
              {
                trend: 'Statement Rings',
                description: 'Bold and beautiful rings that make a statement',
                icon: '💎',
              },
              {
                trend: 'Stacked Bracelets',
                description: 'Combine our bracelet styles for a personalized aesthetic',
                icon: '🌟',
              },
            ].map((trend) => (
              <div key={trend.trend} className="bg-white p-8 rounded-lg border border-[#E8E3DC] text-center">
                <div className="text-5xl mb-4">{trend.icon}</div>
                <h3 className="font-serif text-2xl text-[#2E2E2E] mb-3">{trend.trend}</h3>
                <p className="text-[#6B6B6B] mb-6">{trend.description}</p>
                <Link
                  href="/shop"
                  className="inline-block text-[#C78B7B] hover:text-[#B5776B] font-semibold transition-colors"
                >
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
