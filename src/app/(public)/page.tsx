import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'FEOps Kit — Home',
}

const STATS = [
  { value: '06', label: 'Case Studies' },
  { value: '04', label: 'Problem Domains' },
  { value: '5y', label: 'Shipping Products' },
  { value: '2', label: 'Languages — EN / TH' },
] as const

const MODULES: readonly { num: string; title: string; desc: string; link: string; linkLabel: string; badge?: string }[] = [
  { num: '01', title: 'Work', desc: 'Case studies — architecture, decisions, and measured impact.', link: '/work', linkLabel: '6 entries', badge: 'Live' },
  { num: '02', title: 'Engineering', desc: 'Architecture notes, decision logs, and performance write-ups.', link: '/engineering', linkLabel: 'Notes' },
  { num: '03', title: 'Journal', desc: 'Working notes on building, learning, and shipping.', link: '/journal', linkLabel: 'Posts' },
  { num: '04', title: 'Focus', desc: 'What I am learning and building right now — the roadmap.', link: '/focus', linkLabel: 'Roadmap' },
  { num: '05', title: 'Stack', desc: 'Tools, workflow, and the setup behind the work.', link: '/stack', linkLabel: 'Tooling' },
  { num: '06', title: 'Résumé', desc: 'Experience and capabilities — print and PDF ready.', link: '/resume', linkLabel: 'CV / PDF' },
]

const TECH_STACK = [
  'Next.js', 'TypeScript', 'React', 'Node.js', 'Tailwind',
  'PostgreSQL', 'GraphQL', 'i18n', 'Playwright', 'AI-assisted',
] as const

export default function HomePage(): React.JSX.Element {
  return (
    <>
      {/* Hero */}
      <section className="py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                // Engineering System
              </span>
              <span className="flex-1 border-t border-dashed border-border" />
              <span className="text-xs text-muted-foreground">v1.0</span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight lg:text-6xl">
              Building scalable digital products,{' '}
              <span className="text-muted-foreground">framed as systems.</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Frontend engineer working in <strong className="text-foreground">Next.js</strong>,{' '}
              <strong className="text-foreground">TypeScript</strong>, and AI-assisted workflows.
              Focused on CMS platforms, booking systems, multilingual applications, and frontend
              architecture.
            </p>

            <div className="flex items-center gap-3">
              <Button render={<Link href="/work" />} nativeButton={false} size="lg" className="gap-2 rounded-full px-5">
                View the work <ArrowRight className="size-4" />
              </Button>
              <Button render={<Link href="/engineering" />} nativeButton={false} variant="outline" size="lg" className="rounded-full px-5">
                Browse the system
              </Button>
            </div>

            <div className="mt-4 flex gap-8">
              {[
                { label: 'Focus', value: 'Frontend Platform Engineering' },
                { label: 'Base', value: 'Australia — Remote' },
                { label: 'Lang', value: 'EN / TH multilingual' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile + Code Card */}
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col items-center gap-4 p-8">
              <div className="flex size-32 items-center justify-center rounded border border-border">
                <span className="text-xs text-muted-foreground">Photo loading...</span>
              </div>
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="font-semibold">Sarut Dumrongprechachan</p>
                  <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    FE-Eng &middot; AU / Remote
                  </p>
                </div>
                <Badge variant="success">
                  <span className="mr-1 size-1.5 rounded-full bg-success" />
                  Open
                </Badge>
              </div>
            </Card>

            <Card className="p-0">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-2 text-xs text-muted-foreground">engineer.config.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-muted-foreground">{'const '}</span>
                  <span className="font-bold text-foreground">engineer</span>
                  <span className="text-muted-foreground">{' = {'}</span>
                  {'\n'}
                  <span className="text-muted-foreground">{'  role: '}</span>
                  <span className="text-success">{'"Frontend Engineer"'}</span>,{'\n'}
                  <span className="text-muted-foreground">{'  stack: '}</span>
                  <span className="text-success">{`["Next.js", "TS", "React"]`}</span>,{'\n'}
                  <span className="text-muted-foreground">{'  domains: '}</span>
                  <span className="text-success">{`["cms", "booking", "i18n"]`}</span>,{'\n'}
                  <span className="text-muted-foreground">{'  focus: '}</span>
                  <span className="text-success">{'"platform-eng"'}</span>,{'\n'}
                  <span className="text-muted-foreground">{'  status: '}</span>
                  <span className="text-success">{'"available"'}</span>,{'\n'}
                  <span className="text-muted-foreground">{'}'}</span>
                  {' satisfies '}
                  <span className="font-bold text-foreground">Engineer</span>;
                  <span className="inline-block size-2 animate-pulse bg-foreground" />
                </code>
              </pre>
            </Card>
          </div>
        </Container>
      </section>

      {/* Stats */}
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

      {/* System Modules */}
      <section className="py-16">
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
                      <span className="text-xs text-muted-foreground">{mod.num}</span>
                      {mod.badge && <Badge variant="success">{mod.badge}</Badge>}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{mod.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{mod.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-3 text-xs uppercase tracking-[0.1em] text-muted-foreground">
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
              Frontend Platform Engineering — design systems, build tooling, and the infrastructure
              that lets product teams ship faster.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <Badge key={tech} variant="outline" className="font-mono text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
