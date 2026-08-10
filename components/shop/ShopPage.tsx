'use client'

import type { ComponentType } from 'react'

import { FilterSidebar, type FilterSidebarProps } from "@/components/shop/FilterSidebar";
import FindProductButton from "@/components/shop/FindProductButton";
import { Pagination, type PaginationProps } from "@/components/shop/Pagination";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopHero } from "@/components/shop/ShopHero";

export type ShopPageProps<TProduct = unknown> = {
  products?: TProduct[]
  ProductCard: ComponentType<{ product: TProduct }>
  filterProps: FilterSidebarProps
  paginationProps: PaginationProps
  isLoading?: boolean
  className?: string
  productGridClassName?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function ShopPage<TProduct = unknown>({
  products = [],
  ProductCard,
  filterProps,
  paginationProps,
  isLoading = false,
  className = '',
  productGridClassName = '',
  emptyTitle,
  emptyDescription,
}: ShopPageProps<TProduct>) {
  return (
  <div
    className={`min-h-screen bg-[#FCFAF7] text-[#2E2E2E] ${className}`}
  >
    <FindProductButton />

    <main
      id="shop"
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <FilterSidebar {...filterProps} />

        <section
          className="flex min-w-0 flex-col gap-12"
          aria-label="Shop collection"
        >
          <ProductGrid
            products={products}
            isLoading={isLoading}
            className={productGridClassName}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />

          <Pagination {...paginationProps} />
        </section>
      </div>
    </main>
  </div>
)
}
export default ShopPage
