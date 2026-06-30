interface SectionHeadingProps {
  readonly kicker: string
  readonly title: string
  readonly action?: React.ReactNode
}

export function SectionHeading({ kicker, title, action }: SectionHeadingProps): React.JSX.Element {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
          {kicker}
        </div>
        <h1 className="text-[34px] font-medium leading-tight tracking-[-0.02em]">
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}
