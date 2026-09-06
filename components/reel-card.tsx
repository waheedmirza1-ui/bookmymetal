'use client'

import { Play, BadgeCheck, MapPin, Eye } from 'lucide-react'
import type { Listing } from '@/lib/data'
import { cn, publicAsset } from '@/lib/utils'

export function ReelCard({ item }: { item: Listing }) {
  return (
    <article className="group relative w-[240px] shrink-0 sm:w-[264px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.poster || publicAsset('/placeholder.svg')}
          alt={`${item.name} by ${item.supplier}`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2340]/85 via-transparent to-[#0f2340]/20" />

        {/* top row: type + duration */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm',
              item.type === 'service'
                ? 'bg-background/85 text-foreground'
                : 'bg-primary/90 text-primary-foreground',
            )}
          >
            {item.type === 'service' ? 'Service' : 'Product'}
          </span>
          <span className="rounded-full bg-[#0f2340]/70 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
            {item.duration}
          </span>
        </div>

        {/* center play affordance */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </div>

        {/* bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className="mb-1 flex items-center gap-1 text-[11px] text-white/80">
            <Eye className="h-3 w-3" />
            {item.views} views
          </div>
          <h3 className="text-sm font-semibold leading-snug text-balance">
            {item.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-[12px] text-white/85">
            <span className="truncate">{item.supplier}</span>
            {item.verified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            )}
          </div>
        </div>
      </div>

      {/* meta below card */}
      <div className="px-1 pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {item.price}
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {item.location}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
          {item.spec}
        </p>
      </div>
    </article>
  )
}
