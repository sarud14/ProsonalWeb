import { Container } from '@/components/ui/Container'
import { PageRouteHeader } from '@/components/ui/PageRouteHeader'
import { WorkListSection } from '@/components/public-page/Work/WorkListSection'
import { getContentSource } from '@/lib/content/source'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — FEOps Kit',
}

export default async function WorkPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const workList = await content.getAllWork()

  const sortedWorkList = [...workList].sort((a, b) =>
    a.listId.localeCompare(b.listId)
  )

  const trailingLabel = `${String(sortedWorkList.length).padStart(2, '0')} CASE STUDIES`

  return (
    <Container className="max-w-[1240px] px-7">
      <PageRouteHeader
        path="/work"
        trailing={trailingLabel}
        title="Selected work"
        description="Case studies abstracted to be NDA-safe — described in architecture, decisions, and measured impact rather than client logos. Filter by problem domain."
      />
      <WorkListSection items={sortedWorkList} />
    </Container>
  )
}
