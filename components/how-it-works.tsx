import { Search, PlayCircle, FileCheck2, Handshake } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Describe your need',
    body: 'Use AI search to find products or services in plain language across 120+ industries.',
  },
  {
    icon: PlayCircle,
    title: 'Watch the reels',
    body: 'See specs, scale and quality in short supplier videos before you ever message.',
  },
  {
    icon: FileCheck2,
    title: 'Request a quote',
    body: 'Send an RFQ to verified suppliers and compare responses side by side.',
  },
  {
    icon: Handshake,
    title: 'Order with assurance',
    body: 'Transact through trade-assured payments with milestone protection.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Sourcing, reimagined around video
          </h2>
          <p className="mt-2 text-pretty text-muted-foreground">
            From discovery to deal in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
