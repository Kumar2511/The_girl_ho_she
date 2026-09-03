"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Star, Quote } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

type Review = {
  _id: string;
  customerName?: string;
  rating: number;
  comment: string;
  createdAt?: string;

  product?: {
    _id?: string;
    name?: string;
  };
};

type Product = {
  _id: string;
  name: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==========================================
  // LOAD APPROVED REVIEWS
  // ==========================================

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);

        const productsResponse = await api.get("/products");

        const products: Product[] =
          productsResponse.data?.products || [];

        const collectedReviews: Review[] = [];

        for (const product of products) {
          if (!product?._id) continue;

          try {
            const response = await api.get(
              `/reviews/product/${product._id}`
            );

            const productReviews =
              response.data?.reviews || [];

            productReviews.forEach(
              (review: Review) => {
                collectedReviews.push({
                  ...review,
                  product: {
                    _id: product._id,
                    name: product.name,
                  },
                });
              }
            );
          } catch (error) {
            console.error(
              `Failed to load reviews for ${product.name}`,
              error
            );
          }
        }

        setReviews(collectedReviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };
  }, [reviews]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return reviews;
    }

    return reviews.filter((review) => {
      return (
        review.customerName?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query) ||
        review.product?.name?.toLowerCase().includes(query)
      );
    });
  }, [reviews, search]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FBF8F4] text-[#3F3732]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[#D9C7BA] border-t-[#9C6B55]" />

            <p className="text-sm text-[#806F64]">
              Loading customer reviews...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF8F4] text-[#3F3732]">
      <Navbar />

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-[#E8DDD5] bg-[#FBF8F4]">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-20">

          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.32em] text-[#B77D64]">
            Customer Stories
          </p>

          <h1 className="font-serif text-4xl font-normal tracking-tight text-[#302821] sm:text-5xl">
            Loved by Our Customers
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#806F64] sm:text-base">
            Discover what our customers have to say about
            their experience with The Girl Who She.
          </p>

        </div>
      </section>

      {/* ==================================================
          RATING SUMMARY
      ================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">

        <div className="rounded-[2px] border border-[#E6DCD4] bg-white p-6 sm:p-9">

          <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">

            {/* Average Rating */}

            <div className="flex flex-col items-center justify-center border-b border-[#E8DDD5] pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-12">

              <span className="font-serif text-5xl font-normal text-[#302821]">
                {averageRating.toFixed(1)}
              </span>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-[#B77D64] text-[#B77D64]"
                  />
                ))}
              </div>

              <p className="mt-3 text-xs text-[#8A776B]">
                Based on {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>

            </div>

            {/* Rating Breakdown */}

            <div className="flex flex-col justify-center gap-3">

              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  ratingCounts[
                    rating as keyof typeof ratingCounts
                  ];

                const percentage =
                  reviews.length > 0
                    ? (count / reviews.length) * 100
                    : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center gap-3"
                  >

                    <div className="flex w-12 items-center gap-1">
                      <span className="text-xs text-[#6F5E53]">
                        {rating}
                      </span>

                      <Star className="h-3 w-3 fill-[#B77D64] text-[#B77D64]" />
                    </div>

                    <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#EEE5DE]">
                      <div
                        className="h-full rounded-full bg-[#C88D73] transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-7 text-right text-[11px] text-[#927F73]">
                      {count}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          REVIEW HEADER
      ================================================== */}

      <section className="mx-auto max-w-6xl px-5 sm:px-8">

        <div className="flex flex-col gap-5 border-b border-[#E8DDD5] pb-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#B77D64]">
              Real Experiences
            </p>

            <h2 className="mt-2 font-serif text-2xl font-normal text-[#302821] sm:text-3xl">
              What They Say
            </h2>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-[260px]">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A887C]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search reviews"
              className="h-10 w-full rounded-none border border-[#DED2C9] bg-white pl-10 pr-4 text-xs text-[#40362F] outline-none placeholder:text-[#AA9990] focus:border-[#B77D64]"
            />

          </div>

        </div>
      </section>

      {/* ==================================================
          REVIEWS
      ================================================== */}

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10">

        {filteredReviews.length === 0 ? (

          <div className="border border-[#E6DCD4] bg-white px-6 py-20 text-center">

            <MessageEmpty />

            <h3 className="mt-5 font-serif text-xl text-[#302821]">
              No reviews found
            </h3>

            <p className="mt-2 text-sm text-[#8A776B]">
              Customer reviews will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredReviews.map((review) => (

              <article
                key={review._id}
                className="group flex min-h-[270px] flex-col border border-[#E5DAD2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(80,55,40,0.07)]"
              >

                {/* Top */}

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E5DD] font-serif text-sm text-[#765648]">
                      {(review.customerName || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="text-sm font-medium text-[#40362F]">
                        {review.customerName || "Customer"}
                      </p>

                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#A18D81]">
                        Verified Customer
                      </p>

                    </div>

                  </div>

                  <Quote className="h-5 w-5 text-[#D9C5B8]" />

                </div>

                {/* Stars */}

                <div className="mt-5 flex gap-0.5">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={
                        star <= review.rating
                          ? "h-3.5 w-3.5 fill-[#B77D64] text-[#B77D64]"
                          : "h-3.5 w-3.5 text-[#D8CBC2]"
                      }
                    />
                  ))}

                </div>

                {/* Comment */}

                <p className="mt-4 flex-1 text-sm leading-6 text-[#6F5E53]">
                  “{review.comment}”
                </p>

                {/* Product */}

                {review.product?.name && (
                  <div className="mt-5 border-t border-[#EEE5DE] pt-4">

                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#A18D81]">
                      Reviewed Product
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#4B3D35]">
                      {review.product.name}
                    </p>

                  </div>
                )}

                {/* Date */}

                {review.createdAt && (
                  <p className="mt-3 text-[10px] text-[#A18D81]">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

              </article>

            ))}

          </div>

        )}

      </section>

      <Footer />
    </main>
  );
}

/* ======================================================
   EMPTY STATE ICON
====================================================== */

function MessageEmpty() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E5DD]">
      <Quote className="h-5 w-5 text-[#B77D64]" />
    </div>
  );
}