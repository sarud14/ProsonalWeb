interface AdminFormFieldProps {
  readonly label: string
  readonly required?: boolean
  readonly span?: string
  readonly children: React.ReactNode
}

export function AdminFormField({
  label,
  required = false,
  span = 'span 1',
  children,
}: AdminFormFieldProps): React.JSX.Element {
  return (
    <label className="flex flex-col gap-[7px]" style={{ gridColumn: span }}>
      <span className="flex gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  )
}

export const adminInputClassName =
  'w-full rounded-lg border border-border bg-[oklch(0.13_0.008_255)] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground'

export const adminTextareaClassName =
  'w-full rounded-lg border border-border bg-[oklch(0.13_0.008_255)] px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground'
