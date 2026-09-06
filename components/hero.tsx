import { PlayCircle, ShieldCheck, Building2 } from 'lucide-react'
import { AiSearch } from './ai-search'

const stats = [
  { value: '82,000+', label: 'Video reels' },
  { value: '14,500', label: 'Verified suppliers' },
  { value: '120+', label: 'Industries' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <PlayCircle className="h-3.5 w-3.5 text-primary" />
            The video-first B2B marketplace
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Source anything.
            <br />
            <span className="text-primary">See it before you buy.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Discover products and services across every industry through short
            supplier videos. Compare, verify and request quotes — all from the
            reel.
          </p>

          <div className="mt-8">
            <AiSearch />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-semibold tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              Verified suppliers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-primary" />
              Trade-assured payments
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
