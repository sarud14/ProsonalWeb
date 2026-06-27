import { Container } from '@/components/ui/Container'
import { PageRouteHeader } from '@/components/ui/PageRouteHeader'
import {
  getStackToolCount,
  STACK_PAGE_DATA,
} from '@/constants/stack-page-data'

export function StackPageView(): React.JSX.Element {
  const { groups } = STACK_PAGE_DATA
  const toolCount = getStackToolCount(groups)
  const trailingLabel = `${String(toolCount).padStart(2, '0')} TOOLS`

  return (
    <Container className="max-w-[1240px] px-7">
      <PageRouteHeader
        path="/stack"
        trailing={trailingLabel}
        title="Tools & workflow"
        description="The setup behind the work — what I reach for daily, and the workflow that ties it together."
      />

      <section className="mb-[88px] mt-9 grid grid-cols-1 border border-border md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.label}
            className="border-b border-r border-white/[0.07] lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 max-md:last:border-b-0"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-[22px] py-[18px]">
              <span className="font-mono text-[11px] tracking-[0.12em] text-foreground">
                {group.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {group.tools.length}
              </span>
            </div>

            {group.tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-baseline justify-between gap-3.5 border-b border-white/[0.05] px-[22px] py-3.5 last:border-b-0"
              >
                <span className="text-[14.5px] font-medium tracking-[-0.01em]">
                  {tool.name}
                </span>
                <span className="text-right font-mono text-[10.5px] tracking-[0.02em] text-muted-foreground">
                  {tool.note}
                </span>
              </div>
            ))}
          </div>
        ))}
      </section>
    </Container>
  )
}
