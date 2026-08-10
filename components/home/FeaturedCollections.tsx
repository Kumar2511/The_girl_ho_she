"use client";

import { FeaturedCollectionCard } from "@/components/featured-collection-card";

export default function FeaturedCollections() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#FCFAF7] overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="inline-flex items-center rounded-full border border-[#E8E3DC] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C78B7B] shadow-sm">
            Collections
          </span>

          <h2 className="mt-6 font-serif text-4xl lg:text-6xl text-[#2E2E2E]">
            Curated Collections
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-[#6B6B6B]">
            Discover our hand-selected collections, each designed to capture
            a unique moment and mood.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-10">
                    <FeaturedCollectionCard
          title="Rose Gold Romance"
          description="Elegant handcrafted jewellery for unforgettable celebrations."
          image="/products/necklace-1.png"
          productsCount={24}
          highlight="Best Seller"
          gradient
        />

        <FeaturedCollectionCard
          title="Champagne Elegance"
          description="Sophisticated gold tones for timeless style."
          image="/products/bracelet-1.png"
          productsCount={18}
          highlight="New"
        />

        <FeaturedCollectionCard
          title="Delicate Minimalist"
          description="Simple, understated pieces for everyday wear."
          image="/products/earrings-1.png"
          productsCount={32}
          highlight="Trending"
        />

        <FeaturedCollectionCard
          title="Festive Collection"
          description="Bold statement pieces for unforgettable moments."
          image="/products/ring-1.png"
          productsCount={20}
          highlight="Exclusive"
          gradient
        />
                </div>

      </div>

    </section>
  );
}