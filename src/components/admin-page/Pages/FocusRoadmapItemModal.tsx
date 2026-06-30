'use client'

import { useCallback, useState } from 'react'

import { FOCUS_ROADMAP_DOT } from '@/constants/focus'
import type { FocusRoadmapItemModalState } from '@/types/admin-pages.types'

import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'

const DOT_OPTIONS = [
  { value: FOCUS_ROADMAP_DOT.ACTIVE, label: 'Active' },
  { value: FOCUS_ROADMAP_DOT.QUEUED, label: 'Queued' },
  { value: FOCUS_ROADMAP_DOT.EXPLORING, label: 'Exploring' },
] as const

interface FocusRoadmapItemModalProps {
  readonly state: FocusRoadmapItemModalState
  readonly onClose: () => void
  readonly onSave: (item: FocusRoadmapItemModalState['item']) => void
}

export function FocusRoadmapItemModal({
  state,
  onClose,
  onSave,
}: FocusRoadmapItemModalProps): React.JSX.Element {
  const [item, setItem] = useState(state.item)

  const handleSave = useCallback(() => {
    onSave(item)
  }, [item, onSave])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-[90%] max-w-[480px] rounded-[14px] border border-border bg-card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-[22px] font-medium">
          {state.isNew ? 'Add' : 'Edit'} roadmap item
        </h3>

        <div className="flex flex-col gap-4">
          <AdminFormField label="Title">
            <input
              className={adminInputClassName}
              value={item.title}
              onChange={(e) => setItem((current) => ({ ...current, title: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Note">
            <textarea
              className={adminTextareaClassName}
              rows={3}
              value={item.note}
              onChange={(e) => setItem((current) => ({ ...current, note: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Status dot">
            <select
              className={adminInputClassName}
              value={item.dot}
              onChange={(e) => setItem((current) => ({ ...current, dot: e.target.value }))}
            >
              {DOT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </AdminFormField>
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
