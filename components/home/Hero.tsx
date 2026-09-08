"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Banner {
  _id?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  type?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroProps {
  banners?: Banner[];
}

export default function Hero({
  banners = [],
}: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use the first available banner image only.
  // We are intentionally NOT using the old 3-slide carousel.
  const heroImage =
    banners.find((banner) => banner.image)?.image ||
    "/hero-jewelery.png";

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F3EA]">
      {/* 
        Single Responsive Hero Image Strategy
        Dimensions: 1698 x 926 (Aspect Ratio ~1.83:1)
        Preserves logo mark, "THE GIRL HOUSE" signature, tagline, floral motifs,
        and dusty rose jewellery details cleanly on desktop & mobile without aggressive side cropping.
      */}
      <div
        className="
          relative
          w-full
          aspect-[1698/926]
          max-h-[85vh]
          overflow-hidden
        "
      >
        {/* Soft loading background */}
        <div
          className={`
            absolute inset-0
            bg-[#FAF7F2]
            transition-opacity
            duration-700
            ${
              imageLoaded
                ? "opacity-0"
                : "opacity-100"
            }
          `}
        />

        <Image
          src={heroImage}
          alt="THE GIRL HOUSE Jewellery"
          fill
          priority
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
          className="
            object-cover
            object-center
          "
        />

        {/* Soft bottom blend into warm section background */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-12
            bg-gradient-to-t
            from-[#F7F3EA]/30
            to-transparent
          "
        />
      </div>
    </section>
  );
}