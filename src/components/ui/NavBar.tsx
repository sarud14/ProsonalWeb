import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NavBarLink } from '@/components/ui/NavBarLink'

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
        'sticky top-0 z-50 flex items-center justify-between gap-6 border-b border-border bg-background/75 px-7 py-3.5 backdrop-blur-[14px]',
        className
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="grid size-[30px] place-items-center border border-primary font-mono text-xs font-semibold tracking-[0.02em]">
          SD
        </div>
        <div className="leading-[1.15]">
          <p className="text-[13.5px] font-semibold tracking-[-0.01em]">
            Sarut Dumrongprechachan
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Frontend Engineer
          </p>
        </div>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <NavBarLink key={item.href} href={item.href} label={item.label} />
        ))}
        <span className="mx-2 h-[18px] w-px bg-white/12" />
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Available
        </span>
      </nav>
    </header>
  )
}
