'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Listing } from '@/lib/data'
import { ReelCard } from './reel-card'

export function ReelRow({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle?: string
  items: Listing[]
}) {
  const railRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 560, behavior: 'smooth' })
  }

  return (
    <section className="py-7">
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-8"
      >
        {items.map((item) => (
          <ReelCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
