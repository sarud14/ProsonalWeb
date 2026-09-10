import { LandingReveal } from '@/features/landing/LandingReveal'
import { Container } from '@/components/ui'
import {
  CONTACT_DEFAULT_BODY,
  CONTACT_DEFAULT_HEADLINE,
} from '@/constants/contact'
import { LANDING_MOTION_STATS_BASE_DELAY_MS } from '@/constants/landing-motion'
import type { LandingContactSectionProps } from '@/types/landing.types'

export default function ContactSection({
  headline = CONTACT_DEFAULT_HEADLINE,
  body = CONTACT_DEFAULT_BODY,
  form,
}: LandingContactSectionProps): React.JSX.Element {
  return (
    <section className="border-y border-border">
      <Container className="max-w-[1240px] px-7 py-14 md:py-16">
        <LandingReveal delay={LANDING_MOTION_STATS_BASE_DELAY_MS}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Contact
              </p>
              <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                {headline}
              </h2>
              <p className="mt-4 max-w-[420px] text-base leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
            {form}
          </div>
        </LandingReveal>
      </Container>
    </section>
  )
}
