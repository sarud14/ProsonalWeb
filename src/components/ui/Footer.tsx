import { getSiteFooter } from '@/lib/content/site-config'

export async function Footer(): Promise<React.JSX.Element> {
  const footer = await getSiteFooter()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3.5 px-7 py-[22px] font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        <span>
          &copy; {year} {footer.copyrightName}
        </span>
        <span className="text-muted-foreground/80">{footer.tagline}</span>
        <span className="flex items-center gap-2">
          {footer.buildLabel}
          <span className="size-1.5 rounded-full bg-success" />
        </span>
      </div>
    </footer>
  )
}
