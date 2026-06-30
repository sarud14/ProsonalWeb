'use client'

import { useCallback, useState } from 'react'

import type { LandingBlockModalState } from '@/types/admin-pages.types'
import type { LandingBlock } from '@/types/site.types'

import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'

interface LandingBlockModalProps {
  readonly state: LandingBlockModalState
  readonly onClose: () => void
  readonly onSave: (block: LandingBlock) => void
}

export function LandingBlockModal({
  state,
  onClose,
  onSave,
}: LandingBlockModalProps): React.JSX.Element {
  const [block, setBlock] = useState<LandingBlock>(state.block)
  const [propsJson, setPropsJson] = useState(() =>
    JSON.stringify(state.block.props, null, 2)
  )
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(() => {
    try {
      const props = JSON.parse(propsJson) as Record<string, unknown>
      onSave({ ...block, props })
    } catch {
      setError('Props must be valid JSON')
    }
  }, [block, onSave, propsJson])

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
          {state.isNew ? 'Add' : 'Edit'} block — {block.type}
        </h3>

        <div className="flex flex-col gap-4">
          <AdminFormField label="Type">
            <input className={adminInputClassName} value={block.type} readOnly />
          </AdminFormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={block.enabled}
              onChange={(e) => setBlock((current) => ({ ...current, enabled: e.target.checked }))}
            />
            Enabled on landing page
          </label>
          <AdminFormField label="Props (JSON)">
            <textarea
              className={adminTextareaClassName}
              rows={12}
              value={propsJson}
              onChange={(e) => {
                setPropsJson(e.target.value)
                setError(null)
              }}
            />
          </AdminFormField>
          {error && <p className="text-sm text-primary">{error}</p>}
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
