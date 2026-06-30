'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import {
  createEngineering,
  publishEngineering,
  updateEngineering,
} from '@/actions/engineering.actions'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { MediaPickerDialog } from '@/components/admin-page/shared/MediaPickerDialog'
import { ENGINEERING_TYPE_OPTIONS } from '@/constants/admin-content-list'
import { FormActions } from '@/components/ui/FormActions'
import { FormSection } from '@/components/ui/FormSection'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Toast } from '@/components/ui/Toast'
import { getPublicPreviewPath } from '@/lib/admin/content-form-mappers'
import type { AdminMediaOption, EngineeringFormState } from '@/types/admin-content.types'

interface EngineeringFormProps {
  readonly initialValues: EngineeringFormState
  readonly media: readonly AdminMediaOption[]
  readonly listHref: string
}

export function EngineeringForm({
  initialValues,
  media,
  listHref,
}: EngineeringFormProps): React.JSX.Element {
  const router = useRouter()
  const [values, setValues] = useState<EngineeringFormState>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mediaOpen, setMediaOpen] = useState(false)

  const isEditing = values.id !== undefined
  const coverImage = useMemo(
    () => media.find((asset) => asset.id === values.coverImageId),
    [media, values.coverImageId]
  )

  const updateField = useCallback(
    <K extends keyof EngineeringFormState>(key: K, value: EngineeringFormState[K]) => {
      setValues((current) => ({ ...current, [key]: value }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (publish: boolean) => {
      setIsSubmitting(true)

      const payload = {
        slug: values.slug,
        title: values.title,
        type: values.type,
        summary: values.summary,
        noteDate: values.noteDate,
        readTime: values.readTime,
        body: values.body,
        sortOrder: values.sortOrder,
        coverImageId: values.coverImageId,
      }

      const result = values.id
        ? await updateEngineering({ id: values.id, ...payload })
        : await createEngineering(payload)

      if (!result.success) {
        setToast(result.error)
        setIsSubmitting(false)
        return
      }

      if (publish) {
        const publishResult = await publishEngineering(result.data.id)
        if (!publishResult.success) {
          setToast(publishResult.error)
          setIsSubmitting(false)
          return
        }
      }

      setIsSubmitting(false)
      router.push(listHref)
      router.refresh()
    },
    [listHref, router, values]
  )

  const previewPath = getPublicPreviewPath('engineering', values)

  return (
    <div className="max-w-[920px]">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Notes
          </div>
          <h1 className="text-[32px] font-medium tracking-[-0.02em]">
            {isEditing ? 'Edit note' : 'New note'}
          </h1>
        </div>
        <StatusBadge status={values.status} />
      </div>

      <div className="flex flex-col gap-[26px]">
        <FormSection label="Identity" columns="1fr 1fr">
          <AdminFormField label="Slug" required>
            <input
              className={adminInputClassName}
              value={values.slug}
              onChange={(e) => updateField('slug', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Title" required>
            <input
              className={adminInputClassName}
              value={values.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Type" required>
            <select
              className={adminInputClassName}
              value={values.type}
              onChange={(e) =>
                updateField('type', e.target.value as EngineeringFormState['type'])
              }
            >
              {ENGINEERING_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </AdminFormField>
          <AdminFormField label="Note date" required>
            <input
              className={adminInputClassName}
              value={values.noteDate}
              onChange={(e) => updateField('noteDate', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Read time" required>
            <input
              className={adminInputClassName}
              value={values.readTime}
              onChange={(e) => updateField('readTime', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Sort">
            <input
              type="number"
              className={adminInputClassName}
              value={values.sortOrder}
              onChange={(e) => updateField('sortOrder', Number(e.target.value) || 0)}
            />
          </AdminFormField>
          <AdminFormField label="Cover image" span="span 2">
            <ImagePicker
              imageUrl={coverImage?.url}
              altText={coverImage?.alt}
              onPickFromMedia={() => setMediaOpen(true)}
            />
          </AdminFormField>
        </FormSection>

        <FormSection label="Content" columns="1fr">
          <AdminFormField label="Summary" required>
            <textarea
              className={adminTextareaClassName}
              rows={4}
              value={values.summary}
              onChange={(e) => updateField('summary', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Body (MDX)">
            <textarea
              className={adminTextareaClassName}
              rows={10}
              value={values.body}
              onChange={(e) => updateField('body', e.target.value)}
            />
          </AdminFormField>
        </FormSection>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        onPublish={() => void handleSubmit(true)}
        onSaveDraft={() => void handleSubmit(false)}
        onPreview={
          previewPath
            ? () => window.open(previewPath, '_blank', 'noopener,noreferrer')
            : undefined
        }
        onCancel={() => router.push(listHref)}
      />

      <MediaPickerDialog
        open={mediaOpen}
        media={media}
        onSelect={(mediaId) => updateField('coverImageId', mediaId)}
        onClose={() => setMediaOpen(false)}
      />

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
