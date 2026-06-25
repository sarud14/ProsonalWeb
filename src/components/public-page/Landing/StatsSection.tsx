import { STATS } from "@/app/(public)/page";
import { Container } from "@/components/ui/Container";

export default function StatsSection() {
  return (
     <section className="border-y border-border py-12">
            <Container className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </Container>
          </section>
  )
}