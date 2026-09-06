'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Video, PlusCircle } from 'lucide-react'
import { AiSearch } from './ai-search'

const navLinks = [
  { label: 'Explore', href: '#trending' },
  { label: 'Categories', href: '#categories' },
  { label: 'Suppliers', href: '#suppliers' },
  { label: 'How it works', href: '#how' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Video className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            BookMyMetal
          </span>
        </a>

        <nav className="ml-4 hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden max-w-md flex-1 md:block">
          <AiSearch compact />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a href="https://www.bookmymetal.com/seller/" className="hidden items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex">
            <PlusCircle className="h-4 w-4" />
            Post a reel
          </a>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/account?mode=login" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Sign in</Link>
            <Link href="/account" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Sign up</Link>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <a href="https://www.bookmymetal.com/seller/" className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium">
                Post a reel
              </a>
              <Link href="/account" className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                Sign in / Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
