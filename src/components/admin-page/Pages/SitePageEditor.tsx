'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { updatePage } from '@/actions/page.actions'
import { MediaPickerDialog } from '@/components/admin-page/shared/MediaPickerDialog'
import { NavItemModal } from '@/components/admin-page/Pages/NavItemModal'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import { getSiteAvailabilityDisplay } from '@/constants/site-availability'
import { getInitialsFromName } from '@/lib/format/get-initials-from-name'
import { uploadMediaFile } from '@/lib/media/client-upload'
import { cn } from '@/lib/utils'
import type { NavItemModalState, SitePageEditorProps } from '@/types/admin-pages.types'
import type { NavItem, SiteConfig } from '@/types/site.types'
import type { SiteBrand } from '@/types/site-brand.types'
import type {
  SiteContactSettings,
  SiteFooterSettings,
  SiteSeoSettings,
  SiteSocialLink,
  SiteThemeSettings,
} from '@/types/site-settings.types'
import {
  DEFAULT_SITE_THEME,
  DEFAULT_THEME_PICKER_HEX,
  parseSiteTheme,
  SITE_THEME_COLOR_FIELDS,
  toThemePickerHex,
} from '@/lib/admin/site-theme'

interface ClientNavItem extends NavItem {
  readonly clientId: string
}

interface ClientSocialLink extends SiteSocialLink {
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

function toClientSocial(links: readonly SiteSocialLink[]): ClientSocialLink[] {
  return links.map((link, index) => ({
    ...link,
    clientId: `social-${link.label}-${index}`,
  }))
}

function ThemeColorField({
  label,
  hint,
  value,
  pickerFallback,
  onChange,
}: {
  readonly label: string
  readonly hint: string
  readonly value: string
  readonly pickerFallback: string
  readonly onChange: (value: string) => void
}): React.JSX.Element {
  const pickerValue = toThemePickerHex(value, pickerFallback)

  return (
    <AdminFormField label={label}>
      <div className="flex flex-col gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 cursor-pointer rounded-md border border-border bg-transparent p-1"
          aria-label={`${label} color picker`}
        />
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </AdminFormField>
  )
}

export function SitePageEditor({
  initialData,
  media,
  uploadEnabled,
}: SitePageEditorProps): React.JSX.Element {
  const router = useRouter()
  const [brand, setBrand] = useState<SiteBrand>(initialData.brand)
  const [nav, setNav] = useState<readonly ClientNavItem[]>(() => toClientNav(initialData.nav))
  const [seo, setSeo] = useState<SiteSeoSettings>(initialData.seo)
  const [socialLinks, setSocialLinks] = useState<readonly ClientSocialLink[]>(() =>
    toClientSocial(initialData.socialLinks)
  )
  const [contact, setContact] = useState<SiteContactSettings>(initialData.contact)
  const [footer, setFooter] = useState<SiteFooterSettings>(initialData.footer)
  const [theme, setTheme] = useState<SiteThemeSettings>(initialData.theme)
  const [modal, setModal] = useState<NavItemModalState | null>(null)
  const [ogMediaOpen, setOgMediaOpen] = useState(false)
  const [isOgUploading, setIsOgUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
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

  const socialListItems = useMemo(
    () =>
      socialLinks.map((link) => ({
        id: link.clientId,
        primary: link.label || 'Social link',
        secondary: link.url || 'No URL yet',
      })),
    [socialLinks]
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
    const config: SiteConfig = {
      brand,
      nav: normalizeNavOrders(nav.map(({ clientId: _id, ...item }) => item)),
      seo,
      socialLinks: socialLinks.map(({ clientId: _id, ...link }) => link),
      contact,
      footer,
      theme: parseSiteTheme(theme),
    }
    void persist(config)
  }, [brand, contact, footer, nav, persist, seo, socialLinks, theme])

  const handleNavMove = useCallback((id: string, direction: 'up' | 'down') => {
    const index = nav.findIndex((item) => item.clientId === id)
    if (index < 0) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= nav.length) return

    const next = [...nav]
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setNav(toClientNav(next.map(({ clientId: _id, ...item }) => item)))
  }, [nav])

  const handleSocialMove = useCallback((id: string, direction: 'up' | 'down') => {
    const index = socialLinks.findIndex((link) => link.clientId === id)
    if (index < 0) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= socialLinks.length) return

    const next = [...socialLinks]
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setSocialLinks(toClientSocial(next.map(({ clientId: _id, ...link }) => link)))
  }, [socialLinks])

  const handleOgImageUpload = useCallback(
    async (file: File) => {
      setIsOgUploading(true)
      const result = await uploadMediaFile(file, 'site')
      setIsOgUploading(false)

      if (!result.success) {
        setToast(result.error)
        return
      }

      setSeo((current) => ({ ...current, ogImageUrl: result.url }))
      router.refresh()
    },
    [router]
  )

  const handleOgImageSelect = useCallback(
    (mediaId: string) => {
      const asset = media.find((item) => item.id === mediaId)
      if (!asset) {
        setToast('Selected media could not be found.')
        return
      }

      setSeo((current) => ({ ...current, ogImageUrl: asset.url }))
    },
    [media]
  )

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
            current
              .map((entry) =>
                entry.clientId === modal.itemKey
                  ? { ...entry, ...item, key: entry.key }
                  : entry
              )
              .map(({ clientId: _id, ...entry }) => entry)
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

        <FormSection label="Theme colors" columns="1fr 1fr">
          <p className="col-span-full mb-1 text-[13px] text-muted-foreground">
            Accent, background, text, and status colors — the grid overlay stays fixed in the
            design. Save, then refresh the public site to see changes.
          </p>
          {SITE_THEME_COLOR_FIELDS.map((field) => (
            <ThemeColorField
              key={field.key}
              label={field.label}
              hint={field.hint}
              value={theme[field.key]}
              pickerFallback={DEFAULT_THEME_PICKER_HEX[field.key]}
              onChange={(value) =>
                setTheme((current) => ({ ...current, [field.key]: value }))
              }
            />
          ))}
          <div className="col-span-full">
            <button
              type="button"
              onClick={() => setTheme(DEFAULT_SITE_THEME)}
              className="cursor-pointer rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground"
            >
              Reset to defaults
            </button>
          </div>
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

        <FormSection label="SEO" columns="1fr">
          <AdminFormField label="Site title" required>
            <input
              className={adminInputClassName}
              value={seo.title}
              onChange={(e) => setSeo((current) => ({ ...current, title: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Description" required>
            <textarea
              className={adminTextareaClassName}
              rows={3}
              value={seo.description}
              onChange={(e) => setSeo((current) => ({ ...current, description: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Social preview image (optional)">
            <ImagePicker
              imageUrl={seo.ogImageUrl}
              altText="Social preview"
              uploadEnabled={uploadEnabled}
              isUploading={isOgUploading}
              onUpload={handleOgImageUpload}
              onPickFromMedia={() => setOgMediaOpen(true)}
              onRemove={() => setSeo((current) => ({ ...current, ogImageUrl: null }))}
            />
          </AdminFormField>
        </FormSection>

        <ReorderableList
          label="Social links"
          items={socialListItems}
          onMoveUp={(id) => handleSocialMove(id, 'up')}
          onMoveDown={(id) => handleSocialMove(id, 'down')}
          onRemove={(id) =>
            setSocialLinks((current) => current.filter((link) => link.clientId !== id))
          }
          onAdd={() =>
            setSocialLinks((current) => [
              ...current,
              { clientId: `social-new-${Date.now()}`, label: '', url: '' },
            ])
          }
          renderExtra={(item) => (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                className={adminInputClassName}
                value={socialLinks.find((entry) => entry.clientId === item.id)?.label ?? ''}
                placeholder="GitHub"
                onChange={(e) =>
                  setSocialLinks((current) =>
                    current.map((entry) =>
                      entry.clientId === item.id ? { ...entry, label: e.target.value } : entry
                    )
                  )
                }
              />
              <input
                className={adminInputClassName}
                value={socialLinks.find((entry) => entry.clientId === item.id)?.url ?? ''}
                placeholder="https://github.com/…"
                onChange={(e) =>
                  setSocialLinks((current) =>
                    current.map((entry) =>
                      entry.clientId === item.id ? { ...entry, url: e.target.value } : entry
                    )
                  )
                }
              />
            </div>
          )}
        />

        <FormSection label="Contact" columns="1fr 1fr">
          <AdminFormField label="Email">
            <input
              className={adminInputClassName}
              type="email"
              value={contact.email}
              placeholder="hello@example.com"
              onChange={(e) => setContact((current) => ({ ...current, email: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Location">
            <input
              className={adminInputClassName}
              value={contact.location}
              placeholder="Australia — Remote"
              onChange={(e) => setContact((current) => ({ ...current, location: e.target.value }))}
            />
          </AdminFormField>
        </FormSection>

        <FormSection label="Footer" columns="1fr">
          <AdminFormField label="Copyright name" required>
            <input
              className={adminInputClassName}
              value={footer.copyrightName}
              onChange={(e) =>
                setFooter((current) => ({ ...current, copyrightName: e.target.value }))
              }
            />
          </AdminFormField>
          <AdminFormField label="Center tagline" required>
            <input
              className={adminInputClassName}
              value={footer.tagline}
              onChange={(e) => setFooter((current) => ({ ...current, tagline: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField label="Build label" required>
            <input
              className={adminInputClassName}
              value={footer.buildLabel}
              onChange={(e) =>
                setFooter((current) => ({ ...current, buildLabel: e.target.value }))
              }
            />
          </AdminFormField>
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

      <MediaPickerDialog
        open={ogMediaOpen}
        media={media}
        onSelect={handleOgImageSelect}
        onClose={() => setOgMediaOpen(false)}
      />

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
