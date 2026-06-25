import HeroSection from "@/components/public-page/Landing/HeroSection";
import StatsSection from "@/components/public-page/Landing/StatsSection";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FEOps Kit — Home",
};

type Stat = {
  value: string;
  label: string;
};

type Module = {
  num: string;
  title: string;
  desc: string;
  link: string;
  linkLabel: string;
  badge?: string;
};

type FocusItem = {
  label: string;
  value: string;
};

export const STATS = [
  { value: "06", label: "Case Studies" },
  { value: "04", label: "Problem Domains" },
  { value: "5y", label: "Shipping Products" },
  { value: "2", label: "Languages — EN / TH" },
] as const satisfies readonly Stat[];

export const MODULES = [
  {
    num: "01",
    title: "Work",
    desc: "Case studies — architecture, decisions, and measured impact.",
    link: "/work",
    linkLabel: "6 entries",
    badge: "Live",
  },
  {
    num: "02",
    title: "Engineering",
    desc: "Architecture notes, decision logs, and performance write-ups.",
    link: "/engineering",
    linkLabel: "Notes",
  },
  {
    num: "03",
    title: "Journal",
    desc: "Working notes on building, learning, and shipping.",
    link: "/journal",
    linkLabel: "Posts",
  },
  {
    num: "04",
    title: "Focus",
    desc: "What I am learning and building right now — the roadmap.",
    link: "/focus",
    linkLabel: "Roadmap",
  },
  {
    num: "05",
    title: "Stack",
    desc: "Tools, workflow, and the setup behind the work.",
    link: "/stack",
    linkLabel: "Tooling",
  },
  {
    num: "06",
    title: "Résumé",
    desc: "Experience and capabilities — print and PDF ready.",
    link: "/resume",
    linkLabel: "CV / PDF",
  },
] satisfies readonly Module[];

export const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Node.js",
  "Tailwind",
  "PostgreSQL",
  "GraphQL",
  "i18n",
  "Playwright",
  "AI-assisted",
] as const;

export const FOCUS_ITEMS = [
  {
    label: "Focus",
    value: "Frontend Platform Engineering",
  },
  {
    label: "Base",
    value: "Australia — Remote",
  },
  {
    label: "Lang",
    value: "EN / TH multilingual",
  },
] as const satisfies readonly FocusItem[];

export default function HomePage(): React.JSX.Element {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <StatsSection />

      {/* System Modules */}
      <section id="modules" className="py-16">
        <Container>
          <SectionHeader
            number="02"
            title="System modules"
            trailing="Entry points — 06"
            className="mb-8"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <Link key={mod.num} href={mod.link}>
                <Card className="flex h-full flex-col justify-between transition-colors hover:border-muted-foreground/30">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {mod.num}
                      </span>
                      {mod.badge && (
                        <Badge variant="success">{mod.badge}</Badge>
                      )}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{mod.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-3 text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{mod.linkLabel}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Currently Exploring + Stack */}
      <section className="py-16">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Currently Exploring
            </p>
            <p className="text-xl font-semibold leading-relaxed">
              Frontend Platform Engineering — design systems, build tooling, and
              the infrastructure that lets product teams ship faster.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
