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
    <section className="relative w-full overflow-hidden bg-[#24201F]">
      {/* 
        Responsive hero image

        Mobile:
        - Portrait-friendly height
        - Full viewport width
        - Cropped naturally

        Tablet:
        - Slightly taller image

        Desktop:
        - Wide editorial presentation
      */}
      <div
        className="
          relative
          h-[330px]
          w-full
          overflow-hidden
          sm:h-[420px]
          md:h-[500px]
          lg:h-[560px]
          xl:h-[620px]
        "
      >
        {/* Soft loading background */}
        <div
          className={`
            absolute inset-0
            bg-[#D8D0C8]
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
          alt="The Girl Ho She Jewellery"
          fill
          priority
          sizes="
            100vw
          "
          onLoad={() => setImageLoaded(true)}
          className="
            object-cover
            object-center
          "
        />

        {/* Very subtle cinematic dimming.
            No text or UI is placed over the image. */}
        <div className="pointer-events-none absolute inset-0 bg-black/[0.06]" />

        {/* Soft bottom fade to blend into the next section */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-16
            bg-gradient-to-t
            from-black/[0.10]
            to-transparent
          "
        />
      </div>
    </section>
  );
}