'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { createWork, publishWork, updateWork } from '@/actions/work.actions'
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { MediaPickerDialog } from '@/components/admin-page/shared/MediaPickerDialog'
import { FormActions } from '@/components/ui/FormActions'
import { FormSection } from '@/components/ui/FormSection'
import { ImagePicker } from '@/components/ui/ImagePicker'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'
import { getPublicPreviewPath } from '@/lib/admin/content-form-mappers'
import type { AdminMediaOption, WorkFormState } from '@/types/admin-content.types'

interface WorkFormProps {
  readonly initialValues: WorkFormState
  readonly media: readonly AdminMediaOption[]
  readonly listHref: string
}

export function WorkForm({
  initialValues,
  media,
  listHref,
}: WorkFormProps): React.JSX.Element {
  const router = useRouter()
  const [values, setValues] = useState<WorkFormState>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mediaOpen, setMediaOpen] = useState(false)

  const isEditing = values.id !== undefined
  const coverImage = useMemo(
    () => media.find((asset) => asset.id === values.coverImageId),
    [media, values.coverImageId]
  )

  const updateField = useCallback(
    <K extends keyof WorkFormState>(key: K, value: WorkFormState[K]) => {
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
        role: values.role,
        tagline: values.tagline,
        metric: values.metric,
        metricLabel: values.metricLabel,
        year: values.year,
        stack: [...values.stack],
        domains: [...values.domains],
        context: values.context,
        problem: values.problem,
        constraints: values.constraints,
        architecture: values.architecture,
        decisions: values.decisions,
        impact: values.impact,
        body: values.body,
        sortOrder: values.sortOrder,
        coverImageId: values.coverImageId,
      }

      const result = values.id
        ? await updateWork({ id: values.id, ...payload })
        : await createWork(payload)

      if (!result.success) {
        setToast(result.error)
        setIsSubmitting(false)
        return
      }

      if (publish) {
        const publishResult = await publishWork(result.data.id)
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

  const previewPath = getPublicPreviewPath('work', values)

  return (
    <div className="max-w-[920px]">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Case studies
          </div>
          <h1 className="text-[32px] font-medium tracking-[-0.02em]">
            {isEditing ? 'Edit work' : 'New work'}
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
              placeholder="project-slug"
            />
          </AdminFormField>
          <AdminFormField label="Title" required>
            <input
              className={adminInputClassName}
              value={values.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Role" required>
            <input
              className={adminInputClassName}
              value={values.role}
              onChange={(e) => updateField('role', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Tagline" required>
            <input
              className={adminInputClassName}
              value={values.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
            />
          </AdminFormField>
        </FormSection>

        <FormSection label="Metrics" columns="1fr 1fr 1fr 100px">
          <AdminFormField label="Metric" required>
            <input
              className={adminInputClassName}
              value={values.metric}
              onChange={(e) => updateField('metric', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Metric label" required>
            <input
              className={adminInputClassName}
              value={values.metricLabel}
              onChange={(e) => updateField('metricLabel', e.target.value)}
            />
          </AdminFormField>
          <AdminFormField label="Year" required>
            <input
              className={adminInputClassName}
              value={values.year}
              onChange={(e) => updateField('year', e.target.value)}
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
        </FormSection>

        <FormSection label="Taxonomy & media" columns="1fr">
          <AdminFormField label="Stack" required>
            <TagInput
              tags={values.stack}
              onChange={(stack) => updateField('stack', stack)}
              placeholder="Add stack item…"
            />
          </AdminFormField>
          <AdminFormField label="Domains">
            <TagInput
              tags={values.domains}
              onChange={(domains) => updateField('domains', domains)}
              placeholder="Domain label (must exist in taxonomy)…"
            />
          </AdminFormField>
          <AdminFormField label="Cover image">
            <ImagePicker
              imageUrl={coverImage?.url}
              altText={coverImage?.alt}
              onPickFromMedia={() => setMediaOpen(true)}
            />
          </AdminFormField>
        </FormSection>

        <FormSection label="Case study" columns="1fr">
          {(
            [
              ['Context', 'context'],
              ['Problem', 'problem'],
              ['Constraints', 'constraints'],
              ['Architecture', 'architecture'],
              ['Decisions', 'decisions'],
              ['Impact', 'impact'],
            ] as const
          ).map(([label, key]) => (
            <AdminFormField key={key} label={label} required>
              <textarea
                className={adminTextareaClassName}
                rows={4}
                value={values[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </AdminFormField>
          ))}
          <AdminFormField label="Body (MDX)">
            <textarea
              className={adminTextareaClassName}
              rows={8}
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
