'use client';

import Link from "next/link";

interface FeaturedCollectionCardProps {
  className?: string;
  title: string;
  description: string;
  image: string;
  productsCount: number;
  highlight?: string;
  gradient?: boolean;
  href?: string;
}

export function FeaturedCollectionCard({
  className,
  title,
  description,
  image,
  productsCount,
  highlight,
  gradient = false,
  href,
}: FeaturedCollectionCardProps) {
  const targetHref = href || `/collections?collection=${encodeURIComponent(title)}`;

  return (
    <Link
      href={targetHref}
      className={`group relative block overflow-hidden rounded-[32px] h-[460px] bg-white shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 ${className || ""}`}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${
          gradient
            ? 'bg-gradient-to-t from-black via-transparent to-transparent'
            : 'bg-gradient-to-t from-[#2E2E2E]/80 via-[#2E2E2E]/40 to-transparent'
        } opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
        <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-5">
          {highlight && (
            <span className="inline-flex items-center rounded-full bg-[#C78B7B]/95 backdrop-blur-md px-5 py-2 text-xs font-semibold uppercase tracking-widest shadow-lg">
              {highlight}
            </span>
          )}
          <h3 className="font-serif text-4xl leading-tight mb-4">{title}</h3>
          <p className="text-base text-white/80 leading-7 mb-6">{description}</p>
          <div className="flex items-center justify-between border-t border-white/20 pt-5">
            <span className="text-sm uppercase tracking-[0.2em] text-white/80">
              {productsCount} Items
            </span>
            <svg
              className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
