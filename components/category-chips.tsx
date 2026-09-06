'use client'

import { useState } from 'react'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'

export function CategoryChips() {
  const [active, setActive] = useState('All')

  return (
    <div className="border-y border-border bg-background/80 backdrop-blur-sm">
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              active === c
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
