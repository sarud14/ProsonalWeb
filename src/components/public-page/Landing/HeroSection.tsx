import { LANDING_FOCUS_ITEMS } from '@/constants/landing'
import { LandingReveal } from "@/components/public-page/Landing/LandingReveal";
import { CodeTypingBlock } from "@/components/public-page/Landing/CodeTypingBlock";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from '@/components/ui/Button'
import {
  LANDING_MOTION_HERO_BODY_DELAY_MS,
  LANDING_MOTION_HERO_CARD_DELAY_MS,
  LANDING_MOTION_HERO_CODE_DELAY_MS,
  LANDING_MOTION_HERO_CTA_DELAY_MS,
  LANDING_MOTION_HERO_EYEBROW_DELAY_MS,
  LANDING_MOTION_HERO_META_DELAY_MS,
  LANDING_MOTION_HERO_TITLE_DELAY_MS,
  LANDING_MOTION_STAGGER_MS,
} from "@/constants/landing-motion";
import Link from "next/link";

export default function HeroSection(): React.JSX.Element {
  return (
    <section className="pt-[88px] pb-[72px]">
      <Container className="grid max-w-[1240px] grid-cols-1 items-center gap-12 px-7 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_EYEBROW_DELAY_MS}
            variant="fade-in"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                <span className="text-primary">{"//"}</span> Engineering System
              </span>
              <LandingReveal
                trigger="mount"
                delay={LANDING_MOTION_HERO_EYEBROW_DELAY_MS + 200}
                variant="line-grow"
                className="flex-1"
              >
                <span className="block h-px w-full bg-border" />
              </LandingReveal>
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                v1.0
              </span>
            </div>
          </LandingReveal>

          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_TITLE_DELAY_MS}
          >
            <h1 className="text-[clamp(2.5rem,5.6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
              Building scalable
              <br />
              digital products,
              <br />
              <span className="text-muted-foreground">framed as systems.</span>
            </h1>
          </LandingReveal>

          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_BODY_DELAY_MS}
          >
            <p className="mt-7 max-w-[520px] text-[16.5px] leading-[1.65] text-muted-foreground">
              Frontend engineer working in{" "}
              <span className="text-foreground">Next.js</span>,{" "}
              <span className="text-foreground">TypeScript</span>, and
              AI-assisted workflows. Focused on CMS platforms, booking systems,
              multilingual applications, and frontend architecture.
            </p>
          </LandingReveal>

          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_CTA_DELAY_MS}
          >
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                render={<Link href="/work" />}
                nativeButton={false}
                size="lg"
                className="h-auto gap-2.5 rounded-none px-[22px] py-[13px] text-[13.5px] font-semibold tracking-[0.01em] transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                View the work
                <span className="font-mono">→</span>
              </Button>
              <Button
                render={<Link href="#modules" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="h-auto rounded-none border-white/16 px-[22px] py-[13px] text-[13.5px] font-medium hover:border-white/34 hover:bg-white/[0.03]"
              >
                Browse the system
              </Button>
            </div>
          </LandingReveal>

          <div className="mt-11 flex flex-wrap gap-7">
            {LANDING_FOCUS_ITEMS.map((item, index) => (
              <LandingReveal
                key={item.label}
                trigger="mount"
                delay={
                  LANDING_MOTION_HERO_META_DELAY_MS +
                  index * LANDING_MOTION_STAGGER_MS
                }
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {item.label}
                  </span>
                  <span className="text-[13.5px] text-secondary-foreground">
                    {item.value}
                  </span>
                </div>
              </LandingReveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_CARD_DELAY_MS}
            variant="fade-right"
          >
            <Card className="relative rounded-none p-[13px]">
              <span className="absolute top-[7px] left-[7px] z-10 block size-[9px] border-t border-l border-primary" />
              <span className="absolute right-[7px] bottom-[7px] z-10 block size-[9px] border-r border-b border-primary" />
              <div className="flex h-[320px] w-full items-center justify-center bg-background/40">
                <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs">Drop a profile photo</span>
                </div>
              </div>
              <div className="mt-[13px] flex items-center justify-between">
                <div className="flex flex-col gap-[3px]">
                  <p className="text-sm font-semibold tracking-[-0.01em]">
                    Sarut Dumrongprechachan
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    FE-Eng · AU / Remote
                  </p>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.1em] text-success uppercase">
                  <span className="size-1.5 rounded-full bg-success" />
                  Open
                </span>
              </div>
            </Card>
          </LandingReveal>

          <LandingReveal
            trigger="mount"
            delay={LANDING_MOTION_HERO_CODE_DELAY_MS}
            variant="fade-right"
          >
            <CodeTypingBlock />
          </LandingReveal>
        </div>
      </Container>
    </section>
  );
}
