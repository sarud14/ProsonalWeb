import Link from 'next/link'

import { ContactForm } from '@/features/contact/ContactForm'
import { Container } from '@/components/ui'
import type { ContactPageViewProps } from '@/types/contact.types'

export function ContactPageView({
  email,
  location,
}: ContactPageViewProps): React.JSX.Element {
  const hasSidebar = email.trim().length > 0 || location.trim().length > 0

  return (
    <Container className="max-w-[1240px] px-7">
      <section className="border-b border-border pb-11 pt-[70px]">
        <div className="mb-[22px] flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
            /contact
          </span>
          <span className="h-px flex-1 bg-white/10" aria-hidden />
        </div>

        <h1 className="text-[clamp(2.125rem,4.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Contact
        </h1>
        <p className="mt-[22px] max-w-[660px] text-lg leading-relaxed text-muted-foreground">
          Send a message through the form — it lands in the site inbox. Prefer
          email? Use the address below.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-10 border border-border border-t-0 py-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] md:gap-12 md:px-0">
        <div className="px-0 md:px-8">
          <ContactForm />
        </div>

        {hasSidebar ? (
          <aside className="flex flex-col gap-5 border-t border-border px-0 pt-8 md:border-l md:border-t-0 md:px-8 md:pt-0">
            <div>
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
                Direct
              </p>
              {email.trim().length > 0 ? (
                <a
                  href={`mailto:${email.trim()}`}
                  className="mt-2 block text-base text-foreground no-underline transition-colors hover:text-primary"
                >
                  {email.trim()}
                </a>
              ) : null}
              {location.trim().length > 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{location.trim()}</p>
              ) : null}
            </div>
            <Link
              href="/"
              className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground"
            >
              ← Back home
            </Link>
          </aside>
        ) : null}
      </section>
    </Container>
  )
}
