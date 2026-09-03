import './globals.css'

export const metadata = {
  title: 'BookMyMetal — Discover Metal. Watch. Compare. Buy.',
  description: 'A video-first marketplace for metal products and services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
