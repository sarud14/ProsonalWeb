'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import {
  archiveContact,
  deleteContact,
  markContactRead,
} from '@/actions/contact.actions'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import { ADMIN_MESSAGE_FILTERS, type AdminMessageFilterKey } from '@/constants/admin-messages'
import { formatMessageDate } from '@/lib/admin/contact-message-mappers'
import { cn } from '@/lib/utils'
import type { MessagesPageViewProps } from '@/types/admin-messages.types'

export function MessagesPageView({
  initialMessages,
}: MessagesPageViewProps): React.JSX.Element {
  const router = useRouter()
  const [filter, setFilter] = useState<AdminMessageFilterKey>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showError = useCallback((message: string) => {
    setToast(message)
  }, [])

  const filteredMessages = useMemo(() => {
    switch (filter) {
      case 'unread':
        return initialMessages.filter((message) => !message.read && !message.archived)
      case 'archived':
        return initialMessages.filter((message) => message.archived)
      default:
        return initialMessages.filter((message) => !message.archived)
    }
  }, [filter, initialMessages])

  const handleMarkRead = useCallback(
    async (id: string) => {
      const result = await markContactRead(id)
      if (!result.success) {
        showError(result.error)
        return
      }
      router.refresh()
    },
    [router, showError]
  )

  const handleArchive = useCallback(
    async (id: string) => {
      const result = await archiveContact(id)
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

    const result = await deleteContact(deleteId)
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
      <SectionHeading kicker="Inbox" title="Messages" />

      <div className="mb-5 flex gap-1 border-b border-border">
        {ADMIN_MESSAGE_FILTERS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'cursor-pointer border-b-2 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em]',
              filter === tab.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filteredMessages.length === 0 ? (
          <p className="py-12 text-center text-sm italic text-muted-foreground">
            No messages in this view.
          </p>
        ) : (
          filteredMessages.map((message) => {
            const isExpanded = expandedId === message.id
            const preview =
              message.message.length > 120
                ? `${message.message.slice(0, 120)}…`
                : message.message

            return (
              <div
                key={message.id}
                className={cn(
                  'border-b border-border/50 px-5 py-4 last:border-b-0',
                  !message.read && !message.archived && 'bg-primary/5'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : message.id)}
                    className="min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{message.name}</span>
                      <span className="text-xs text-muted-foreground">{message.email}</span>
                      {!message.read && !message.archived && (
                        <span className="rounded-md bg-primary px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary-foreground">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[13px] text-muted-foreground">
                      {isExpanded ? message.message : preview}
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                      {formatMessageDate(message.createdAt)}
                    </div>
                  </button>

                  <div className="flex shrink-0 gap-2">
                    {!message.read && !message.archived && (
                      <button
                        type="button"
                        onClick={() => void handleMarkRead(message.id)}
                        className="cursor-pointer rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold"
                      >
                        Mark read
                      </button>
                    )}
                    {!message.archived && (
                      <button
                        type="button"
                        onClick={() => void handleArchive(message.id)}
                        className="cursor-pointer rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteId(message.id)}
                      className="cursor-pointer rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete message?"
        body="This permanently removes the message from your inbox."
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
      />

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
