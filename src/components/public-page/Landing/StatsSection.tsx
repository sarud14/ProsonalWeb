import { STATS } from "@/app/(public)/page";
import { Container } from "@/components/ui/Container";

export default function StatsSection(): React.JSX.Element {
  return (
    <section>
      <Container className="max-w-[1240px] px-7">
        <div className="flex flex-wrap border-y border-border">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-[170px] flex-1 flex-col items-center gap-1.5 border-r border-white/[0.07] px-7 py-[26px] text-center last:border-r-0"
            >
              <p className="font-mono text-[26px] font-medium tracking-[-0.02em] text-foreground">
                {stat.value}
              </p>
              <p className="font-mono text-[10.5px] tracking-[0.13em] text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
