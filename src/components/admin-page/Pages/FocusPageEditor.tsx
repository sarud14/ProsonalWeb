'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { FocusReadingModal } from '@/components/admin-page/Pages/FocusReadingModal'
import { FocusRoadmapItemModal } from '@/components/admin-page/Pages/FocusRoadmapItemModal'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'
import { FOCUS_ROADMAP_DOT } from '@/constants/focus'
import type { FocusRoadmapDot } from '@/constants/focus'
import { getReorderedPair } from '@/lib/admin/reorder-sort-items'
import type {
  FocusPageEditorProps,
  FocusReadingModalState,
  FocusRoadmapItemModalState,
} from '@/types/admin-pages.types'
import type { FocusPageData, FocusReadingItem, FocusRoadmapItem } from '@/types/focus.types'

interface ClientReadingItem extends FocusReadingItem {
  readonly clientId: string
}

function toClientReading(items: readonly FocusReadingItem[]): ClientReadingItem[] {
  return items.map((item, index) => ({
    ...item,
    clientId: `reading-${item.idx}-${index}`,
  }))
}

function roadmapItemId(columnIndex: number, itemIndex: number): string {
  return `roadmap-${columnIndex}-${itemIndex}`
}

function toRoadmapDot(value: string): FocusRoadmapDot {
  if (value === FOCUS_ROADMAP_DOT.QUEUED) return FOCUS_ROADMAP_DOT.QUEUED
  if (value === FOCUS_ROADMAP_DOT.EXPLORING) return FOCUS_ROADMAP_DOT.EXPLORING
  return FOCUS_ROADMAP_DOT.ACTIVE
}

export function FocusPageEditor({ initialData }: FocusPageEditorProps): React.JSX.Element {
  const router = useRouter()
  const [data, setData] = useState<FocusPageData>(initialData)
  const [reading, setReading] = useState<readonly ClientReadingItem[]>(() =>
    toClientReading(initialData.reading)
  )
  const [readingModal, setReadingModal] = useState<FocusReadingModalState | null>(null)
  const [roadmapModal, setRoadmapModal] = useState<FocusRoadmapItemModalState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const readingListItems = useMemo(
    () =>
      reading.map((item) => ({
        id: item.clientId,
        primary: item.title,
        secondary: item.idx,
      })),
    [reading]
  )

  const persist = useCallback(
    async (next: FocusPageData) => {
      setIsSaving(true)
      const result = await updatePage({ key: 'focus', data: next })
      setIsSaving(false)

      if (!result.success) {
        setToast(result.error)
        return
      }

      router.refresh()
    },
    [router]
  )

  const handleSave = useCallback(() => {
    void persist({
      ...data,
      reading: reading.map(({ clientId: _id, ...item }) => item),
    })
  }, [data, persist, reading])

  const handleReadingMove = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const index = reading.findIndex((item) => item.clientId === id)
      if (index < 0) return

      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= reading.length) return

      const next = [...reading]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      setReading(next)
    },
    [reading]
  )

  const handleSaveReading = useCallback(
    (item: FocusReadingItem) => {
      if (readingModal?.isNew) {
        setReading((current) => [
          ...current,
          { ...item, clientId: `reading-${item.idx}-${Date.now()}` },
        ])
      } else if (readingModal?.itemId) {
        setReading((current) =>
          current.map((entry) =>
            entry.clientId === readingModal.itemId ? { ...entry, ...item } : entry
          )
        )
      }
      setReadingModal(null)
    },
    [readingModal]
  )

  const handleRoadmapMove = useCallback(
    (columnIndex: number, itemId: string, direction: 'up' | 'down') => {
      const column = data.roadmap[columnIndex]
      if (!column) return

      const items = column.items.map((item, index) => ({
        id: roadmapItemId(columnIndex, index),
        sortOrder: index,
        item,
      }))

      const pair = getReorderedPair(items, itemId, direction)
      if (!pair) return

      const [current, adjacent] = pair
      const currentIndex = items.findIndex((entry) => entry.id === current.id)
      const adjacentIndex = items.findIndex((entry) => entry.id === adjacent.id)
      const nextItems = [...column.items]
      ;[nextItems[currentIndex], nextItems[adjacentIndex]] = [
        nextItems[adjacentIndex],
        nextItems[currentIndex],
      ]

      setData((current) => ({
        ...current,
        roadmap: current.roadmap.map((col, index) =>
          index === columnIndex ? { ...col, items: nextItems } : col
        ),
      }))
    },
    [data.roadmap]
  )

  const handleSaveRoadmapItem = useCallback(
    (item: FocusRoadmapItemModalState['item']) => {
      if (!roadmapModal) return

      const roadmapItem: FocusRoadmapItem = {
        title: item.title,
        note: item.note,
        dot: toRoadmapDot(item.dot),
      }

      setData((current) => ({
        ...current,
        roadmap: current.roadmap.map((column, columnIndex) => {
          if (columnIndex !== roadmapModal.columnIndex) return column

          if (roadmapModal.isNew) {
            return { ...column, items: [...column.items, roadmapItem] }
          }

          const itemIndex = roadmapModal.itemId
            ? Number(roadmapModal.itemId.split('-').pop())
            : -1

          if (itemIndex < 0) return column

          return {
            ...column,
            items: column.items.map((entry, index) =>
              index === itemIndex ? roadmapItem : entry
            ),
          }
        }),
      }))
      setRoadmapModal(null)
    },
    [roadmapModal]
  )

  return (
    <div>
      <SectionHeading kicker="Page editor" title="Focus" />

      <div className="flex flex-col gap-6">
        <FormSection label="Header" columns="1fr">
          <AdminFormField label="Updated label">
            <input
              className={adminInputClassName}
              value={data.updatedLabel}
              onChange={(e) => setData((current) => ({ ...current, updatedLabel: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Topic">
            <input
              className={adminInputClassName}
              value={data.topic}
              onChange={(e) => setData((current) => ({ ...current, topic: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Intro">
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={data.intro}
              onChange={(e) => setData((current) => ({ ...current, intro: e.target.value }))}
            />
          </AdminFormField>
        </FormSection>

        {data.roadmap.map((column, columnIndex) => (
          <div key={`${column.phase}-${columnIndex}`} className="flex flex-col gap-3">
            <FormSection label={`Roadmap — ${column.phase}`} columns="1fr 1fr">
              <AdminFormField label="Phase">
                <input
                  className={adminInputClassName}
                  value={column.phase}
                  onChange={(e) =>
                    setData((current) => ({
                      ...current,
                      roadmap: current.roadmap.map((col, index) =>
                        index === columnIndex ? { ...col, phase: e.target.value } : col
                      ),
                    }))
                  }
                />
              </AdminFormField>
              <AdminFormField label="Tag">
                <input
                  className={adminInputClassName}
                  value={column.tag}
                  onChange={(e) =>
                    setData((current) => ({
                      ...current,
                      roadmap: current.roadmap.map((col, index) =>
                        index === columnIndex ? { ...col, tag: e.target.value } : col
                      ),
                    }))
                  }
                />
              </AdminFormField>
            </FormSection>

            <ReorderableList
              label={`${column.phase} items`}
              items={column.items.map((item, itemIndex) => ({
                id: roadmapItemId(columnIndex, itemIndex),
                primary: item.title,
                secondary: item.note,
                meta: (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-primary">
                    {item.dot}
                  </span>
                ),
              }))}
              onMoveUp={(id) => handleRoadmapMove(columnIndex, id, 'up')}
              onMoveDown={(id) => handleRoadmapMove(columnIndex, id, 'down')}
              onRemove={(id) => {
                const itemIndex = Number(id.split('-').pop())
                setData((current) => ({
                  ...current,
                  roadmap: current.roadmap.map((col, index) =>
                    index === columnIndex
                      ? { ...col, items: col.items.filter((_, idx) => idx !== itemIndex) }
                      : col
                  ),
                }))
              }}
              onAdd={() =>
                setRoadmapModal({
                  columnIndex,
                  isNew: true,
                  item: {
                    title: '',
                    note: '',
                    dot: FOCUS_ROADMAP_DOT.ACTIVE,
                  },
                })
              }
              renderExtra={(item) => (
                <button
                  type="button"
                  onClick={() => {
                    const itemIndex = Number(item.id.split('-').pop())
                    const entry = column.items[itemIndex]
                    if (entry) {
                      setRoadmapModal({
                        columnIndex,
                        isNew: false,
                        itemId: item.id,
                        item: { title: entry.title, note: entry.note, dot: entry.dot },
                      })
                    }
                  }}
                  className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
                >
                  Edit
                </button>
              )}
            />
          </div>
        ))}

        <FormSection label="Learning" columns="1fr">
          <TagInput
            tags={data.learning}
            onChange={(tags) => setData((current) => ({ ...current, learning: [...tags] }))}
          />
        </FormSection>

        <ReorderableList
          label="Reading list"
          items={readingListItems}
          onMoveUp={(id) => handleReadingMove(id, 'up')}
          onMoveDown={(id) => handleReadingMove(id, 'down')}
          onRemove={(id) => setReading((current) => current.filter((item) => item.clientId !== id))}
          onAdd={() =>
            setReadingModal({
              isNew: true,
              item: { idx: String(reading.length + 1).padStart(2, '0'), title: '' },
            })
          }
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = reading.find((r) => r.clientId === item.id)
                if (entry) {
                  const { clientId, ...rest } = entry
                  setReadingModal({ isNew: false, item: rest, itemId: clientId })
                }
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />
      </div>

      <div className="mt-7 flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-primary px-[22px] py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-50"
        >
          Save page
        </button>
      </div>

      {readingModal && (
        <FocusReadingModal
          key={readingModal.itemId ?? 'new-reading'}
          state={readingModal}
          onClose={() => setReadingModal(null)}
          onSave={handleSaveReading}
        />
      )}

      {roadmapModal && (
        <FocusRoadmapItemModal
          key={roadmapModal.itemId ?? `new-roadmap-${roadmapModal.columnIndex}`}
          state={roadmapModal}
          onClose={() => setRoadmapModal(null)}
          onSave={handleSaveRoadmapItem}
        />
      )}

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
