'use client'

import { useCallback, useState } from 'react'

import type { StackGroupModalState } from '@/types/admin-pages.types'

import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'

interface StackGroupModalProps {
  readonly state: StackGroupModalState
  readonly onClose: () => void
  readonly onSave: (group: StackGroupModalState['group']) => void
}

export function StackGroupModal({
  state,
  onClose,
  onSave,
}: StackGroupModalProps): React.JSX.Element {
  const [group, setGroup] = useState(state.group)

  const updateTool = useCallback(
    (index: number, field: 'name' | 'note', value: string) => {
      setGroup((current) => ({
        ...current,
        tools: current.tools.map((tool, toolIndex) =>
          toolIndex === index ? { ...tool, [field]: value } : tool
        ),
      }))
    },
    []
  )

  const addTool = useCallback(() => {
    setGroup((current) => ({
      ...current,
      tools: [...current.tools, { name: '', note: '' }],
    }))
  }, [])

  const removeTool = useCallback((index: number) => {
    setGroup((current) => ({
      ...current,
      tools: current.tools.filter((_, toolIndex) => toolIndex !== index),
    }))
  }, [])

  const handleSave = useCallback(() => {
    onSave(group)
  }, [group, onSave])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[85vh] w-[90%] max-w-[560px] overflow-y-auto rounded-[14px] border border-border bg-card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-[22px] font-medium">
          {state.isNew ? 'Add' : 'Edit'} stack group
        </h3>

        <div className="flex flex-col gap-4">
          <AdminFormField label="Group label">
            <input
              className={adminInputClassName}
              value={group.label}
              onChange={(e) => setGroup((current) => ({ ...current, label: e.target.value }))}
            />
          </AdminFormField>

          <div className="flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Tools
            </div>
            {group.tools.map((tool, index) => (
              <div key={`tool-${index}`} className="flex gap-2">
                <input
                  className={adminInputClassName}
                  placeholder="Name"
                  value={tool.name}
                  onChange={(e) => updateTool(index, 'name', e.target.value)}
                />
                <input
                  className={adminInputClassName}
                  placeholder="Note"
                  value={tool.note}
                  onChange={(e) => updateTool(index, 'note', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="shrink-0 cursor-pointer rounded-lg border border-border px-3 text-primary"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTool}
              className="cursor-pointer self-start rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold"
            >
              + Add tool
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border bg-secondary px-[18px] py-2.5 text-[13px] font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded-lg bg-primary px-[18px] py-2.5 text-[13px] font-bold text-primary-foreground"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
