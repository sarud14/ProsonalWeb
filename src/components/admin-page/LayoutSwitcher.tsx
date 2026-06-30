'use client'

import type { AdminLayoutMode } from '@/types/admin-page.types'

import { cn } from '@/lib/utils'

interface LayoutSwitcherProps {
  readonly layout: AdminLayoutMode
  readonly onChange: (mode: AdminLayoutMode) => void
}

const MODES: readonly { readonly mode: AdminLayoutMode; readonly label: string }[] = [
  { mode: 'masthead', label: 'Bar' },
  { mode: 'sidebar', label: 'Side' },
  { mode: 'split', label: 'Split' },
]

export function LayoutSwitcher({ layout, onChange }: LayoutSwitcherProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
        Layout
      </span>
      <div className="flex overflow-hidden rounded-[7px] border border-border">
        {MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            title={mode}
            onClick={() => onChange(mode)}
            className={cn(
              'cursor-pointer border-none px-[11px] py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]',
              layout === mode
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
