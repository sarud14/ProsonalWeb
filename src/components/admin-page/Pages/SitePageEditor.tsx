'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { NavItemModal } from '@/components/admin-page/Pages/NavItemModal'
import {
  AdminFormField,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import type { NavItemModalState, SitePageEditorProps } from '@/types/admin-pages.types'
import type { NavItem, SiteConfig } from '@/types/site.types'

interface ClientNavItem extends NavItem {
  readonly clientId: string
}

function normalizeNavOrders(items: readonly NavItem[]): NavItem[] {
  return items.map((item, index) => ({ ...item, order: index }))
}

function toClientNav(nav: readonly NavItem[]): ClientNavItem[] {
  return normalizeNavOrders(nav).map((item) => ({
    ...item,
    clientId: item.key,
  }))
}

export function SitePageEditor({ initialData }: SitePageEditorProps): React.JSX.Element {
  const router = useRouter()
  const [nav, setNav] = useState<readonly ClientNavItem[]>(() => toClientNav(initialData.nav))
  const [themeJson, setThemeJson] = useState(() => JSON.stringify(initialData.theme, null, 2))
  const [seoJson, setSeoJson] = useState(() => JSON.stringify(initialData.seo, null, 2))
  const [socialJson, setSocialJson] = useState(() =>
    JSON.stringify(initialData.socialLinks, null, 2)
  )
  const [contactJson, setContactJson] = useState(() =>
    JSON.stringify(initialData.contact, null, 2)
  )
  const [modal, setModal] = useState<NavItemModalState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const listItems = useMemo(
    () =>
      nav.map((item) => ({
        id: item.clientId,
        primary: item.label,
        secondary: item.href,
        meta: item.enabled ? undefined : (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
            Hidden
          </span>
        ),
      })),
    [nav]
  )

  const persist = useCallback(
    async (config: SiteConfig) => {
      setIsSaving(true)
      const result = await updatePage({ key: 'site', data: config })
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
    try {
      const config: SiteConfig = {
        nav: normalizeNavOrders(nav.map(({ clientId: _id, ...item }) => item)),
        theme: JSON.parse(themeJson) as Record<string, unknown>,
        seo: JSON.parse(seoJson) as Record<string, unknown>,
        socialLinks: JSON.parse(socialJson) as Record<string, unknown>,
        contact: JSON.parse(contactJson) as Record<string, unknown>,
      }
      setJsonError(null)
      void persist(config)
    } catch {
      setJsonError('Theme, SEO, social, or contact fields must be valid JSON')
    }
  }, [contactJson, nav, persist, seoJson, socialJson, themeJson])

  const handleNavMove = useCallback((id: string, direction: 'up' | 'down') => {
    const index = nav.findIndex((item) => item.clientId === id)
    if (index < 0) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= nav.length) return

    const next = [...nav]
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setNav(toClientNav(next.map(({ clientId: _id, ...item }) => item)))
  }, [nav])

  const handleSaveNavItem = useCallback(
    (item: NavItemModalState['item']) => {
      if (modal?.isNew) {
        const next = toClientNav([
          ...nav.map(({ clientId: _id, ...entry }) => entry),
          { ...item, order: nav.length },
        ])
        setNav(next)
      } else if (modal?.itemKey) {
        setNav((current) =>
          toClientNav(
            current.map((entry) =>
              entry.clientId === modal.itemKey
                ? { ...entry, ...item, key: entry.key }
                : entry
            ).map(({ clientId: _id, ...entry }) => entry)
          )
        )
      }
      setModal(null)
    },
    [modal, nav]
  )

  return (
    <div>
      <SectionHeading kicker="Page editor" title="Site config" />

      <div className="flex flex-col gap-6">
        <ReorderableList
          label="Navigation"
          items={listItems}
          onMoveUp={(id) => handleNavMove(id, 'up')}
          onMoveDown={(id) => handleNavMove(id, 'down')}
          onRemove={(id) =>
            setNav((current) => current.filter((item) => item.clientId !== id))
          }
          onAdd={() =>
            setModal({
              isNew: true,
              item: { key: `nav-${Date.now()}`, label: '', href: '/', enabled: true },
            })
          }
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = nav.find((navItem) => navItem.clientId === item.id)
                if (entry) {
                  const { clientId, order: _order, ...rest } = entry
                  setModal({
                    isNew: false,
                    item: rest,
                    itemKey: clientId,
                  })
                }
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />

        <FormSection label="Advanced (JSON)" columns="1fr">
          <AdminFormField label="Theme">
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={themeJson}
              onChange={(e) => {
                setThemeJson(e.target.value)
                setJsonError(null)
              }}
            />
          </AdminFormField>
          <AdminFormField label="SEO">
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={seoJson}
              onChange={(e) => {
                setSeoJson(e.target.value)
                setJsonError(null)
              }}
            />
          </AdminFormField>
          <AdminFormField label="Social links">
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={socialJson}
              onChange={(e) => {
                setSocialJson(e.target.value)
                setJsonError(null)
              }}
            />
          </AdminFormField>
          <AdminFormField label="Contact">
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={contactJson}
              onChange={(e) => {
                setContactJson(e.target.value)
                setJsonError(null)
              }}
            />
          </AdminFormField>
          {jsonError && <p className="text-sm text-primary">{jsonError}</p>}
        </FormSection>
      </div>

      <div className="mt-7 flex justify-end border-t border-border pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-primary px-[22px] py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-50"
        >
          Save site config
        </button>
      </div>

      {modal && (
        <NavItemModal
          key={modal.itemKey ?? 'new-nav'}
          state={modal}
          onClose={() => setModal(null)}
          onSave={handleSaveNavItem}
        />
      )}

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
