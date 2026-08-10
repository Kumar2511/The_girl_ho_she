export interface LoadingSkeletonProps {
  count?: number
  className?: string
}

export function LoadingSkeleton({ count = 8, className = "" }: LoadingSkeletonProps) {
  return (
    <section
      aria-label="Loading products"
      aria-busy="true"
      className={`grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-4 motion-reduce:animate-none"
          style={{ animationDelay: `${Math.min(index * 75, 600)}ms` }}
          aria-hidden="true"
        >
          <div className="aspect-[4/5] rounded-[28px] border border-[#D6B36A]/10 bg-white shadow-[0_14px_40px_rgba(46,46,46,0.05)]">
            <div className="size-full rounded-[28px] bg-[#D6B36A]/10" />
          </div>
          <div className="flex flex-col gap-3 px-1">
            <div className="h-3 w-2/5 rounded-full bg-[#C78B7B]/15" />
            <div className="h-4 w-4/5 rounded-full bg-[#2E2E2E]/10" />
            <div className="h-4 w-1/4 rounded-full bg-[#D6B36A]/20" />
          </div>
        </div>
      ))}
    </section>
  )
}

export default LoadingSkeleton
