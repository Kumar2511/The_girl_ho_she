"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page)
  }

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Product pages">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex size-10 items-center justify-center rounded-full border border-[#D6B36A]/35 bg-white text-[#2E2E2E] transition-colors hover:border-[#C78B7B] hover:text-[#C78B7B] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B]"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2" role="list">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex size-10 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B] ${page === currentPage ? "bg-[#C78B7B] font-semibold text-white shadow-[0_8px_22px_rgba(199,139,123,0.25)]" : "border border-[#D6B36A]/35 bg-white text-[#2E2E2E] hover:border-[#C78B7B] hover:text-[#C78B7B]"}`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex size-10 items-center justify-center rounded-full border border-[#D6B36A]/35 bg-white text-[#2E2E2E] transition-colors hover:border-[#C78B7B] hover:text-[#C78B7B] disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B]"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
