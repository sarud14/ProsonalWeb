import type { Metadata } from 'next'

import { EngineeringListSection } from '@/components/public-page/Engineering/EngineeringListSection'
import { Container } from '@/components/ui/Container'
import { PageRouteHeader } from '@/components/ui/PageRouteHeader'
import { getContentSource } from '@/lib/content/source'

export const metadata: Metadata = {
  title: 'Engineering — FEOps Kit',
}

export default async function EngineeringPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const notes = await content.getAllEngineeringNotes()

  const sortedNotes = [...notes].sort((a, b) => a.listId.localeCompare(b.listId))

  const trailingLabel = `${String(sortedNotes.length).padStart(2, '0')} NOTES`

  return (
    <Container className="max-w-[1240px] px-7">
      <PageRouteHeader
        path="/engineering"
        trailing={trailingLabel}
        title="Engineering notes"
        description="Architecture write-ups, decision logs, and performance notes — the reasoning behind the work, kept in the open. Filter by note type."
      />
      <EngineeringListSection items={sortedNotes} />
    </Container>
  )
}
