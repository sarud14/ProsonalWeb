'use client'

import type { ReactNode } from 'react'

import { StatusBadge } from '@/components/ui/StatusBadge'
import { ChipList } from '@/components/ui/ChipList'

export interface DataTableColumn {
  readonly key: string
  readonly label: string
  readonly align?: 'left' | 'center' | 'right'
}

export type CellType =
  | { readonly kind: 'title'; readonly text: string }
  | { readonly kind: 'text'; readonly text: string; readonly mono?: boolean }
  | { readonly kind: 'badge'; readonly status: 'PUBLISHED' | 'DRAFT' }
  | { readonly kind: 'chips'; readonly items: readonly string[] }
  | { readonly kind: 'custom'; readonly render: ReactNode }

export interface DataTableRow {
  readonly id: string
  readonly cells: readonly CellType[]
  readonly status: 'PUBLISHED' | 'DRAFT'
}

interface DataTableProps {
  readonly columns: readonly DataTableColumn[]
  readonly rows: readonly DataTableRow[]
  readonly gridTemplate: string
  readonly onEdit: (id: string) => void
  readonly onTogglePublish: (id: string) => void
  readonly onDelete: (id: string) => void
}

export function DataTable({
  columns,
  rows,
  gridTemplate,
  onEdit,
  onTogglePublish,
  onDelete,
}: DataTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="grid items-center border-b border-border bg-[oklch(0.13_0.008_255)] px-[22px] py-3"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            style={{ textAlign: col.align ?? 'left' }}
          >
            {col.label}
          </span>
        ))}
        <span className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Actions
        </span>
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid items-center border-b border-border/50 px-[22px] py-1"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {row.cells.map((cell, i) => (
            <div
              key={columns[i]?.key ?? i}
              className="min-w-0 py-3"
              style={{ textAlign: columns[i]?.align ?? 'left' }}
            >
              {cell.kind === 'title' && (
                <button
                  type="button"
                  onClick={() => onEdit(row.id)}
                  className="cursor-pointer truncate border-none bg-transparent p-0 text-left text-sm font-semibold text-foreground"
                >
                  {cell.text}
                </button>
              )}
              {cell.kind === 'text' && (
                <span
                  className={`text-[13px] text-muted-foreground ${cell.mono ? 'font-mono' : ''}`}
                >
                  {cell.text}
                </span>
              )}
              {cell.kind === 'badge' && <StatusBadge status={cell.status} />}
              {cell.kind === 'chips' && <ChipList items={cell.items} />}
              {cell.kind === 'custom' && cell.render}
            </div>
          ))}

          <div className="flex justify-end gap-1 py-2">
            <button
              type="button"
              onClick={() => onEdit(row.id)}
              title="Edit"
              className="flex size-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-border bg-transparent text-xs text-muted-foreground"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => onTogglePublish(row.id)}
              title={row.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              className={`flex h-[30px] cursor-pointer items-center rounded-[7px] border px-2.5 font-mono text-[9.5px] uppercase tracking-[0.08em] ${
                row.status === 'PUBLISHED'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-warning/30 bg-warning/10 text-warning'
              }`}
            >
              {row.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(row.id)}
              title="Delete"
              className="flex size-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-border bg-transparent text-[13px] text-primary"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {rows.length === 0 && (
        <div className="py-12 text-center text-[17px] italic text-muted-foreground">
          Nothing here yet.
        </div>
      )}
    </div>
  )
}
