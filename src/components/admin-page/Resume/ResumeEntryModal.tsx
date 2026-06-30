'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { TagInput } from '@/components/ui/TagInput'
import type {
  ResumeEducationDraft,
  ResumeEntryKind,
  ResumeExperienceDraft,
  ResumeLanguageDraft,
  ResumeSelectedWorkDraft,
  ResumeWorkOption,
} from '@/types/admin-resume.types'

interface ResumeEntryModalProps {
  readonly open: boolean
  readonly kind: ResumeEntryKind
  readonly workOptions: readonly ResumeWorkOption[]
  readonly initialExperience?: ResumeExperienceDraft
  readonly initialEducation?: ResumeEducationDraft
  readonly initialLanguage?: ResumeLanguageDraft
  readonly initialSelectedWork?: ResumeSelectedWorkDraft
  readonly onClose: () => void
  readonly onSaveExperience: (draft: ResumeExperienceDraft) => void
  readonly onSaveEducation: (draft: ResumeEducationDraft) => void
  readonly onSaveLanguage: (draft: ResumeLanguageDraft) => void
  readonly onSaveSelectedWork: (draft: ResumeSelectedWorkDraft) => void
}

const MODAL_TITLES: Readonly<Record<ResumeEntryKind, string>> = {
  experience: 'Experience',
  education: 'Education',
  language: 'Language',
  selectedWork: 'Selected work',
}

function createExperienceDraft(initial?: ResumeExperienceDraft): ResumeExperienceDraft {
  return initial ?? { title: '', org: '', period: '', bullets: [] }
}

function createEducationDraft(initial?: ResumeEducationDraft): ResumeEducationDraft {
  return initial ?? { title: '', note: '', period: '' }
}

function createLanguageDraft(initial?: ResumeLanguageDraft): ResumeLanguageDraft {
  return initial ?? { name: '', level: '' }
}

function createSelectedWorkDraft(
  initial: ResumeSelectedWorkDraft | undefined,
  workOptions: readonly ResumeWorkOption[]
): ResumeSelectedWorkDraft {
  return initial ?? { workId: workOptions[0]?.id ?? '', noteOverride: '' }
}

export function ResumeEntryModal({
  open,
  kind,
  workOptions,
  initialExperience,
  initialEducation,
  initialLanguage,
  initialSelectedWork,
  onClose,
  onSaveExperience,
  onSaveEducation,
  onSaveLanguage,
  onSaveSelectedWork,
}: ResumeEntryModalProps): React.JSX.Element | null {
  const [experience, setExperience] = useState(() => createExperienceDraft(initialExperience))
  const [education, setEducation] = useState(() => createEducationDraft(initialEducation))
  const [language, setLanguage] = useState(() => createLanguageDraft(initialLanguage))
  const [selectedWork, setSelectedWork] = useState(() =>
    createSelectedWorkDraft(initialSelectedWork, workOptions)
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  const handleSubmit = useCallback(() => {
    switch (kind) {
      case 'experience':
        onSaveExperience(experience)
        break
      case 'education':
        onSaveEducation(education)
        break
      case 'language':
        onSaveLanguage(language)
        break
      case 'selectedWork':
        onSaveSelectedWork(selectedWork)
        break
    }
  }, [
    kind,
    experience,
    education,
    language,
    selectedWork,
    onSaveExperience,
    onSaveEducation,
    onSaveLanguage,
    onSaveSelectedWork,
  ])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[85vh] w-[90%] max-w-[520px] overflow-y-auto rounded-[14px] border border-border bg-card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-[22px] font-medium">
          {initialExperience?.id ||
          initialEducation?.id ||
          initialLanguage?.id ||
          initialSelectedWork?.id
            ? 'Edit'
            : 'Add'}{' '}
          {MODAL_TITLES[kind]}
        </h3>

        {kind === 'experience' && (
          <div className="flex flex-col gap-4">
            <AdminFormField label="Title" required>
              <input
                className={adminInputClassName}
                value={experience.title}
                onChange={(e) =>
                  setExperience((current) => ({ ...current, title: e.target.value }))
                }
              />
            </AdminFormField>
            <AdminFormField label="Organization" required>
              <input
                className={adminInputClassName}
                value={experience.org}
                onChange={(e) =>
                  setExperience((current) => ({ ...current, org: e.target.value }))
                }
              />
            </AdminFormField>
            <AdminFormField label="Period" required>
              <input
                className={adminInputClassName}
                value={experience.period}
                onChange={(e) =>
                  setExperience((current) => ({ ...current, period: e.target.value }))
                }
                placeholder="2022 — 2024"
              />
            </AdminFormField>
            <AdminFormField label="Bullets" required>
              <TagInput
                tags={experience.bullets}
                onChange={(bullets) =>
                  setExperience((current) => ({ ...current, bullets }))
                }
                placeholder="Add bullet and press Enter…"
              />
            </AdminFormField>
          </div>
        )}

        {kind === 'education' && (
          <div className="flex flex-col gap-4">
            <AdminFormField label="Title" required>
              <input
                className={adminInputClassName}
                value={education.title}
                onChange={(e) =>
                  setEducation((current) => ({ ...current, title: e.target.value }))
                }
              />
            </AdminFormField>
            <AdminFormField label="Note" required>
              <textarea
                className={adminTextareaClassName}
                rows={3}
                value={education.note}
                onChange={(e) =>
                  setEducation((current) => ({ ...current, note: e.target.value }))
                }
              />
            </AdminFormField>
            <AdminFormField label="Period" required>
              <input
                className={adminInputClassName}
                value={education.period}
                onChange={(e) =>
                  setEducation((current) => ({ ...current, period: e.target.value }))
                }
              />
            </AdminFormField>
          </div>
        )}

        {kind === 'language' && (
          <div className="flex flex-col gap-4">
            <AdminFormField label="Language" required>
              <input
                className={adminInputClassName}
                value={language.name}
                onChange={(e) =>
                  setLanguage((current) => ({ ...current, name: e.target.value }))
                }
              />
            </AdminFormField>
            <AdminFormField label="Level" required>
              <input
                className={adminInputClassName}
                value={language.level}
                onChange={(e) =>
                  setLanguage((current) => ({ ...current, level: e.target.value }))
                }
                placeholder="Native / Professional"
              />
            </AdminFormField>
          </div>
        )}

        {kind === 'selectedWork' && (
          <div className="flex flex-col gap-4">
            <AdminFormField label="Work case study" required>
              <select
                className={adminInputClassName}
                value={selectedWork.workId}
                onChange={(e) =>
                  setSelectedWork((current) => ({ ...current, workId: e.target.value }))
                }
              >
                <option value="">Select work…</option>
                {workOptions.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormField label="Note override">
              <textarea
                className={adminTextareaClassName}
                rows={3}
                value={selectedWork.noteOverride}
                onChange={(e) =>
                  setSelectedWork((current) => ({
                    ...current,
                    noteOverride: e.target.value,
                  }))
                }
                placeholder="Optional custom note for résumé PDF"
              />
            </AdminFormField>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border bg-secondary px-[18px] py-2.5 text-[13px] font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-primary px-[18px] py-2.5 text-[13px] font-bold text-primary-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
