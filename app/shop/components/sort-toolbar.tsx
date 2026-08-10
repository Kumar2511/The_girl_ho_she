"use client";

import { ChevronDown, Filter } from "lucide-react";

interface SortToolbarProps {
  totalProducts: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

export default function SortToolbar({
  totalProducts,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}: SortToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">

      {/* Left */}

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#C78B7B]">
          Jewellery Collection
        </p>

        <h2 className="mt-2 text-3xl font-semibold text-[#222]">
          Shop Products
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-[#222]">
            {totalProducts}
          </span>{" "}
          Products
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border border-gray-300 px-4 py-3 text-sm font-medium transition hover:border-[#C78B7B] hover:text-[#C78B7B] lg:hidden"
        >
          <Filter size={18} />
          Filters
        </button>

        <div className="relative">

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="appearance-none border border-gray-300 bg-white px-5 py-3 pr-10 text-sm font-medium outline-none transition focus:border-[#C78B7B]"
          >
            <option value="newest">
              Newest First
            </option>

            <option value="price-low">
              Price : Low to High
            </option>

            <option value="price-high">
              Price : High to Low
            </option>

          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

        </div>

      </div>

    </div>
  );
}