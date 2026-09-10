'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { StackGroupModal } from '@/features/admin-pages/StackGroupModal'
import { ReorderableList, SectionHeading, Toast } from '@/components/ui'
import { moveItemByClientId, omitClientIds } from '@/lib/admin/client-list'
import type {
  ClientStackGroup,
  StackGroupModalState,
  StackPageEditorProps,
} from '@/types/admin-pages.types'
import type { StackGroup } from '@/types/stack.types'

import { toClientGroups, toPersistableGroups } from './query/stackPageQuery'

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
        groups: toPersistableGroups(nextGroups),
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
      const swapped = moveItemByClientId(groups, id, direction)
      if (!swapped) return

      const normalized = toClientGroups(omitClientIds(swapped))
      setGroups(normalized)
      void persist(normalized)
    },
    [groups, persist]
  )

  const handleSaveGroup = useCallback(
    (group: StackGroup) => {
      const next = modal?.isNew
        ? toClientGroups([...omitClientIds(groups), group])
        : toClientGroups(
            omitClientIds(
              groups.map((item) =>
                modal?.groupId && item.clientId === modal.groupId
                  ? { ...item, ...group }
                  : item
              )
            )
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
            omitClientIds(groups.filter((group) => group.clientId !== id))
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
