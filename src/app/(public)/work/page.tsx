import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { getContentSource } from '@/lib/content/source'

export const metadata: Metadata = {
  title: 'Work — FEOps Kit',
}

export default async function WorkPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const workList = await content.getAllWork()

  return (
    <main className="py-16">
      <Container>
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
            Case Studies
          </span>
          <h1 className="text-4xl font-semibold tracking-[-0.02em]">Work</h1>
          <p className="max-w-2xl text-muted-foreground">
            Architecture, decisions, and measured impact — NDA-safe write-ups.
          </p>
        </div>

        <div className="grid gap-4">
          {workList.map((work) => (
            <Link key={work.slug} href={`/work/${work.slug}`}>
              <Card className="p-6 transition-colors hover:bg-white/[0.025]">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-[-0.01em]">{work.title}</h2>
                  <Badge variant="success">Published</Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{work.context}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
