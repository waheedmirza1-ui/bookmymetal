import { popularCategories } from '@/lib/data'

export function PopularCategories() {
  return (
    <section id="categories" className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Browse by industry
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore reels across the sectors we serve.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popularCategories.map((c) => (
            <a
              key={c.name}
              href="#trending"
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.poster || '/placeholder.svg'}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2340]/80 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-[11px] text-white/80">{c.count}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
