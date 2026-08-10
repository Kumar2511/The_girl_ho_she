import Image from 'next/image';
import Link from 'next/link';
import VipSubscribe from "@/components/home/vip-subscribe";
import { ArrowRight, Sparkles } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import DesignerCollections from "@/components/home/designer-collections";
import TrendingProducts from "@/components/home/trending-products";
import Navbar from '@/components/navbar';
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import { TrustBadge } from '@/components/trust-badge';
import { TestimonialCard } from '@/components/testimonial-card';
import { FeaturedCollectionCard } from '@/components/featured-collection-card';
import { ProductShowcase } from '@/components/product-showcase';
import { InstagramGallery } from '@/components/instagram-gallery';
import Footer from '@/components/footer';

export default async function Home() {
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

const heroBanners = heroBannersResponse.banners || [];
    const [
  featuredResponse,
  trendingResponse,
  bestSellerResponse,
  newArrivalResponse,
] = await Promise.all([
  fetch("http://localhost:5000/api/products/featured", {
    cache: "no-store",
  }).then((res) => res.json()),

  fetch("http://localhost:5000/api/products/trending", {
    cache: "no-store",
  }).then((res) => res.json()),

  fetch("http://localhost:5000/api/products/best-sellers", {
    cache: "no-store",
  }).then((res) => res.json()),

  fetch("http://localhost:5000/api/products/new-arrivals", {
    cache: "no-store",
  }).then((res) => res.json()),
]);

const featuredProducts = featuredResponse.products || [];
const trendingProducts = trendingResponse.products || [];
const bestSellerProducts = bestSellerResponse.products || [];
const newArrivalProducts = newArrivalResponse.products || [];
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Fashion Blogger',
      image: '/products/necklace-1.png',
      text: 'the_girl_ho_se pieces are absolutely stunning! The quality rivals pieces 10x the price. I get compliments every time I wear them.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Emily Johnson',
      role: 'Event Coordinator',
      image: '/products/bracelet-1.png',
      text: 'Perfect for every occasion. The customer service is exceptional and delivery is lightning fast. Highly recommend!',
      rating: 5,
      verified: true,
    },
    {
      name: 'Jessica Davis',
      role: 'Luxury Consultant',
      image: '/products/earrings-1.png',
      text: 'These pieces look incredibly expensive. The attention to detail and craftsmanship is unmatched at this price point.',
      rating: 5,
      verified: true,
    },
    {
      name: 'Michelle Chen',
      role: 'Jewelry Enthusiast',
      image: '/products/ring-1.png',
      text: 'I have recommended the_girl_ho_se to all my friends. The collections are always fresh and trending. Love the exclusivity!',
      rating: 4.8,
      verified: true,
    },
  ];

 const allProducts = [
  ...featuredProducts,
  ...trendingProducts,
  ...bestSellerProducts,
  ...newArrivalProducts,
];

const instagramImages = [
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

const instagramItems = instagramImages.map(
  (item, index) => {
    const product = allProducts[index];

    return {
      ...item,

      product: product
        ? {
            _id: product._id,
            name: product.name,
            image: product.image,
            price:
              product.discountPrice ||
              product.price,
            stock: product.stock,
          }
        : undefined,
    };
  }
);
  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />
       
    <Hero banners={heroBanners} />
    <DesignerCollections />
    <TrendingProducts />
      {/* Trending Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FCFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">What's Popular</span>
              <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">Trending Now</h2>
            </div>
            <Link
              href="/shop?sort=trending"
              className="hidden sm:inline-flex items-center gap-2 text-[#C78B7B] hover:text-[#D6B36A] font-bold transition-colors"
            >
              View All Trending
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {trendingProducts.map((product: any) => (
    <ProductShowcase
      key={product._id}
      {...product}
    />
  ))}
</div>        </div>
      </section>
      {/* Best Sellers */}
<section className="py-24 px-6 lg:px-8 bg-[#FCFAF7] overflow-hidden">

  <div className="max-w-7xl mx-auto">

    <div className="flex items-end justify-between mb-16">

      <div>
        <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">
          Popular
        </span>

        <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">
          Best Sellers
        </h2>
      </div>

    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {bestSellerProducts.map((product: any) => (

        <ProductShowcase
          key={product._id}
          {...product}
        />

      ))}

    </div>

  </div>

</section>

      {/* Trust & Quality Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">Why Trust Us</span>
            <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">Premium Quality Guaranteed</h2>
            <p className="text-[#6B6B6B] text-lg mt-4 max-w-2xl mx-auto">We're committed to bringing you the finest artificial jewelry with uncompromising quality standards.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              description="Free delivery on orders over $50"
            />
            <TrustBadge
              icon="❤️"
              title="Satisfaction Guaranteed"
              description="100% money-back guarantee"
            />
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-[#E8E3DC]">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#C78B7B] mb-2">50K+</div>
              <p className="text-[#6B6B6B]">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D6B36A] mb-2">4.9★</div>
              <p className="text-[#6B6B6B]">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#C78B7B] mb-2">500+</div>
              <p className="text-[#6B6B6B]">Unique Designs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D6B36A] mb-2">10+ Yrs</div>
              <p className="text-[#6B6B6B]">Industry Leading</p>
            </div>
          </div>
        </div>
      </section>
      {/* Scrolling Announcement */}
      <AnnouncementBar />
      {/* Premium Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FCFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">Customer Stories</span>
            <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">Loved by Thousands</h2>
            <p className="text-[#6B6B6B] text-lg mt-4">See what our customers are saying about their favorite pieces</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">Social</span>
            <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">Join Our Community</h2>
            <p className="text-[#6B6B6B] text-lg mt-4">Follow us on Instagram for daily inspiration and exclusive offers</p>
            <a
              href="https://www.instagram.com/the_girl_ho_se/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#C78B7B] to-[#D6B36A] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.206 0-3.584-.012-4.849-.069-3.25-.148-4.768-1.693-4.917-4.922-.057-1.265-.069-1.645-.069-4.849 0-3.204.013-3.583.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
              </svg>
              @the_girl_ho_se
            </a>
          </div>

          <InstagramGallery items={instagramItems} />

          <div className="text-center mt-12">
            <p className="text-[#6B6B6B] mb-4">Tag us in your photos for a chance to be featured</p>
            <button className="px-8 py-3 bg-[#F4EEE8] text-[#C78B7B] font-bold rounded-xl hover:bg-[#C78B7B] hover:text-white transition-all">
              Share Your Look
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FCFAF7]">
  <div className="max-w-7xl mx-auto">

    <div className="flex items-end justify-between mb-16">

      <div>
        <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">
          Latest
        </span>

        <h2 className="font-serif text-5xl text-[#2E2E2E] mt-3">
          New Arrivals
        </h2>
      </div>

      <Link
        href="/shop?sort=newest"
        className="hidden sm:inline-flex items-center gap-2 text-[#C78B7B] hover:text-[#D6B36A] font-bold transition-colors"
      >
        Explore New Collection

        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>

      </Link>

    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">

      {newArrivalProducts.map((product: any) => (

        <ProductShowcase
          key={product._id}
          {...product}
        />

      ))}

    </div>

  </div>
</section>

      {/* Premium CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#2E2E2E] via-[#3D3D3D] to-[#2E2E2E]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C78B7B] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D6B36A] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Elevate Your Style Today
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join 50,000+ happy customers who&apos;ve discovered the perfect jewelry to complement their unique style
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/shop"
              className="px-10 py-4 bg-[#C78B7B] hover:bg-[#D6B36A] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Shopping
            </Link>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition-all inline-flex items-center justify-center"
            >
              💬 Chat with Us
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/20">
            <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D6B36A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Secure Checkout
            </div>
            <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D6B36A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Returns
            </div>
            <div className="text-white/80 text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D6B36A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3 3 0 01-.369-5.98 5 5 0 119.753 1.025A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
              Lifetime Support
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#F9F7F4] to-[#F4EEE8] border-2 border-[#E8E3DC] p-12 md:p-16 text-center">
            <span className="text-[#C78B7B] text-sm font-bold uppercase tracking-widest">Exclusive</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2E2E2E] mt-4 mb-4">
              VIP Early Access
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-10">
              Get 15% off your first purchase + exclusive access to limited editions before anyone else
            </p>

            <div className="flex gap-3 max-w-md mx-auto mb-6">
              <VipSubscribe />
            </div>

            <p className="text-[#6B6B6B] text-xs">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
