import { WorkCaseSectionBlock } from '@/components/public-page/Work/WorkCaseSectionHeader'
import { WORK_CASE_SECTIONS } from '@/constants/work-case-sections'
import type { WorkCaseDetail } from '@/types/work-case-detail.types'

interface WorkCaseDetailArticleProps {
  readonly detail: WorkCaseDetail
}

export function WorkCaseDetailArticle({
  detail,
}: WorkCaseDetailArticleProps): React.JSX.Element {
  const [
    contextSection,
    problemSection,
    constraintsSection,
    architectureSection,
    decisionsSection,
    impactSection,
  ] = WORK_CASE_SECTIONS

  return (
    <article
      data-work-article=""
      className="flex flex-col pb-20 pt-11 lg:pt-11"
    >
      <WorkCaseSectionBlock
        id={contextSection.id}
        num={contextSection.num}
        label="Context"
        className="pb-16"
      >
        <div className="grid grid-cols-1 items-start gap-12 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <h2 className="mb-5 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em]">
              {detail.contextHeadline}
            </h2>
            {detail.contextParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-[18px] text-base leading-[1.7] text-secondary-foreground last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-[18px] border-border xl:border-l xl:pl-5">
            {detail.contextAside.map((item) => (
              <div key={item.label} className="flex flex-col gap-[5px]">
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {item.label}
                </span>
                <span className="text-sm text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </WorkCaseSectionBlock>

      <WorkCaseSectionBlock
        id={problemSection.id}
        num={problemSection.num}
        label="Problem"
        className="py-16"
      >
        <div className="relative border border-white/[0.14] bg-card p-10">
          <span
            className="absolute top-0 left-0 h-full w-[3px] bg-primary"
            aria-hidden
          />
          <p className="max-w-[780px] text-[26px] leading-[1.4] font-medium tracking-[-0.015em]">
            {detail.problemCallout}
          </p>
        </div>
        <div className="mt-7 grid grid-cols-1 border border-border sm:grid-cols-3">
          {detail.problemStats.map((stat) => (
            <div
              key={`${stat.value}-${stat.label}`}
              className="flex flex-col gap-2 px-6 py-[22px] sm:border-r sm:border-white/[0.07] last:sm:border-r-0"
            >
              <span className="font-mono text-[22px] font-medium tracking-[-0.02em] text-foreground">
                {stat.value}
              </span>
              <span className="text-[13px] leading-normal text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </WorkCaseSectionBlock>

      <WorkCaseSectionBlock
        id={constraintsSection.id}
        num={constraintsSection.num}
        label="Constraints"
        className="py-16"
      >
        <h2 className="mb-7 text-[26px] font-semibold tracking-[-0.02em]">
          {detail.constraintsHeading}
        </h2>
        <div className="grid grid-cols-1 border border-border md:grid-cols-2">
          {detail.constraints.map((constraint) => (
            <div
              key={constraint.tag}
              className="flex flex-col gap-3 border-b border-r border-white/[0.07] p-[26px] md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
                  {constraint.tag}
                </span>
                <span className="border border-white/[0.14] px-2 py-0.5 font-mono text-[10.5px] tracking-[0.1em] text-secondary-foreground uppercase">
                  {constraint.kind}
                </span>
              </div>
              <span className="text-base font-semibold tracking-[-0.01em]">
                {constraint.title}
              </span>
              <span className="text-sm leading-[1.6] text-muted-foreground">
                {constraint.body}
              </span>
            </div>
          ))}
        </div>
      </WorkCaseSectionBlock>

      <WorkCaseSectionBlock
        id={architectureSection.id}
        num={architectureSection.num}
        label="Architecture"
        className="py-16"
      >
        <h2 className="mb-3.5 text-[26px] font-semibold tracking-[-0.02em]">
          {detail.architectureHeadline}
        </h2>
        <p className="mb-9 max-w-[720px] text-base leading-[1.7] text-secondary-foreground">
          {detail.architectureBody}
        </p>

        <div className="border border-white/[0.12] bg-card">
          <div className="flex items-center justify-between border-b border-white/[0.09] bg-secondary px-[18px] py-3">
            <span className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
              system.diagram — request flow
            </span>
            <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              {detail.tiers.length} tiers
            </span>
          </div>
          <div className="px-[26px] py-[30px]">
            {detail.tiers.map((tier, tierIndex) => (
              <div key={tier.label}>
                <div className="grid grid-cols-1 items-stretch gap-[18px] md:grid-cols-[108px_minmax(0,1fr)]">
                  <div className="flex flex-col justify-center gap-1">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-foreground">
                      {tier.label}
                    </span>
                    <span className="font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground">
                      {tier.code}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {tier.nodes.map((node) => (
                      <div
                        key={node.name}
                        className="flex min-w-[140px] flex-1 flex-col gap-[5px] border border-white/[0.16] bg-secondary px-4 py-3.5"
                      >
                        <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-foreground">
                          {node.name}
                        </span>
                        <span className="font-mono text-[10.5px] tracking-[0.02em] text-muted-foreground">
                          {node.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {tier.connector && tierIndex < detail.tiers.length - 1 && (
                  <div className="grid h-[34px] grid-cols-1 gap-[18px] md:grid-cols-[108px_minmax(0,1fr)]">
                    <span aria-hidden />
                    <div className="flex items-center gap-3 pl-0.5">
                      <span className="ml-[11px] h-full w-px bg-white/[0.18]" />
                      <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
                        ↓ {tier.connector}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </WorkCaseSectionBlock>

      <WorkCaseSectionBlock
        id={decisionsSection.id}
        num={decisionsSection.num}
        label="Engineering decisions"
        className="py-16"
      >
        <h2 className="mb-7 text-[26px] font-semibold tracking-[-0.02em]">
          {detail.decisionsHeading}
        </h2>
        <div className="flex flex-col border border-border">
          {detail.decisions.map((decision) => (
            <div
              key={decision.id}
              className="border-b border-white/[0.07] px-7 py-[26px] last:border-b-0"
            >
              <div className="mb-4 flex flex-wrap items-baseline gap-3.5">
                <span className="bg-primary px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] text-primary-foreground">
                  {decision.id}
                </span>
                <span className="text-lg font-semibold tracking-[-0.01em]">
                  {decision.title}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Context
                  </span>
                  <span className="text-sm leading-[1.6] text-secondary-foreground">
                    {decision.context}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Trade-off
                  </span>
                  <span className="text-sm leading-[1.6] text-secondary-foreground">
                    {decision.tradeoff}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WorkCaseSectionBlock>

      <WorkCaseSectionBlock
        id={impactSection.id}
        num={impactSection.num}
        label="Impact"
        className="border-b-0 py-16 pb-0"
      >
        <h2 className="mb-7 text-[26px] font-semibold tracking-[-0.02em]">
          {detail.impactHeading}
        </h2>
        <div className="grid grid-cols-1 border border-border sm:grid-cols-2 xl:grid-cols-4">
          {detail.impact.map((item) => (
            <div
              key={`${item.value}-${item.label}`}
              className="flex flex-col gap-2.5 border-b border-r border-white/[0.07] px-[22px] py-7 xl:border-b-0 xl:[&:nth-child(4n)]:border-r-0"
            >
              <span className="font-mono text-[34px] font-semibold tracking-[-0.03em] text-foreground">
                {item.value}
              </span>
              <span className="text-[13.5px] leading-normal text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-col border border-border">
          {detail.outcomes.map((outcome) => (
            <div
              key={outcome}
              className="flex items-start gap-4 border-b border-white/[0.07] px-6 py-5 last:border-b-0"
            >
              <span className="mt-0.5 font-mono text-xs text-success">✓</span>
              <span className="text-[15px] leading-[1.6] text-secondary-foreground">
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </WorkCaseSectionBlock>
    </article>
  )
}
