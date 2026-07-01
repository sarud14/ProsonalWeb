'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { LandingBlockModal } from '@/components/admin-page/Pages/LandingBlockModal'
import { LandingHeroEditor } from '@/components/admin-page/Pages/LandingHeroEditor'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import {
  assignLandingBlockOrders,
  LANDING_BLOCK_TYPES,
  normalizeLandingBlockOrders,
} from '@/constants/admin-pages'
import {
  getDefaultLandingBlockProps,
} from '@/lib/admin/landing-block-props'
import {
  getLandingBlockHeadline,
  getLandingBlockSubline,
} from '@/lib/admin/page-section-defaults'
import type { LandingBlockModalState, LandingPageEditorProps } from '@/types/admin-pages.types'
import type { LandingBlock } from '@/types/site.types'
import type { LandingHeroData } from '@/types/landing.types'

interface ClientLandingBlock extends LandingBlock {
  readonly clientId: string
}

function toClientBlocks(blocks: readonly LandingBlock[]): ClientLandingBlock[] {
  return normalizeLandingBlockOrders(blocks).map((block, index) => ({
    ...block,
    clientId: `${block.type}-${block.order}-${index}`,
  }))
}

export function LandingPageEditor({
  initialData,
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
        blocks: assignLandingBlockOrders(
          nextBlocks.map(({ clientId: _id, ...block }) => block)
        ),
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
      const index = blocks.findIndex((block) => block.clientId === id)
      if (index < 0) return

      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= blocks.length) return

      const next = [...blocks]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      const normalized = toClientBlocks(
        assignLandingBlockOrders(next.map(({ clientId: _id, ...block }) => block))
      )
      setBlocks(normalized)
      void persistBlocks(normalized)
    },
    [blocks, persistBlocks]
  )

  const handleRemove = useCallback(
    (id: string) => {
      const next = toClientBlocks(
        blocks
          .filter((block) => block.clientId !== id)
          .map(({ clientId: _id, ...block }) => block)
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
            ...blocks.map(({ clientId: _id, ...item }) => item),
            { ...block, order: blocks.length },
          ])
        : toClientBlocks(
            blocks
              .map((item) =>
                modal?.clientId && item.clientId === modal.clientId ? { ...item, ...block } : item
              )
              .map(({ clientId: _id, ...item }) => item)
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

      <LandingHeroEditor hero={hero} isSaving={isSaving} onSave={handleSaveHero} />

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
