'use client'

interface InlineEditRowProps {
  readonly id: string
  readonly label: string
  readonly sortOrder: number
  readonly referenceCount: number
  readonly onLabelChange: (id: string, label: string) => void
  readonly onDelete: (id: string) => void
}

export function InlineEditRow({
  id,
  label,
  sortOrder,
  referenceCount,
  onLabelChange,
  onDelete,
}: InlineEditRowProps): React.JSX.Element {
  const canDelete = referenceCount === 0

  return (
    <div className="grid grid-cols-[1fr_90px_80px_96px] items-center border-b border-border/50 px-5 py-2">
      <input
        defaultValue={label}
        onBlur={(e) => {
          const value = e.currentTarget.value.trim()
          if (value && value !== label) {
            onLabelChange(id, value)
          }
        }}
        className="rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-foreground outline-none focus:border-border"
      />
      <span className="text-center font-mono text-[13px] text-muted-foreground">
        {sortOrder}
      </span>
      <span className="text-center text-[13px] text-muted-foreground">
        {referenceCount}
      </span>
      <button
        type="button"
        onClick={() => onDelete(id)}
        disabled={!canDelete}
        title={canDelete ? 'Delete' : `Cannot delete — used by ${referenceCount} work items`}
        className={`ml-auto flex h-[30px] cursor-pointer items-center rounded-[7px] px-2.5 font-mono text-[9.5px] uppercase tracking-[0.08em] ${
          canDelete
            ? 'bg-destructive text-white'
            : 'cursor-not-allowed bg-destructive/50 text-white/80 opacity-40'
        }`}
      >
        Delete
      </button>
    </div>
  )
}
