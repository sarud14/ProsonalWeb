'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { getInitialsFromName } from '@/lib/format/get-initials-from-name'
import { getSiteAvailabilityDisplay } from '@/constants/site-availability'
import { cn } from '@/lib/utils'
import { NavItemModal } from '@/components/admin-page/Pages/NavItemModal'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import type { NavItemModalState, SitePageEditorProps } from '@/types/admin-pages.types'
import type { NavItem, SiteConfig } from '@/types/site.types'
import type { SiteBrand } from '@/types/site-brand.types'

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
  const [brand, setBrand] = useState<SiteBrand>(initialData.brand)
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
        brand,
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
  }, [brand, contactJson, nav, persist, seoJson, socialJson, themeJson])

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
        <FormSection label="Navbar brand" columns="1fr 1fr">
          <AdminFormField label="Name" required>
            <input
              className={adminInputClassName}
              value={brand.name}
              onChange={(e) => setBrand((current) => ({ ...current, name: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Initials preview">
            <div className="flex h-10 items-center font-mono text-sm text-muted-foreground">
              {getInitialsFromName(brand.name)}
            </div>
          </AdminFormField>
          <AdminFormField label="Role" required span="1 / -1">
            <input
              className={adminInputClassName}
              value={brand.role}
              onChange={(e) => setBrand((current) => ({ ...current, role: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Site availability" span="1 / -1">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={brand.isAvailable}
                onChange={(e) =>
                  setBrand((current) => ({ ...current, isAvailable: e.target.checked }))
                }
                className="size-4 accent-primary"
              />
              <span
                className={cn(
                  'flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase',
                  getSiteAvailabilityDisplay(brand.isAvailable).textClassName
                )}
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    getSiteAvailabilityDisplay(brand.isAvailable).dotClassName
                  )}
                />
                {getSiteAvailabilityDisplay(brand.isAvailable).label}
              </span>
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              Shown in the public navbar — green when open, red when closed.
            </p>
          </AdminFormField>
        </FormSection>

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
