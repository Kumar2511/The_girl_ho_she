"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FeaturedCollectionCard } from "@/components/featured-collection-card";

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colsRes, prodsRes] = await Promise.all([
          api.get("/collections"),
          api.get("/products"),
        ]);

        const fetchedCols = Array.isArray(colsRes.data?.collections)
          ? colsRes.data.collections.filter((c: any) => c.isActive !== false)
          : [];
        const fetchedProds = Array.isArray(prodsRes.data?.products)
          ? prodsRes.data.products
          : [];

        setCollections(fetchedCols);
        setProducts(fetchedProds);
      } catch (err) {
        console.error("FeaturedCollections fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const defaultCards = [
    {
      title: "Lakshmi Collection",
      description: "Auspicious handcrafted temple designs dedicated to divine grace.",
      image: "/products/necklace-1.jpg",
      highlight: "Best Seller",
      gradient: true,
    },
    {
      title: "Temple Collection",
      description: "Timeless antique heritage carved with traditional Indian motifs.",
      image: "/products/necklace-2.jpg",
      highlight: "New",
      gradient: false,
    },
    {
      title: "Bridal Collection",
      description: "Royal statement sets designed for unforgettable wedding moments.",
      image: "/products/necklace-3.jpg",
      highlight: "Trending",
      gradient: false,
    },
    {
      title: "Peacock Collection",
      description: "Intricate peacock artistry with vibrant Kemp and kundan stones.",
      image: "/products/necklace-4.jpg",
      highlight: "Exclusive",
      gradient: true,
    },
  ];

  const cardsToRender = collections.length
    ? collections.slice(0, 4).map((col, idx) => {
        const normTitle = String(col.name).toLowerCase().trim();
        const count = products.filter((p: any) => {
          const pCols = Array.isArray(p.collections)
            ? p.collections.map((c: string) => String(c).toLowerCase().trim())
            : [];
          return (
            pCols.includes(normTitle) ||
            String(p.collection || "").toLowerCase().trim() === normTitle ||
            String(p.category || "").toLowerCase().trim() === normTitle
          );
        }).length;

        const highlights = ["Best Seller", "New", "Trending", "Exclusive"];

        return {
          title: col.name,
          description: col.description || "Handcrafted antique jewellery for unforgettable celebrations.",
          image: col.image || `/products/necklace-${(idx % 4) + 1}.jpg`,
          productsCount: count || Math.max(12, products.length / 4 | 0),
          highlight: highlights[idx % highlights.length],
          gradient: idx % 2 === 0,
        };
      })
    : defaultCards.map((col) => {
        const normTitle = col.title.toLowerCase().trim();
        const count = products.filter((p: any) => {
          const pCols = Array.isArray(p.collections)
            ? p.collections.map((c: string) => String(c).toLowerCase().trim())
            : [];
          return (
            pCols.includes(normTitle) ||
            String(p.collection || "").toLowerCase().trim() === normTitle
          );
        }).length;

        return {
          ...col,
          productsCount: count || 15,
        };
      });

  return (
    <section className="py-24 px-6 lg:px-8 bg-[#FCFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border border-[#E8E3DC] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C78B7B] shadow-sm">
            Collections
          </span>

          <h2 className="font-luxury mt-6 text-4xl lg:text-6xl text-[#2E2E2E]">
            Curated Collections
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-[#6B6B6B]">
            Discover our hand-selected collections, each designed to capture a unique moment and mood.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {cardsToRender.map((card, index) => (
            <FeaturedCollectionCard
              key={card.title + index}
              title={card.title}
              description={card.description}
              image={card.image}
              productsCount={card.productsCount}
              highlight={card.highlight}
              gradient={card.gradient}
              href={`/collections?collection=${encodeURIComponent(card.title)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}