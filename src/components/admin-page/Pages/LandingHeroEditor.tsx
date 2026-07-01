'use client'

import { useCallback, useState } from 'react'

import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { TagInput } from '@/components/ui/TagInput'
import type { LandingFocusItem, LandingHeroData } from '@/types/landing.types'

interface ClientMetaItem extends LandingFocusItem {
  readonly clientId: string
}

interface LandingHeroEditorProps {
  readonly hero: LandingHeroData
  readonly isSaving: boolean
  readonly onSave: (hero: LandingHeroData) => void
}

function toClientMeta(items: readonly LandingFocusItem[]): ClientMetaItem[] {
  return items.map((item, index) => ({
    ...item,
    clientId: `meta-${item.label}-${index}`,
  }))
}

export function LandingHeroEditor({
  hero: initialHero,
  isSaving,
  onSave,
}: LandingHeroEditorProps): React.JSX.Element {
  const [hero, setHero] = useState<LandingHeroData>(initialHero)
  const [metaItems, setMetaItems] = useState<readonly ClientMetaItem[]>(() =>
    toClientMeta(initialHero.metaItems)
  )

  const handleSave = useCallback(() => {
    onSave({
      ...hero,
      metaItems: metaItems.map(({ clientId: _id, ...item }) => item),
    })
  }, [hero, metaItems, onSave])

  const handleMetaMove = useCallback((id: string, direction: 'up' | 'down') => {
    const index = metaItems.findIndex((item) => item.clientId === id)
    if (index < 0) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= metaItems.length) return

    const next = [...metaItems]
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setMetaItems(next)
  }, [metaItems])

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-medium">Hero</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Top-of-page headline, profile card, code snippet, and meta labels.
        </p>
      </div>

      <FormSection label="Eyebrow & title" columns="1fr 1fr">
        <AdminFormField label="Eyebrow label">
          <input
            className={adminInputClassName}
            value={hero.eyebrowLabel}
            onChange={(e) => setHero((current) => ({ ...current, eyebrowLabel: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Version tag">
          <input
            className={adminInputClassName}
            value={hero.eyebrowVersion}
            onChange={(e) => setHero((current) => ({ ...current, eyebrowVersion: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Title line 1">
          <input
            className={adminInputClassName}
            value={hero.titleLine1}
            onChange={(e) => setHero((current) => ({ ...current, titleLine1: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Title line 2">
          <input
            className={adminInputClassName}
            value={hero.titleLine2}
            onChange={(e) => setHero((current) => ({ ...current, titleLine2: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Title line 3 (muted)" span="1 / -1">
          <input
            className={adminInputClassName}
            value={hero.titleLine3}
            onChange={(e) => setHero((current) => ({ ...current, titleLine3: e.target.value }))}
          />
        </AdminFormField>
      </FormSection>

      <FormSection label="Intro & CTAs" columns="1fr">
        <AdminFormField label="Body text">
          <textarea
            className={adminTextareaClassName}
            rows={4}
            value={hero.body}
            onChange={(e) => setHero((current) => ({ ...current, body: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Highlighted terms">
          <TagInput
            tags={[...hero.bodyHighlights]}
            onChange={(tags) => setHero((current) => ({ ...current, bodyHighlights: [...tags] }))}
            placeholder="e.g. Next.js — press Enter"
          />
        </AdminFormField>
        <AdminFormField label="Primary CTA label">
          <input
            className={adminInputClassName}
            value={hero.primaryCtaLabel}
            onChange={(e) => setHero((current) => ({ ...current, primaryCtaLabel: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Primary CTA link">
          <input
            className={adminInputClassName}
            value={hero.primaryCtaHref}
            onChange={(e) => setHero((current) => ({ ...current, primaryCtaHref: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Secondary CTA label">
          <input
            className={adminInputClassName}
            value={hero.secondaryCtaLabel}
            onChange={(e) =>
              setHero((current) => ({ ...current, secondaryCtaLabel: e.target.value }))
            }
          />
        </AdminFormField>
        <AdminFormField label="Secondary CTA link">
          <input
            className={adminInputClassName}
            value={hero.secondaryCtaHref}
            onChange={(e) =>
              setHero((current) => ({ ...current, secondaryCtaHref: e.target.value }))
            }
          />
        </AdminFormField>
      </FormSection>

      <FormSection label="Profile card" columns="1fr 1fr">
        <AdminFormField label="Name">
          <input
            className={adminInputClassName}
            value={hero.profileName}
            onChange={(e) => setHero((current) => ({ ...current, profileName: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Subtitle">
          <input
            className={adminInputClassName}
            value={hero.profileSubtitle}
            onChange={(e) => setHero((current) => ({ ...current, profileSubtitle: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Status label">
          <input
            className={adminInputClassName}
            value={hero.profileStatus}
            onChange={(e) => setHero((current) => ({ ...current, profileStatus: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Image URL (optional)">
          <input
            className={adminInputClassName}
            value={hero.profileImageUrl ?? ''}
            placeholder="https://… or /uploads/…"
            onChange={(e) => {
              const value = e.target.value.trim()
              setHero((current) => ({
                ...current,
                profileImageUrl: value.length > 0 ? value : null,
              }))
            }}
          />
        </AdminFormField>
        <AdminFormField label="Image alt text" span="1 / -1">
          <input
            className={adminInputClassName}
            value={hero.profileImageAlt}
            onChange={(e) => setHero((current) => ({ ...current, profileImageAlt: e.target.value }))}
          />
        </AdminFormField>
      </FormSection>

      <FormSection label="Code snippet" columns="1fr 1fr">
        <AdminFormField label="Filename">
          <input
            className={adminInputClassName}
            value={hero.codeFilename}
            onChange={(e) => setHero((current) => ({ ...current, codeFilename: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Role">
          <input
            className={adminInputClassName}
            value={hero.codeRole}
            onChange={(e) => setHero((current) => ({ ...current, codeRole: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Stack" span="1 / -1">
          <TagInput
            tags={[...hero.codeStack]}
            onChange={(tags) => setHero((current) => ({ ...current, codeStack: [...tags] }))}
          />
        </AdminFormField>
        <AdminFormField label="Domains" span="1 / -1">
          <TagInput
            tags={[...hero.codeDomains]}
            onChange={(tags) => setHero((current) => ({ ...current, codeDomains: [...tags] }))}
          />
        </AdminFormField>
        <AdminFormField label="Focus">
          <input
            className={adminInputClassName}
            value={hero.codeFocus}
            onChange={(e) => setHero((current) => ({ ...current, codeFocus: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Status value">
          <input
            className={adminInputClassName}
            value={hero.codeStatus}
            onChange={(e) => setHero((current) => ({ ...current, codeStatus: e.target.value }))}
          />
        </AdminFormField>
      </FormSection>

      <ReorderableList
        label="Meta labels (Focus / Base / Lang)"
        items={metaItems.map((item) => ({
          id: item.clientId,
          primary: item.label,
          secondary: item.value,
        }))}
        onMoveUp={(id) => handleMetaMove(id, 'up')}
        onMoveDown={(id) => handleMetaMove(id, 'down')}
        onRemove={(id) => setMetaItems((current) => current.filter((item) => item.clientId !== id))}
        onAdd={() =>
          setMetaItems((current) => [
            ...current,
            { clientId: `meta-new-${Date.now()}`, label: '', value: '' },
          ])
        }
        renderExtra={(item) => (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              className={adminInputClassName}
              value={metaItems.find((entry) => entry.clientId === item.id)?.label ?? ''}
              placeholder="Label"
              onChange={(e) =>
                setMetaItems((current) =>
                  current.map((entry) =>
                    entry.clientId === item.id ? { ...entry, label: e.target.value } : entry
                  )
                )
              }
            />
            <input
              className={adminInputClassName}
              value={metaItems.find((entry) => entry.clientId === item.id)?.value ?? ''}
              placeholder="Value"
              onChange={(e) =>
                setMetaItems((current) =>
                  current.map((entry) =>
                    entry.clientId === item.id ? { ...entry, value: e.target.value } : entry
                  )
                )
              }
            />
          </div>
        )}
      />

      <div className="flex justify-end border-t border-border pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-primary px-[22px] py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-50"
        >
          Save hero
        </button>
      </div>
    </div>
  )
}
