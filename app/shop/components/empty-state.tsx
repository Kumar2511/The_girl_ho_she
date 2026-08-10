"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center border border-dashed border-gray-300 bg-white px-6 text-center">

      <div className="mb-6 rounded-full bg-[#F8F3F0] p-6">

        <SearchX
          size={48}
          className="text-[#C78B7B]"
        />

      </div>

      <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#C78B7B]">
        No Results
      </p>

      <h2 className="text-3xl font-semibold text-[#222]">
        No Products Found
      </h2>

      <p className="mt-4 max-w-md text-gray-500 leading-7">
        We couldn't find any products matching your
        filters. Try changing your category, search,
        or price range.
      </p>

      <Link
        href="/shop"
        className="mt-8 border border-[#C78B7B] px-8 py-3 text-sm font-medium text-[#C78B7B] transition hover:bg-[#C78B7B] hover:text-white"
      >
        View All Products
      </Link>

    </div>
  );
}