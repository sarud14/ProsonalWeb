export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3.5 px-7 py-[22px] font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        <span>&copy; 2026 Sarut Dumrongprechachan</span>
        <span className="text-muted-foreground/80">Designed as a system, not a page</span>
        <span className="flex items-center gap-2">
          Build 2026.06 &middot; All systems nominal
          <span className="size-1.5 rounded-full bg-success" />
        </span>
      </div>
    </footer>
  )
}
