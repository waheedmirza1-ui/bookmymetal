import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'BookMyMetal — Video-first B2B Marketplace',
  description:
    'Discover, compare and source products and services across every industry through short supplier videos. Machinery, furniture, agriculture, electronics, construction, healthcare, logistics, energy, textiles and more.',
  keywords: [
    'B2B marketplace',
    'video sourcing',
    'RFQ',
    'suppliers',
    'machinery',
    'industrial products',
  ],
}

export const viewport: Viewport = {
  themeColor: '#0b84f3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
