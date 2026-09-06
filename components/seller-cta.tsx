import { ArrowRight, Video } from 'lucide-react'

export function SellerCta() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-border bg-foreground px-6 py-10 text-background sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs font-medium text-background">
              <Video className="h-3.5 w-3.5" />
              For suppliers
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Turn your catalog into reels that sell
            </h2>
            <p className="mt-3 max-w-lg text-pretty text-sm text-background/70 sm:text-base">
              List your products and services as short videos, reach verified
              buyers worldwide, and manage quotes from one dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://www.bookmymetal.com/seller/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                Start selling
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="https://www.bookmymetal.com/rfq/" className="rounded-full border border-background/30 px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-background/10">
                Learn more
              </a>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          />
        </div>
      </div>
    </section>
  )
}
