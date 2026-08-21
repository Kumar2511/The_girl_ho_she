import Link from "next/link";

import VipSubscribe from "@/components/home/vip-subscribe";
import CategoryProductSections from "@/components/home/category-product-sections";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import DesignerCollections from "@/components/home/designer-collections";
import Navbar from "@/components/navbar";
import Hero from "@/components/home/Hero";
import { TrustBadge } from "@/components/trust-badge";
import { InstagramGallery } from "@/components/instagram-gallery";
import Footer from "@/components/footer";

export default async function Home() {
  // ============================================
  // HERO BANNERS
  // ============================================

  const heroBannersResponse = await fetch(
    "http://localhost:5000/api/banners/hero",
    {
      cache: "no-store",
    }
  )
    .then((res) => res.json())
    .catch(() => ({
      banners: [],
    }));

  const heroBanners =
    heroBannersResponse.banners || [];

  // ============================================
  // TESTIMONIALS
  // ============================================

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Fashion Blogger",
      image: "/products/necklace-1.png",
      text: "the_girl_ho_se pieces are absolutely stunning! The quality rivals pieces 10x the price. I get compliments every time I wear them.",
      rating: 5,
      verified: true,
    },
    {
      name: "Emily Johnson",
      role: "Event Coordinator",
      image: "/products/bracelet-1.png",
      text: "Perfect for every occasion. The customer service is exceptional and delivery is lightning fast. Highly recommend!",
      rating: 5,
      verified: true,
    },
    {
      name: "Jessica Davis",
      role: "Luxury Consultant",
      image: "/products/earrings-1.png",
      text: "These pieces look incredibly expensive. The attention to detail and craftsmanship is unmatched at this price point.",
      rating: 5,
      verified: true,
    },
    {
      name: "Michelle Chen",
      role: "Jewelry Enthusiast",
      image: "/products/ring-1.png",
      text: "I have recommended the_girl_ho_se to all my friends. The collections are always fresh and trending. Love the exclusivity!",
      rating: 4.8,
      verified: true,
    },
  ];

  // ============================================
  // INSTAGRAM GALLERY
  // ============================================

  const instagramItems = [
    {
      image: "/products/necklace-1.png",
      likes: 1204,
      comments: 89,
    },
    {
      image: "/products/bracelet-1.png",
      likes: 956,
      comments: 64,
    },
    {
      image: "/products/earrings-1.png",
      likes: 2341,
      comments: 127,
    },
    {
      image: "/products/ring-1.png",
      likes: 1847,
      comments: 102,
    },
    {
      image: "/products/chain-1.png",
      likes: 1565,
      comments: 94,
    },
    {
      image: "/products/necklace-1.png",
      likes: 2103,
      comments: 156,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FCFAF7]">

      {/* ============================================
          ANNOUNCEMENT / SHIPPING BAR
      ============================================ */}

      <AnnouncementBar />

      {/* ============================================
          MAIN NAVIGATION
      ============================================ */}

      <Navbar />

      {/* ============================================
          HERO
      ============================================ */}

      <Hero banners={heroBanners} />

      {/* ============================================
          CATEGORY SHOWCASE
          6 categories
          Desktop: 3 + 3
          Mobile: 2 + 2 + 2
      ============================================ */}

      <DesignerCollections />

      {/* ============================================
          CATEGORY PRODUCT SECTIONS
          
          Necklaces
          Earrings
          Rings
          Bangles
          Bracelets
          Jewellery Sets
          
          Each category has:
          - Horizontal product scrolling
          - Number navigation
          - Previous / Next arrows
          - View All
      ============================================ */}

      <CategoryProductSections />

      {/* ============================================
          TRUST & QUALITY
      ============================================ */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center sm:mb-16">

            <span className="text-sm font-bold uppercase tracking-widest text-[#C78B7B]">
              Why Trust Us
            </span>

            <h2 className="mt-3 font-serif text-3xl text-[#2E2E2E] sm:text-4xl lg:text-5xl">
              Premium Quality Guaranteed
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B6B6B] sm:text-lg">
              We&apos;re committed to bringing you the finest artificial
              jewelry with uncompromising quality standards.
            </p>

          </div>

          {/* Trust badges */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <TrustBadge
              icon="🏆"
              title="Premium Materials"
              description="Hand-selected from top manufacturers worldwide"
            />

            <TrustBadge
              icon="✓"
              title="Quality Assured"
              description="Every piece inspected for perfection"
            />

            <TrustBadge
              icon="🚚"
              title="Fast Shipping"
              description="Free delivery on eligible orders"
            />

            <TrustBadge
              icon="❤️"
              title="Satisfaction Guaranteed"
              description="Your satisfaction is our priority"
            />

          </div>
        </div>
      </section>

      {/* ============================================
          INSTAGRAM COMMUNITY
      ============================================ */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center sm:mb-16">

            <span className="text-sm font-bold uppercase tracking-widest text-[#C78B7B]">
              Social
            </span>

            <h2 className="mt-3 font-serif text-3xl text-[#2E2E2E] sm:text-4xl lg:text-5xl">
              Join Our Community
            </h2>

            <p className="mt-4 text-base text-[#6B6B6B] sm:text-lg">
              Follow us on Instagram for daily inspiration and exclusive offers
            </p>

            <a
              href="https://www.instagram.com/the_girl_ho_se/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[#C78B7B]
                to-[#D6B36A]
                px-6
                py-3
                font-bold
                text-white
                transition-all
                hover:shadow-lg
              "
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.206 0-3.584-.012-4.849-.069-3.25-.148-4.768-1.693-4.917-4.922-.057-1.265-.069-1.689-.069-4.849 0-3.204.013-3.583.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.059 1.69-.073 4.849-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
              </svg>

              @the_girl_ho_se
            </a>

          </div>

          <InstagramGallery
            items={instagramItems}
          />

          <div className="mt-10 text-center sm:mt-12">

            <p className="mb-4 text-sm text-[#6B6B6B] sm:text-base">
              Tag us in your photos for a chance to be featured
            </p>

            <button
              type="button"
              className="
                rounded-xl
                bg-[#F4EEE8]
                px-8
                py-3
                font-bold
                text-[#C78B7B]
                transition-all
                hover:bg-[#C78B7B]
                hover:text-white
              "
            >
              Share Your Look
            </button>

          </div>

        </div>
      </section>

      {/* ============================================
          PREMIUM CTA
      ============================================ */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#2E2E2E] via-[#3D3D3D] to-[#2E2E2E] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">

        {/* Background decoration */}

        <div className="absolute inset-0 opacity-10">

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#C78B7B] blur-3xl sm:h-96 sm:w-96" />

          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#D6B36A] blur-3xl sm:h-96 sm:w-96" />

        </div>

        <div className="relative mx-auto max-w-4xl text-center">

          <h2 className="font-serif text-4xl text-white sm:text-5xl lg:text-6xl">
            Elevate Your Style Today
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg lg:text-xl">
            Discover beautiful jewelry designed to complement your unique style.
          </p>

          <div className="mb-10 mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/shop"
              className="
                rounded-xl
                bg-[#C78B7B]
                px-8
                py-4
                text-base
                font-bold
                text-white
                shadow-xl
                transition-all
                duration-300
                hover:bg-[#D6B36A]
                hover:shadow-2xl
                sm:px-10
                sm:text-lg
              "
            >
              Start Shopping
            </Link>

            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border-2
                border-white/30
                bg-white/10
                px-8
                py-4
                text-base
                font-bold
                text-white
                backdrop-blur-md
                transition-all
                hover:border-white/60
                hover:bg-white/20
                sm:px-10
                sm:text-lg
              "
            >
              💬 Chat with Us
            </a>

          </div>

          {/* Trust badges */}

          <div className="flex flex-wrap justify-center gap-6 border-t border-white/20 pt-8 sm:gap-8">

            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <span className="text-[#D6B36A]">✓</span>
              SSL Secure Checkout
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <span className="text-[#D6B36A]">✓</span>
              Free Returns
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <span className="text-[#D6B36A]">✓</span>
              Lifetime Support
            </div>

          </div>

        </div>

      </section>

      {/* ============================================
          VIP NEWSLETTER
      ============================================ */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border-2 border-[#E8E3DC] bg-gradient-to-br from-[#F9F7F4] to-[#F4EEE8] p-8 text-center sm:p-12 md:p-16">

            <span className="text-sm font-bold uppercase tracking-widest text-[#C78B7B]">
              Exclusive
            </span>

            <h2 className="mt-4 font-serif text-3xl text-[#2E2E2E] sm:text-4xl md:text-5xl">
              VIP Early Access
            </h2>

            <p className="mb-8 mt-4 text-base text-[#6B6B6B] sm:mb-10 sm:text-lg">
              Get 15% off your first purchase + exclusive access to limited editions before anyone else.
            </p>

            <div className="mx-auto mb-6 flex max-w-md gap-3">
              <VipSubscribe />
            </div>

            <p className="text-xs text-[#6B6B6B]">
              We respect your privacy. Unsubscribe at any time.
            </p>

          </div>

        </div>
      </section>

      {/* ============================================
          FOOTER
      ============================================ */}

      <Footer />

    </main>
  );
}