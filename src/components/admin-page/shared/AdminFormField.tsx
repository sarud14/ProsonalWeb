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
      <span className="flex gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60">
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  )
}

export const adminInputClassName =
  'w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/45'

export const adminTextareaClassName =
  'w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-relaxed text-black outline-none placeholder:text-black/45'
