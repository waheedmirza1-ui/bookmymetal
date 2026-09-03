import './globals.css'

export const metadata = {
  title: 'BookMyMetal | Video-First B2B Metal Marketplace — Investors & Early Sellers',
  description: 'BookMyMetal is building a video-first B2B metal marketplace. Watch the investor pitch, explore the opportunity and join as an early seller, strategic partner or investor.',
  keywords: ['BookMyMetal', 'metal marketplace', 'B2B metal marketplace', 'steel marketplace', 'metal suppliers India', 'invest in BookMyMetal', 'early seller'],
  openGraph: {
    title: 'BookMyMetal — Building the Future of Metal Commerce',
    description: 'Watch the BookMyMetal investor pitch and join the journey as an early seller, partner or investor.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
