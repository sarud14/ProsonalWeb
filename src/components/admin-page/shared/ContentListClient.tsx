'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import {
  deleteEngineering,
  publishEngineering,
  unpublishEngineering,
} from '@/actions/engineering.actions'
import {
  deleteJournal,
  publishJournal,
  unpublishJournal,
} from '@/actions/journal.actions'
import { deleteWork, publishWork, unpublishWork } from '@/actions/work.actions'
import type { DataTableColumn, DataTableRow } from '@/components/ui/DataTable'
import { DataTable } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import type { AdminContentListConfig } from '@/types/admin-content.types'

interface ContentListClientProps {
  readonly config: AdminContentListConfig
  readonly columns: readonly DataTableColumn[]
  readonly rows: readonly DataTableRow[]
}

export function ContentListClient({
  config,
  columns,
  rows,
}: ContentListClientProps): React.JSX.Element {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showError = useCallback((error: string) => {
    setToast(error)
  }, [])

  const handleEdit = useCallback(
    (id: string) => {
      router.push(config.editHrefTemplate.replace('{id}', id))
    },
    [config.editHrefTemplate, router]
  )

  const handleTogglePublish = useCallback(
    async (id: string) => {
      const row = rows.find((item) => item.id === id)
      if (!row) return

      const action =
        row.status === 'PUBLISHED'
          ? config.section === 'work'
            ? unpublishWork
            : config.section === 'journal'
              ? unpublishJournal
              : unpublishEngineering
          : config.section === 'work'
            ? publishWork
            : config.section === 'journal'
              ? publishJournal
              : publishEngineering

      const result = await action(id)
      if (!result.success) {
        showError(result.error)
        return
      }

      router.refresh()
    },
    [config.section, rows, router, showError]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return

    const action =
      config.section === 'work'
        ? deleteWork
        : config.section === 'journal'
          ? deleteJournal
          : deleteEngineering

    const result = await action(deleteId)
    setDeleteId(null)

    if (!result.success) {
      showError(result.error)
      return
    }

    router.refresh()
  }, [config.section, deleteId, router, showError])

  return (
    <>
      <SectionHeading
        kicker={config.kicker}
        title={config.title}
        action={
          <Link
            href={config.newHref}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-[18px] py-[11px] text-[13px] font-semibold text-primary-foreground"
          >
            <span className="font-mono">+</span>
            {config.newLabel}
          </Link>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        gridTemplate={config.gridTemplate}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onDelete={setDeleteId}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete item?"
        body="This cannot be undone. A revision snapshot will be saved."
        confirmLabel="Delete"
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteId(null)}
      />

      <Toast
        message={toast ?? ''}
        open={toast !== null}
        onClose={() => setToast(null)}
      />
    </>
  )
}
