import { TECH_STACK } from "@/app/(public)/page";
import { LandingReveal } from "@/components/public-page/Landing/LandingReveal";
import { Container } from "@/components/ui/Container";
import {
  LANDING_MOTION_EXPLORE_DELAY_MS,
  LANDING_MOTION_STACK_DELAY_MS,
  LANDING_MOTION_STACK_TAG_STAGGER_MS,
} from "@/constants/landing-motion";

export default function ExploreStackSection(): React.JSX.Element {
  return (
    <section className="mb-[88px]">
      <Container className="max-w-[1240px] px-7">
        <div className="grid grid-cols-1 border border-t-0 border-white/[0.09] lg:grid-cols-2">
          <LandingReveal
            delay={LANDING_MOTION_EXPLORE_DELAY_MS}
            className="border-b border-white/[0.07] px-[30px] py-[34px] lg:border-r lg:border-b-0"
          >
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Currently Exploring
            </span>
            <p className="mt-4 text-[19px] font-medium leading-normal tracking-[-0.01em]">
              Frontend Platform Engineering — design systems, build tooling, and
              the infrastructure that lets product teams ship faster.
            </p>
          </LandingReveal>
          <LandingReveal
            delay={LANDING_MOTION_STACK_DELAY_MS}
            className="px-[30px] py-[34px]"
          >
            <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Stack
            </span>
            <div className="mt-[18px] flex flex-wrap gap-2">
              {TECH_STACK.map((tech, index) => (
                <LandingReveal
                  key={tech}
                  className="inline-block"
                  delay={
                    LANDING_MOTION_STACK_DELAY_MS +
                    index * LANDING_MOTION_STACK_TAG_STAGGER_MS
                  }
                  variant="fade-in"
                >
                  <span className="font-mono text-xs tracking-[0.02em] text-secondary-foreground border border-white/[0.12] px-3 py-[7px]">
                    {tech}
                  </span>
                </LandingReveal>
              ))}
            </div>
          </LandingReveal>
        </div>
      </Container>
    </section>
  );
}
