import Link from 'next/link'

import {
  getSiteContact,
  getSiteFooter,
  getSiteSocialLinks,
} from '@/lib/content/site-config'

export async function Footer(): Promise<React.JSX.Element> {
  const [footer, contact, socialLinks] = await Promise.all([
    getSiteFooter(),
    getSiteContact(),
    getSiteSocialLinks(),
  ])
  const year = new Date().getFullYear()
  const email = contact.email.trim()
  const location = contact.location.trim()

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

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-7 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
            <Link
              href="/contact"
              className="text-secondary-foreground no-underline transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            {email.length > 0 ? (
              <a
                href={`mailto:${email}`}
                className="text-secondary-foreground no-underline transition-colors hover:text-foreground"
              >
                {email}
              </a>
            ) : null}
            {location.length > 0 ? <span>{location}</span> : null}
          </div>

          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.06em] uppercase">
              {socialLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
