'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { createDomain, deleteDomain, updateDomain } from '@/actions/taxonomy.actions'
import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { InlineEditRow } from '@/components/ui/InlineEditRow'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import type { TaxonomyPageViewProps } from '@/types/admin-taxonomy.types'

export function TaxonomyPageView({ initialDomains }: TaxonomyPageViewProps): React.JSX.Element {
  const router = useRouter()
  const [newLabel, setNewLabel] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const showError = useCallback((message: string) => {
    setToast(message)
  }, [])

  const handleAdd = useCallback(async () => {
    const label = newLabel.trim()
    if (!label) return

    setIsAdding(true)
    const nextOrder =
      initialDomains.length > 0
        ? Math.max(...initialDomains.map((domain) => domain.sortOrder)) + 1
        : 0

    const result = await createDomain({ label, sortOrder: nextOrder })
    setIsAdding(false)

    if (!result.success) {
      showError(result.error)
      return
    }

    setNewLabel('')
    router.refresh()
  }, [initialDomains, newLabel, router, showError])

  const handleLabelChange = useCallback(
    async (id: string, label: string) => {
      const result = await updateDomain({ id, label })
      if (!result.success) {
        showError(result.error)
        return
      }
      router.refresh()
    },
    [router, showError]
  )

  const handleDelete = useCallback(async () => {
    if (!deleteId) return

    const result = await deleteDomain(deleteId)
    if (!result.success) {
      showError(result.error)
      setDeleteId(null)
      return
    }

    setDeleteId(null)
    router.refresh()
  }, [deleteId, router, showError])

  return (
    <div>
      <SectionHeading kicker="Filters" title="Taxonomy" />

      <p className="mb-6 text-[13px] text-muted-foreground">
        Work case study domains — used as filter chips on the public work page.
      </p>

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-[18px] border-b border-border/50 pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Add domain
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <AdminFormField label="Label">
              <input
                className={adminInputClassName}
                value={newLabel}
                placeholder="e.g. Platform"
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleAdd()
                }}
              />
            </AdminFormField>
          </div>
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={isAdding || !newLabel.trim()}
            className="cursor-pointer rounded-lg bg-primary px-[18px] py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_90px_80px_44px] items-center border-b border-border bg-[oklch(0.13_0.008_255)] px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Label
          </span>
          <span className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Order
          </span>
          <span className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Used by
          </span>
          <span />
        </div>

        {initialDomains.length === 0 ? (
          <p className="py-10 text-center text-sm italic text-muted-foreground">
            No domains yet.
          </p>
        ) : (
          initialDomains.map((domain) => (
            <InlineEditRow
              key={domain.id}
              id={domain.id}
              label={domain.label}
              sortOrder={domain.sortOrder}
              referenceCount={domain.referenceCount}
              onLabelChange={(id, label) => void handleLabelChange(id, label)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete domain?"
        body="Only unused domains can be deleted. Work case studies still tagged with this domain must be updated first."
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
      />

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
