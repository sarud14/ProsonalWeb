'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { LandingBlockModal } from '@/features/admin-pages/LandingBlockModal'
import { LandingHeroEditor } from '@/features/admin-pages/LandingHeroEditor'
import { ReorderableList, SectionHeading, Toast } from '@/components/ui'
import { LANDING_BLOCK_TYPES } from '@/constants/admin-pages'
import { moveItemByClientId, omitClientIds } from '@/lib/admin/client-list'
import {
  getDefaultLandingBlockProps,
} from '@/lib/admin/landing-block-props'
import {
  getLandingBlockHeadline,
  getLandingBlockSubline,
} from '@/lib/admin/page-section-defaults'
import type {
  ClientLandingBlock,
  LandingBlockModalState,
  LandingPageEditorProps,
} from '@/types/admin-pages.types'
import type { LandingBlock } from '@/types/site.types'
import type { LandingHeroData } from '@/types/landing.types'

import { toClientBlocks, toPersistableBlocks } from './query/landingPageQuery'

export function LandingPageEditor({
  initialData,
  media,
  uploadEnabled,
}: LandingPageEditorProps): React.JSX.Element {
  const router = useRouter()
  const [blocks, setBlocks] = useState<readonly ClientLandingBlock[]>(() =>
    toClientBlocks(initialData.blocks)
  )
  const [hero, setHero] = useState<LandingHeroData>(initialData.hero)
  const [modal, setModal] = useState<LandingBlockModalState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const listItems = useMemo(
    () =>
      blocks.map((block) => ({
        id: block.clientId,
        primary: getLandingBlockHeadline(block),
        secondary: getLandingBlockSubline(block),
        meta: (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-primary">
            {block.type}
          </span>
        ),
      })),
    [blocks]
  )

  const persist = useCallback(
    async (nextHero: LandingHeroData, nextBlocks: readonly ClientLandingBlock[]) => {
      setIsSaving(true)
      const payload = {
        hero: nextHero,
        blocks: toPersistableBlocks(nextBlocks),
      }
      const result = await updatePage({ key: 'landing', data: payload })
      setIsSaving(false)

      if (!result.success) {
        setToast(result.error)
        return
      }

      setHero(nextHero)
      router.refresh()
    },
    [router]
  )

  const persistBlocks = useCallback(
    async (nextBlocks: readonly ClientLandingBlock[]) => {
      await persist(hero, nextBlocks)
    },
    [hero, persist]
  )

  const handleSaveHero = useCallback(
    (nextHero: LandingHeroData) => {
      void persist(nextHero, blocks)
    },
    [blocks, persist]
  )

  const handleMove = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const swapped = moveItemByClientId(blocks, id, direction)
      if (!swapped) return

      const normalized = toClientBlocks(toPersistableBlocks(swapped))
      setBlocks(normalized)
      void persistBlocks(normalized)
    },
    [blocks, persistBlocks]
  )

  const handleRemove = useCallback(
    (id: string) => {
      const next = toClientBlocks(
        omitClientIds(blocks.filter((block) => block.clientId !== id))
      )
      setBlocks(next)
      void persistBlocks(next)
    },
    [blocks, persistBlocks]
  )

  const handleAddBlock = useCallback(() => {
    const typeDef = LANDING_BLOCK_TYPES[0]
    if (!typeDef) return

    setModal({
      isNew: true,
      block: {
        type: typeDef.value,
        enabled: true,
        order: blocks.length,
        props: getDefaultLandingBlockProps(typeDef.value),
      },
    })
  }, [blocks.length])

  const handleSaveBlock = useCallback(
    (block: LandingBlock) => {
      const next = modal?.isNew
        ? toClientBlocks([
            ...omitClientIds(blocks),
            { ...block, order: blocks.length },
          ])
        : toClientBlocks(
            omitClientIds(
              blocks.map((item) =>
                modal?.clientId && item.clientId === modal.clientId ? { ...item, ...block } : item
              )
            )
          )

      setBlocks(next)
      setModal(null)
      void persistBlocks(next)
    },
    [blocks, modal, persistBlocks]
  )

  return (
    <div>
      <SectionHeading kicker="Page editor" title="Landing" />

      <LandingHeroEditor
        hero={hero}
        media={media}
        uploadEnabled={uploadEnabled}
        isSaving={isSaving}
        onSave={handleSaveHero}
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          Ordered content blocks — each renders on the public landing page.
        </p>
        <button
          type="button"
          onClick={handleAddBlock}
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-primary px-[15px] py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          + Add block
        </button>
      </div>

      <ReorderableList
        label="Blocks"
        items={listItems}
        onMoveUp={(id) => handleMove(id, 'up')}
        onMoveDown={(id) => handleMove(id, 'down')}
        onRemove={handleRemove}
        onAdd={handleAddBlock}
        renderExtra={(item) => (
          <button
            type="button"
            onClick={() => {
              const block = blocks.find((entry) => entry.clientId === item.id)
              if (block) {
                const { clientId, ...rest } = block
                setModal({ block: rest, isNew: false, clientId })
              }
            }}
            className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
          >
            Edit
          </button>
        )}
      />

      {modal && (
        <LandingBlockModal
          key={`${modal.block.type}-${modal.block.order}-${modal.isNew}`}
          state={modal}
          onClose={() => setModal(null)}
          onSave={handleSaveBlock}
        />
      )}

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
