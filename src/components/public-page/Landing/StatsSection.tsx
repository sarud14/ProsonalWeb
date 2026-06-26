import { STATS } from "@/app/(public)/page";
import { LandingReveal } from "@/components/public-page/Landing/LandingReveal";
import { Container } from "@/components/ui/Container";
import {
  LANDING_MOTION_STATS_BASE_DELAY_MS,
  LANDING_MOTION_STAGGER_MS,
} from "@/constants/landing-motion";

export default function StatsSection(): React.JSX.Element {
  return (
    <section>
      <Container className="max-w-[1240px] px-7">
        <div className="flex flex-wrap border-y border-border">
          {STATS.map((stat, index) => (
            <LandingReveal
              key={stat.label}
              delay={
                LANDING_MOTION_STATS_BASE_DELAY_MS +
                index * LANDING_MOTION_STAGGER_MS
              }
              className="flex min-w-[170px] flex-1 flex-col items-center gap-1.5 border-r border-white/[0.07] px-7 py-[26px] text-center last:border-r-0"
            >
              <p className="font-mono text-[26px] font-medium tracking-[-0.02em] text-foreground">
                {stat.value}
              </p>
              <p className="font-mono text-[10.5px] tracking-[0.13em] text-muted-foreground uppercase">
                {stat.label}
              </p>
            </LandingReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
