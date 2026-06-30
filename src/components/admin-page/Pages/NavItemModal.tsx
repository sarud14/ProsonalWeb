'use client'

import { useCallback, useState } from 'react'

import type { NavItemModalState, NavItemDraft } from '@/types/admin-pages.types'

import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'

interface NavItemModalProps {
  readonly state: NavItemModalState
  readonly onClose: () => void
  readonly onSave: (item: NavItemModalState['item']) => void
}

export function NavItemModal({
  state,
  onClose,
  onSave,
}: NavItemModalProps): React.JSX.Element {
  const [item, setItem] = useState<NavItemDraft>(state.item)

  const handleSave = useCallback(() => {
    onSave(item)
  }, [item, onSave])

  const updateItem = useCallback(
    (patch: Partial<NavItemDraft>) => {
      setItem((current) => ({ ...current, ...patch }))
    },
    []
  )

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
          {state.isNew ? 'Add' : 'Edit'} nav item
        </h3>

        <div className="flex flex-col gap-4">
          <AdminFormField label="Key">
            <input
              className={adminInputClassName}
              value={item.key}
              onChange={(e) => updateItem({ key: e.target.value })}
              readOnly={!state.isNew}
            />
          </AdminFormField>
          <AdminFormField label="Label">
            <input
              className={adminInputClassName}
              value={item.label}
              onChange={(e) => updateItem({ label: e.target.value })}
            />
          </AdminFormField>
          <AdminFormField label="Href">
            <input
              className={adminInputClassName}
              value={item.href}
              onChange={(e) => updateItem({ href: e.target.value })}
            />
          </AdminFormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => updateItem({ enabled: e.target.checked })}
            />
            Visible in navigation
          </label>
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
