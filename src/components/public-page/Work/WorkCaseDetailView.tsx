import { Container } from '@/components/ui/Container'
import { WorkCaseContentsRail, WorkCaseHero } from '@/components/public-page/Work/WorkCaseHero'
import { WorkCaseDetailArticle } from '@/components/public-page/Work/WorkCaseDetailArticle'
import { getWorkCaseDetail } from '@/lib/work-case-detail'
import type { WorkCaseStudy } from '@/types/work.types'

interface WorkCaseDetailViewProps {
  readonly work: WorkCaseStudy
}

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
