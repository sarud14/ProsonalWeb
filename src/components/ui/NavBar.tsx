import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Engineering', href: '/engineering' },
  { label: 'Journal', href: '/journal' },
  { label: 'Focus', href: '/focus' },
  { label: 'Stack', href: '/stack' },
  { label: 'Resume', href: '/resume' },
] as const

export function NavBar({ className }: { className?: string }): React.JSX.Element {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur-md',
        className
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded border border-primary font-mono text-xs font-bold text-primary">
          SD
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Sarut Dumrongprechachan</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Frontend Engineer
          </p>
        </div>
      </Link>

      <nav className="flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em]">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="text-success">Available</span>
        </span>
      </nav>
    </header>
  )
}
