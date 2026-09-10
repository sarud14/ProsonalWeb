import { Container, PageRouteHeader } from '@/components/ui'
import { WorkListSection } from '@/features/work/WorkListSection'
import { getContentSource } from '@/lib/content/source'
import { resolveWorkDomainLabels } from '@/lib/content/work-domains'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
}

export default async function WorkPage(): Promise<React.JSX.Element> {
  const content = await getContentSource()
  const [workList, domainLabels] = await Promise.all([
    content.getAllWork(),
    resolveWorkDomainLabels(),
  ])

  const sortedWorkList = [...workList].sort((a, b) =>
    a.listId.localeCompare(b.listId),
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
      <WorkListSection items={sortedWorkList} domainFilters={domainLabels} />
    </Container>
  )
}
