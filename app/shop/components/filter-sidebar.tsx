"use client";

interface Category {
  name: string;
  icon: string;
}

interface FilterSidebarProps {
  categories?: Category[];
  selectedCategory?: string;
  setCategory?: (category: string) => void;

  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;

  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
}

export default function FilterSidebar({
  categories = [],
  selectedCategory = "All Products",
  setCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
}: FilterSidebarProps) {
  const MAX_PRICE = 100000;

  const minPercent =
    (minPrice / MAX_PRICE) * 100;

  const maxPercent =
    (maxPrice / MAX_PRICE) * 100;

  return (
    <div className="w-full">

      {/* =====================================
          CATEGORY FILTERS
      ====================================== */}

      {categories.length > 0 && (
        <div className="mb-6">

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

            {categories.map((cat) => {
              const active =
                selectedCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() =>
                    setCategory?.(cat.name)
                  }
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    active
                      ? "border-[#2E2024] bg-[#2E2024] text-white"
                      : "border-[#E5DDD8] bg-white text-[#555] hover:border-[#C78B7B] hover:text-[#C78B7B]"
                  }`}
                >
                  <span>
                    {cat.icon}
                  </span>

                  <span>
                    {cat.name ===
                    "All Products"
                      ? "All"
                      : cat.name}
                  </span>
                </button>
              );
            })}

          </div>

        </div>
      )}

      {/* =====================================
          PRICE + STOCK
      ====================================== */}

      <div className="border-y border-[#E7DFDA] bg-[#FCFAF8] px-5 py-5">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">

          {/* =================================
              PRICE RANGE
          ================================== */}

          <div className="min-w-0 flex-1">

            <div className="mb-3 flex items-center justify-between">

              <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#555]">
                Price Range
              </h3>

              <span className="text-xs text-[#777]">
                ₹
                {minPrice.toLocaleString(
                  "en-IN"
                )}
                {" - "}
                ₹
                {maxPrice.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Slider */}

            <div className="relative h-6">

              {/* Background track */}

              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#E6DDD8]" />

              {/* Active track */}

              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#8D4E67]"
                style={{
                  left: `${minPercent}%`,
                  right: `${
                    100 - maxPercent
                  }%`,
                }}
              />

              {/* Minimum slider */}

              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={100}
                value={minPrice}
                onChange={(e) => {
                  const value =
                    Number(
                      e.target.value
                    );

                  if (
                    value <= maxPrice
                  ) {
                    setMinPrice(value);
                  }
                }}
                aria-label="Minimum price"
                className="pointer-events-none absolute inset-0 z-20 h-6 w-full appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:bg-[#8D4E67]
                [&::-webkit-slider-thumb]:shadow-md
                [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:bg-[#8D4E67]"
              />

              {/* Maximum slider */}

              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={100}
                value={maxPrice}
                onChange={(e) => {
                  const value =
                    Number(
                      e.target.value
                    );

                  if (
                    value >= minPrice
                  ) {
                    setMaxPrice(value);
                  }
                }}
                aria-label="Maximum price"
                className="pointer-events-none absolute inset-0 z-10 h-6 w-full appearance-none bg-transparent
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:bg-[#C78B7B]
                [&::-webkit-slider-thumb]:shadow-md
                [&::-moz-range-thumb]:pointer-events-auto
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:bg-[#C78B7B]"
              />

            </div>

            {/* Range labels */}

            <div className="mt-1 flex justify-between text-[9px] text-[#888]">

              <span>
                ₹0
              </span>

              <span>
                ₹
                {MAX_PRICE.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

          {/* =================================
              AVAILABILITY
          ================================== */}

          <div className="flex shrink-0 items-center border-t border-[#E5DDD8] pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

            <label className="flex cursor-pointer items-center gap-2.5">

              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) =>
                  setInStockOnly(
                    e.target.checked
                  )
                }
                className="h-4 w-4 cursor-pointer accent-[#8D4E67]"
              />

              <span className="text-xs text-[#555]">
                In Stock Only
              </span>

            </label>

          </div>

        </div>

      </div>

    </div>
  );
}