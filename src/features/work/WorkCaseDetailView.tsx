import { Container } from '@/components/ui'
import { WorkCaseContentsRail, WorkCaseHero } from './WorkCaseHero'
import { WorkCaseDetailArticle } from './WorkCaseDetailArticle'
import { getWorkCaseDetail } from './query/workCaseDetail'
import type { WorkCaseDetailViewProps } from '@/types/work-case-detail.types'

export function WorkCaseDetailView({
  work,
}: WorkCaseDetailViewProps): React.JSX.Element {
  const detail = getWorkCaseDetail(work)

  return (
    <>
      <Container className="max-w-[1240px] px-7">
        <WorkCaseHero work={work} />
      </Container>

      <Container className="max-w-[1240px] px-7">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[212px_minmax(0,1fr)]">
          <WorkCaseContentsRail />
          <WorkCaseDetailArticle detail={detail} />
        </div>
      </Container>
    </>
  )
}
