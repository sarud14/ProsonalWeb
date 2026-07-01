'use client'

import { useCallback, useState } from 'react'

import { LandingBlockPropsEditor } from '@/components/admin-page/Pages/LandingBlockPropsEditor'
import type { LandingBlockModalState } from '@/types/admin-pages.types'
import type { LandingBlock } from '@/types/site.types'

import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { LANDING_BLOCK_TYPES } from '@/constants/admin-pages'
import {
  getDefaultLandingBlockProps,
  landingBlockTypeLabel,
  type LandingBlockType,
} from '@/lib/admin/landing-block-props'

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

  const handleTypeChange = useCallback((nextType: LandingBlockType) => {
    setBlock((current) => ({
      ...current,
      type: nextType,
      props: getDefaultLandingBlockProps(nextType),
    }))
  }, [])

  const handleSave = useCallback(() => {
    onSave(block)
  }, [block, onSave])

  const typeLabel = landingBlockTypeLabel(block.type)

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[85vh] w-[90%] max-w-[640px] overflow-y-auto rounded-[14px] border border-border bg-card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-[22px] font-medium">
          {state.isNew ? 'Add' : 'Edit'} landing block
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          {state.isNew
            ? 'Choose a section type and fill in the fields below.'
            : `Editing “${typeLabel}” section.`}
        </p>

        <div className="flex flex-col gap-5">
          <AdminFormField label="Section type">
            {state.isNew ? (
              <select
                className={adminInputClassName}
                value={block.type}
                onChange={(e) => handleTypeChange(e.target.value as LandingBlockType)}
              >
                {LANDING_BLOCK_TYPES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            ) : (
              <input className={adminInputClassName} value={typeLabel} readOnly />
            )}
          </AdminFormField>

          <label className="flex items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={block.enabled}
              onChange={(e) =>
                setBlock((current) => ({ ...current, enabled: e.target.checked }))
              }
            />
            Show on landing page
          </label>

          <LandingBlockPropsEditor
            type={block.type}
            props={block.props}
            onChange={(props) => setBlock((current) => ({ ...current, props }))}
          />
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
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
