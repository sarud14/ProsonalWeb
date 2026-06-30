interface FormSectionProps {
  readonly label: string
  readonly columns?: string
  readonly children: React.ReactNode
}

export function FormSection({
  label,
  columns = '1fr 1fr',
  children,
}: FormSectionProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-[18px] border-b border-border/50 pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: columns }}>
        {children}
      </div>
    </section>
  )
}
