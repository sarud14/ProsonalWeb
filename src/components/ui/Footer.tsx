export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        <span>&copy; 2026 Sarut Dumrongprechachan</span>
        <span>Designed as a system, not a page</span>
        <span className="flex items-center gap-1.5">
          Build 2026.06 &middot; All systems nominal
          <span className="size-1.5 rounded-full bg-success" />
        </span>
      </div>
    </footer>
  )
}
