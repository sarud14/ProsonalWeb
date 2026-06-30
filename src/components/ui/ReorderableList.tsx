'use client'

interface ReorderableItem {
  readonly id: string
  readonly primary: string
  readonly secondary?: string
  readonly bullets?: readonly string[]
  readonly meta?: React.ReactNode
}

interface ReorderableListProps {
  readonly label: string
  readonly items: readonly ReorderableItem[]
  readonly onMoveUp: (id: string) => void
  readonly onMoveDown: (id: string) => void
  readonly onRemove: (id: string) => void
  readonly onAdd: () => void
  readonly renderExtra?: (item: ReorderableItem) => React.ReactNode
}

export function ReorderableList({
  label,
  items,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAdd,
  renderExtra,
}: ReorderableListProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-[18px] flex items-center justify-between border-b border-border/50 pb-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="cursor-pointer rounded-[7px] border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-col gap-3.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 rounded-[10px] border border-border bg-secondary p-4"
          >
            <div className="flex flex-col gap-[3px] pt-0.5">
              <button
                type="button"
                onClick={() => onMoveUp(item.id)}
                disabled={index === 0}
                className="flex h-[22px] w-6 cursor-pointer items-center justify-center rounded-[5px] border border-border bg-muted text-[10px] text-muted-foreground disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onMoveDown(item.id)}
                disabled={index === items.length - 1}
                className="flex h-[22px] w-6 cursor-pointer items-center justify-center rounded-[5px] border border-border bg-muted text-[10px] text-muted-foreground disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[17px] font-medium">{item.primary}</div>
              {item.secondary && (
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  {item.secondary}
                </div>
              )}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-2.5 list-disc pl-[18px] text-[13px] leading-relaxed text-muted-foreground">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {renderExtra?.(item)}
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-border bg-transparent text-sm text-primary"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-8 text-center text-sm italic text-muted-foreground">
            Nothing here yet. Click + Add to get started.
          </div>
        )}
      </div>
    </section>
  )
}
