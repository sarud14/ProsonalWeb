import { LANDING_MODULES } from '@/constants/landing'
import { LandingReveal } from "@/components/public-page/Landing/LandingReveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  LANDING_MOTION_MODULES_HEADER_DELAY_MS,
  LANDING_MOTION_MODULES_ITEM_BASE_DELAY_MS,
} from "@/constants/landing-motion";
import Link from "next/link";

const MODULE_CELL_CLASS =
  "flex flex-col gap-3.5 border-b border-white/[0.07] max-md:last:border-b-0 md:border-r md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+2)]:border-b lg:[&:nth-last-child(-n+3)]:border-b-0";

export default function ModulesSection(): React.JSX.Element {
  return (
    <section id="modules" className="pt-20 pb-10">
      <Container className="max-w-[1240px] px-7">
        <LandingReveal delay={LANDING_MOTION_MODULES_HEADER_DELAY_MS}>
          <SectionHeader
            number="02"
            title="System modules"
            trailing="Entry points — 06"
          />
        </LandingReveal>
        <div className="grid grid-cols-1 border border-white/[0.09] md:grid-cols-2 lg:grid-cols-3">
          {LANDING_MODULES.map((mod, index) => (
            <LandingReveal
              key={mod.num}
              className={MODULE_CELL_CLASS}
              delay={
                LANDING_MOTION_MODULES_ITEM_BASE_DELAY_MS +
                index * LANDING_MOTION_MODULES_ITEM_BASE_DELAY_MS
              }
              variant="fade-in"
            >
              <Link
                href={mod.link}
                className="flex flex-col gap-3.5 p-[26px_24px_24px] transition-colors hover:bg-white/[0.025]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
                    {mod.num}
                  </span>
                  {mod.badge && (
                    <span className="bg-success px-[7px] py-0.5 font-mono text-[9.5px] tracking-[0.12em] text-background uppercase">
                      {mod.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[7px]">
                  <span className="text-lg font-semibold tracking-[-0.01em]">
                    {mod.title}
                  </span>
                  <span className="text-[13px] leading-[1.55] text-muted-foreground">
                    {mod.desc}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3.5">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                    {mod.linkLabel}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    →
                  </span>
                </div>
              </Link>
            </LandingReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
