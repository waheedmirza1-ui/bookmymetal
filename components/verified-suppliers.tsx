import { BadgeCheck, MapPin, Star, Video } from 'lucide-react'
import { verifiedSuppliers } from '@/lib/data'

export function VerifiedSuppliers() {
  return (
    <section id="suppliers" className="border-y border-border bg-muted/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Verified suppliers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Vetted businesses with active video catalogs.
            </p>
          </div>
          <a
            href="#"
            className="hidden text-sm font-semibold text-primary hover:underline sm:block"
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedSuppliers.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.poster || '/placeholder.svg'}
                  alt={s.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {s.location} · {s.industry}
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    {s.rating}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {s.reels} reels
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
