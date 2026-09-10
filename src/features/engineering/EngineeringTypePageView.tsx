import { EngineeringListSection } from '@/features/engineering/EngineeringListSection'
import { Container, PageRouteHeader } from '@/components/ui'
import type { EngineeringNoteType } from '@/constants/engineering'
import type { EngineeringNote } from '@/types/engineering.types'

const ENGINEERING_TYPE_DESCRIPTION: Record<EngineeringNoteType, string> = {
  Architecture: 'System boundaries, layering, and the contracts that keep a frontend platform coherent.',
  Decisions: 'Decision logs — the trade-offs that shaped the work, kept short and searchable.',
  Performance: 'Measured performance work: budgets, regressions caught, and what actually moved the needle.',
}

interface EngineeringTypePageViewProps {
  readonly pathSegment: string
  readonly noteType: EngineeringNoteType
  readonly notes: readonly EngineeringNote[]
}

export function EngineeringTypePageView({
  pathSegment,
  noteType,
  notes,
}: EngineeringTypePageViewProps): React.JSX.Element {
  const trailingLabel = `${String(notes.length).padStart(2, '0')} NOTES`

  return (
    <Container className="max-w-[1240px] px-7">
      <PageRouteHeader
        path={`/engineering/${pathSegment}`}
        trailing={trailingLabel}
        title={noteType}
        description={ENGINEERING_TYPE_DESCRIPTION[noteType]}
      />
      <EngineeringListSection
        items={notes}
        showFilters={false}
        initialFilter={noteType}
      />
    </Container>
  )
}
