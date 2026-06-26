import ExploreStackSection from "@/components/public-page/Landing/ExploreStackSection";
import HeroSection from "@/components/public-page/Landing/HeroSection";
import ModulesSection from "@/components/public-page/Landing/ModulesSection";
import StatsSection from "@/components/public-page/Landing/StatsSection";
import type { Metadata } from "next";

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
    linkLabel: "6 ENTRIES",
    badge: "LIVE",
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
      
      {/* Modules */}
      <ModulesSection />

      {/* Explore Stack */}
      <ExploreStackSection />
    </>
  );
}
