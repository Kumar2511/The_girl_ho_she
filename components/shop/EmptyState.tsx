"use client"

import { SearchX, RotateCcw } from "lucide-react"

export interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title = "Your collection awaits",
  description = "We could not find pieces matching those selections. Try adjusting your filters.",
  actionLabel = "Clear filters",
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <section
      className={`flex min-h-[360px] items-center justify-center rounded-[28px] border border-[#D6B36A]/15 bg-[#FCFAF7] px-6 py-16 text-center shadow-[0_18px_55px_rgba(46,46,46,0.05)] ${className}`}
      aria-label={title}
    >
      <div className="flex max-w-md flex-col items-center gap-5">
        <span className="flex size-16 items-center justify-center rounded-full border border-[#C78B7B]/25 bg-white text-[#C78B7B] shadow-[0_10px_30px_rgba(199,139,123,0.12)]">
          <SearchX aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl text-[#2E2E2E]">{title}</h2>
          <p className="text-sm leading-6 text-[#2E2E2E]/60">{description}</p>
        </div>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-full border border-[#D6B36A]/60 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2E2E2E] transition-colors hover:border-[#C78B7B] hover:bg-[#C78B7B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B]"
          >
            <RotateCcw aria-hidden="true" />
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  )
}

export default EmptyState
