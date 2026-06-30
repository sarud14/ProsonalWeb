'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { StackGroupModal } from '@/components/admin-page/Pages/StackGroupModal'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import type { StackGroupModalState, StackPageEditorProps } from '@/types/admin-pages.types'
import type { StackGroup } from '@/types/stack.types'

interface ClientStackGroup extends StackGroup {
  readonly clientId: string
}

function toClientGroups(groups: readonly StackGroup[]): ClientStackGroup[] {
  return groups.map((group, index) => ({
    ...group,
    clientId: `group-${group.label}-${index}`,
  }))
}

export function StackPageEditor({ initialData }: StackPageEditorProps): React.JSX.Element {
  const router = useRouter()
  const [groups, setGroups] = useState<readonly ClientStackGroup[]>(() =>
    toClientGroups(initialData.groups)
  )
  const [modal, setModal] = useState<StackGroupModalState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const listItems = useMemo(
    () =>
      groups.map((group) => ({
        id: group.clientId,
        primary: group.label,
        secondary: `${group.tools.length} tool${group.tools.length === 1 ? '' : 's'}`,
        bullets: group.tools.slice(0, 3).map((tool) => `${tool.name} — ${tool.note}`),
      })),
    [groups]
  )

  const persist = useCallback(
    async (nextGroups: readonly ClientStackGroup[]) => {
      setIsSaving(true)
      const payload = {
        groups: nextGroups.map(({ clientId: _id, ...group }) => group),
      }
      const result = await updatePage({ key: 'stack', data: payload })
      setIsSaving(false)

      if (!result.success) {
        setToast(result.error)
        return
      }

      router.refresh()
    },
    [router]
  )

  const handleMove = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const index = groups.findIndex((group) => group.clientId === id)
      if (index < 0) return

      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= groups.length) return

      const next = [...groups]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      const normalized = toClientGroups(next.map(({ clientId: _id, ...group }) => group))
      setGroups(normalized)
      void persist(normalized)
    },
    [groups, persist]
  )

  const handleSaveGroup = useCallback(
    (group: StackGroup) => {
      const next = modal?.isNew
        ? toClientGroups([...groups.map(({ clientId: _id, ...item }) => item), group])
        : toClientGroups(
            groups.map((item) =>
              modal?.groupId && item.clientId === modal.groupId
                ? { ...item, ...group }
                : item
            ).map(({ clientId: _id, ...item }) => item)
          )

      setGroups(next)
      setModal(null)
      void persist(next)
    },
    [groups, modal, persist]
  )

  return (
    <div>
      <SectionHeading kicker="Page editor" title="Stack" />

      <p className="mb-4 text-[13px] text-muted-foreground">
        Tool groups shown on the public stack page — reorder or edit each group.
      </p>

      <ReorderableList
        label="Groups"
        items={listItems}
        onMoveUp={(id) => handleMove(id, 'up')}
        onMoveDown={(id) => handleMove(id, 'down')}
        onRemove={(id) => {
          const next = toClientGroups(
            groups.filter((group) => group.clientId !== id).map(({ clientId: _id, ...group }) => group)
          )
          setGroups(next)
          void persist(next)
        }}
        onAdd={() =>
          setModal({
            isNew: true,
            group: { label: '', tools: [{ name: '', note: '' }] },
          })
        }
        renderExtra={(item) => (
          <button
            type="button"
            onClick={() => {
              const group = groups.find((entry) => entry.clientId === item.id)
              if (group) {
                const { clientId, ...rest } = group
                setModal({ isNew: false, group: rest, groupId: clientId })
              }
            }}
            className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
          >
            Edit group
          </button>
        )}
      />

      {modal && (
        <StackGroupModal
          key={modal.groupId ?? 'new-group'}
          state={modal}
          onClose={() => setModal(null)}
          onSave={handleSaveGroup}
        />
      )}

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />

      {isSaving && (
        <p className="mt-4 text-xs text-muted-foreground">Saving…</p>
      )}
    </div>
  )
}
