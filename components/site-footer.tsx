import { Video } from 'lucide-react'

const columns = [
  {
    title: 'Marketplace',
    links: ['Explore reels', 'Categories', 'Verified suppliers', 'RFQ center'],
  },
  {
    title: 'For suppliers',
    links: ['Post a reel', 'Seller dashboard', 'Verification', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Trust & safety', 'Contact'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Video className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold">BookMyMetal</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The video-first B2B marketplace connecting buyers and verified
              suppliers across every industry.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BookMyMetal. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
