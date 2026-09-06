'use client'

import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const suggestions = [
  'CNC machining under $150k',
  'Verified solar panel suppliers in EU',
  'BIFMA office chairs, 500 units',
  'Turnkey plant engineering services',
]

export function AiSearch({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState('')
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = value.trim()
    if (query) window.location.assign(`https://www.bookmymetal.com/search/?q=${encodeURIComponent(query)}`)
  }

  if (compact) {
    return (
      <form
        onSubmit={submitSearch}
        className="relative flex items-center"
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe what you need to source…"
          className="h-10 w-full rounded-full border border-input bg-muted pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background"
        />
      </form>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={submitSearch}
        className="relative flex items-center rounded-2xl border border-border bg-background p-2 shadow-sm ring-1 ring-transparent focus-within:ring-ring"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask AI: “Find verified 180HP tractors with GPS steering”"
          className="h-11 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Try:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setValue(s)}
            className={cn(
              'rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors',
              'hover:border-primary hover:text-primary',
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
