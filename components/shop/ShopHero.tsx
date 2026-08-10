'use client'

import { ArrowRight, ChevronRight, Gem, Sparkles } from 'lucide-react'

export function ShopHero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#FCFAF7] text-[#2E2E2E]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full bg-[#C78B7B]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-[#D6B36A]/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-28 sm:px-10 lg:px-16">
        <div className="max-w-3xl animate-fade-up">
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-[#2E2E2E]">
            <link className="transition-colors hover:text-[#C78B7B]" href="/home">Home</link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-[#C78B7B]" />
            <span className="text-[#C78B7B]">Shop</span>
          </nav>

          <div className="mb-8 flex items-center gap-3 text-[#C78B7B]">
            <span className="h-px w-12 bg-[#C78B7B]" />
            <span className="text-xs font-semibold uppercase tracking-[0.32em]">The Mahalakshmi Edit</span>
          </div>

          <h1 className="max-w-2xl font-serif text-6xl leading-[0.98] tracking-[-0.045em] text-[#2E2E2E] sm:text-7xl lg:text-8xl">
            Shop <span className="italic text-[#C78B7B]">Collection</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-[#2E2E2E] sm:text-lg">
            Discover timeless pieces designed to hold their glow. Each jewel is a quiet celebration of craft, elegance, and the moments that become yours forever.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background transition-all duration-300 hover:-translate-y-1 hover:bg-[#C78B7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              Shop Now
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </link>
            <link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6B36A]/70 px-7 py-4 text-sm font-semibold text-[#2E2E2E] transition-all duration-300 hover:-translate-y-1 hover:border-[#C78B7B] hover:text-[#C78B7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C78B7B] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              Explore Collections
            </link>
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-12 right-8 hidden h-72 w-72 lg:block">
          <div className="absolute inset-8 rounded-full border border-[#D6B36A]/50" />
          <div className="absolute inset-16 rounded-full border border-[#C78B7B]/35" />
          <div className="absolute right-3 top-3 text-[#D6B36A]">
            <Sparkles className="h-8 w-8 stroke-[1.1]" />
          </div>
          <div className="absolute bottom-10 left-10 flex h-28 w-28 rotate-12 items-center justify-center rounded-full border border-[#C78B7B]/50 bg-[#FCFAF7]/40 backdrop-blur-sm">
            <Gem className="h-12 w-12 text-[#C78B7B] stroke-[1.1]" />
          </div>
          <span className="absolute bottom-4 right-12 h-2 w-2 rounded-full bg-[#D6B36A] shadow-[0_0_18px_#D6B36A]" />
          <span className="absolute left-4 top-24 h-1.5 w-1.5 rounded-full bg-[#C78B7B] shadow-[0_0_14px_#C78B7B]" />
        </div>

        <div aria-hidden="true" className="absolute bottom-8 left-6 flex items-center gap-3 text-muted-foreground/70 lg:left-16">
          <span className="h-8 w-px bg-[#D6B36A]" />
          <span className="text-[10px] uppercase tracking-[0.28em]">Curated with intention</span>
        </div>
      </div>
    </section>
  )
}
