'use client'

import { TagInput } from '@/components/ui/TagInput'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import {
  parseLandingModules,
  parseLandingStats,
  parseLandingTechStack,
} from '@/lib/admin/landing-block-props'
import type {
  LandingModule,
  LandingStat,
} from '@/types/landing.types'

interface LandingBlockPropsEditorProps {
  readonly type: string
  readonly props: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}

function ListActions({
  onAdd,
  addLabel,
}: {
  readonly onAdd: () => void
  readonly addLabel: string
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="cursor-pointer self-start rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground"
    >
      {addLabel}
    </button>
  )
}

function StatsPropsEditor({
  props,
  onChange,
}: {
  readonly props: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}): React.JSX.Element {
  const items = parseLandingStats(props)

  const updateItems = (next: LandingStat[]): void => {
    onChange({ items: next })
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Number highlights shown in a row on the landing page.
      </p>
      {items.map((item, index) => (
        <div
          key={`stat-${index}`}
          className="rounded-lg border border-border bg-secondary/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Stat {index + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => updateItems(items.filter((_, i) => i !== index))}
                className="cursor-pointer border-none bg-transparent p-0 text-xs text-primary"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AdminFormField label="Value" required>
              <input
                className={adminInputClassName}
                value={item.value}
                placeholder="e.g. 06"
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, value: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Label" required>
              <input
                className={adminInputClassName}
                value={item.label}
                placeholder="e.g. Case Studies"
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, label: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
          </div>
        </div>
      ))}
      <ListActions onAdd={() => updateItems([...items, { value: '', label: '' }])} addLabel="+ Add stat" />
    </div>
  )
}

function ModulesPropsEditor({
  props,
  onChange,
}: {
  readonly props: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}): React.JSX.Element {
  const items = parseLandingModules(props)

  const updateItems = (next: LandingModule[]): void => {
    onChange({ items: next })
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Cards linking to main sections of the site.
      </p>
      {items.map((item, index) => (
        <div
          key={`module-${index}`}
          className="rounded-lg border border-border bg-secondary/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Module {index + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => updateItems(items.filter((_, i) => i !== index))}
                className="cursor-pointer border-none bg-transparent p-0 text-xs text-primary"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AdminFormField label="Number">
              <input
                className={adminInputClassName}
                value={item.num}
                placeholder="01"
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, num: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Badge (optional)">
              <input
                className={adminInputClassName}
                value={item.badge ?? ''}
                placeholder="LIVE"
                onChange={(e) => {
                  const next = [...items]
                  const badge = e.target.value.trim()
                  next[index] = { ...item, badge: badge.length > 0 ? badge : undefined }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Title" required span="1 / -1">
              <input
                className={adminInputClassName}
                value={item.title}
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, title: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Description" required span="1 / -1">
              <textarea
                className={adminTextareaClassName}
                rows={3}
                value={item.desc}
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, desc: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Link" required>
              <input
                className={adminInputClassName}
                value={item.link}
                placeholder="/work"
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, link: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
            <AdminFormField label="Link label" required>
              <input
                className={adminInputClassName}
                value={item.linkLabel}
                placeholder="6 ENTRIES"
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...item, linkLabel: e.target.value }
                  updateItems(next)
                }}
              />
            </AdminFormField>
          </div>
        </div>
      ))}
      <ListActions
        onAdd={() =>
          updateItems([
            ...items,
            {
              num: String(items.length + 1).padStart(2, '0'),
              title: '',
              desc: '',
              link: '/',
              linkLabel: '',
            },
          ])
        }
        addLabel="+ Add module"
      />
    </div>
  )
}

function TechStackPropsEditor({
  props,
  onChange,
}: {
  readonly props: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}): React.JSX.Element {
  const items = parseLandingTechStack(props)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Tools shown as tags. Type a name and press Enter to add.
      </p>
      <AdminFormField label="Technologies">
        <TagInput
          tags={items}
          onChange={(tags) => onChange({ items: [...tags] })}
          placeholder="e.g. Next.js — press Enter"
        />
      </AdminFormField>
    </div>
  )
}

export function LandingBlockPropsEditor({
  type,
  props,
  onChange,
}: LandingBlockPropsEditorProps): React.JSX.Element {
  switch (type) {
    case 'stats':
      return <StatsPropsEditor props={props} onChange={onChange} />
    case 'modules':
      return <ModulesPropsEditor props={props} onChange={onChange} />
    case 'techStack':
      return <TechStackPropsEditor props={props} onChange={onChange} />
    default:
      return (
        <p className="text-sm text-muted-foreground">
          This block type has no visual editor yet.
        </p>
      )
  }
}
