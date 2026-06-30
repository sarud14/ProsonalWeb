'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import {
  addSelectedWork,
  deleteEducation,
  deleteExperience,
  deleteLanguage,
  removeSelectedWork,
  updateResumeProfile,
  updateSelectedWork,
  upsertEducation,
  upsertExperience,
  upsertLanguage,
} from '@/actions/resume.actions'
import { ResumeEntryModal } from '@/components/admin-page/Resume/ResumeEntryModal'
import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'
import { FormSection } from '@/components/ui/FormSection'
import { ReorderableList } from '@/components/ui/ReorderableList'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'
import { getReorderedPair } from '@/lib/admin/reorder-sort-items'
import type {
  ResumeEducationDraft,
  ResumeEducationItem,
  ResumeEntryKind,
  ResumeExperienceDraft,
  ResumeExperienceItem,
  ResumeLanguageDraft,
  ResumeLanguageItem,
  ResumePageViewProps,
  ResumeProfileFormState,
  ResumeSelectedWorkDraft,
  ResumeSelectedWorkItem,
} from '@/types/admin-resume.types'

interface ModalState {
  readonly kind: ResumeEntryKind
  readonly experience?: ResumeExperienceDraft
  readonly education?: ResumeEducationDraft
  readonly language?: ResumeLanguageDraft
  readonly selectedWork?: ResumeSelectedWorkDraft
}

export function ResumePageView({ initialData }: ResumePageViewProps): React.JSX.Element {
  const router = useRouter()
  const [profile, setProfile] = useState<ResumeProfileFormState>(initialData.profile)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const { experiences, education, languages, selectedWork } = initialData

  const showError = useCallback((message: string) => {
    setToast(message)
  }, [])

  const ensureProfileId = useCallback(async (): Promise<string | null> => {
    if (profile.id) return profile.id

    const result = await updateResumeProfile({
      name: profile.name,
      role: profile.role,
      contactLine: profile.contactLine,
      skills: [...profile.skills],
      coreTools: [...profile.coreTools],
    })

    if (!result.success) {
      showError(result.error)
      return null
    }

    setProfile((current) => ({ ...current, id: result.data.id }))
    return result.data.id
  }, [profile, showError])

  const handleSaveProfile = useCallback(async () => {
    setIsSavingProfile(true)
    const result = await updateResumeProfile({
      name: profile.name,
      role: profile.role,
      contactLine: profile.contactLine,
      skills: [...profile.skills],
      coreTools: [...profile.coreTools],
    })
    setIsSavingProfile(false)

    if (!result.success) {
      showError(result.error)
      return
    }

    setProfile((current) => ({ ...current, id: result.data.id }))
    router.refresh()
  }, [profile, router, showError])

  const handleReorder = useCallback(
    async (
      items: readonly { readonly id: string; readonly sortOrder: number }[],
      id: string,
      direction: 'up' | 'down',
      upsert: (payload: {
        id: string
        sortOrder: number
      }) => Promise<{ success: boolean; error?: string }>
    ) => {
      const pair = getReorderedPair(items, id, direction)
      if (!pair) return

      const [current, adjacent] = pair
      const results = await Promise.all([
        upsert({ id: current.id, sortOrder: adjacent.sortOrder }),
        upsert({ id: adjacent.id, sortOrder: current.sortOrder }),
      ])

      const failed = results.find((result) => !result.success)
      if (failed && !failed.success) {
        showError(failed.error ?? 'Reorder failed')
        return
      }

      router.refresh()
    },
    [router, showError]
  )

  const openAdd = useCallback((kind: ResumeEntryKind) => {
    setModal({ kind })
  }, [])

  const openEditExperience = useCallback((item: ResumeExperienceItem) => {
    setModal({
      kind: 'experience',
      experience: {
        id: item.id,
        title: item.title,
        org: item.org,
        period: item.period,
        bullets: [...item.bullets],
      },
    })
  }, [])

  const openEditEducation = useCallback((item: ResumeEducationItem) => {
    setModal({
      kind: 'education',
      education: {
        id: item.id,
        title: item.title,
        note: item.note,
        period: item.period,
      },
    })
  }, [])

  const openEditLanguage = useCallback((item: ResumeLanguageItem) => {
    setModal({
      kind: 'language',
      language: { id: item.id, name: item.name, level: item.level },
    })
  }, [])

  const openEditSelectedWork = useCallback((item: ResumeSelectedWorkItem) => {
    setModal({
      kind: 'selectedWork',
      selectedWork: {
        id: item.id,
        workId: item.workId,
        noteOverride: item.noteOverride ?? '',
      },
    })
  }, [])

  const handleSaveExperience = useCallback(
    async (draft: ResumeExperienceDraft) => {
      const profileId = await ensureProfileId()
      if (!profileId) return

      const result = await upsertExperience({
        id: draft.id,
        profileId,
        title: draft.title,
        org: draft.org,
        period: draft.period,
        bullets: [...draft.bullets],
        sortOrder: draft.id
          ? experiences.find((item) => item.id === draft.id)?.sortOrder
          : experiences.length,
      })

      if (!result.success) {
        showError(result.error)
        return
      }

      setModal(null)
      router.refresh()
    },
    [ensureProfileId, experiences, router, showError]
  )

  const handleSaveEducation = useCallback(
    async (draft: ResumeEducationDraft) => {
      const profileId = await ensureProfileId()
      if (!profileId) return

      const result = await upsertEducation({
        id: draft.id,
        profileId,
        title: draft.title,
        note: draft.note,
        period: draft.period,
        sortOrder: draft.id
          ? education.find((item) => item.id === draft.id)?.sortOrder
          : education.length,
      })

      if (!result.success) {
        showError(result.error)
        return
      }

      setModal(null)
      router.refresh()
    },
    [education, ensureProfileId, router, showError]
  )

  const handleSaveLanguage = useCallback(
    async (draft: ResumeLanguageDraft) => {
      const profileId = await ensureProfileId()
      if (!profileId) return

      const result = await upsertLanguage({
        id: draft.id,
        profileId,
        name: draft.name,
        level: draft.level,
        sortOrder: draft.id
          ? languages.find((item) => item.id === draft.id)?.sortOrder
          : languages.length,
      })

      if (!result.success) {
        showError(result.error)
        return
      }

      setModal(null)
      router.refresh()
    },
    [ensureProfileId, languages, router, showError]
  )

  const handleSaveSelectedWork = useCallback(
    async (draft: ResumeSelectedWorkDraft) => {
      const profileId = await ensureProfileId()
      if (!profileId) return

      if (draft.id) {
        const result = await updateSelectedWork({
          id: draft.id,
          noteOverride: draft.noteOverride || null,
        })
        if (!result.success) {
          showError(result.error)
          return
        }
      } else {
        const result = await addSelectedWork({
          profileId,
          workId: draft.workId,
          noteOverride: draft.noteOverride || null,
          sortOrder: selectedWork.length,
        })
        if (!result.success) {
          showError(result.error)
          return
        }
      }

      setModal(null)
      router.refresh()
    },
    [ensureProfileId, router, selectedWork.length, showError]
  )

  return (
    <div className="max-w-[880px]">
      <SectionHeading
        kicker="Structured résumé"
        title="Résumé"
        action={
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => void handleSaveProfile()}
              disabled={isSavingProfile}
              className="cursor-pointer rounded-lg bg-primary px-5 py-[11px] text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
            >
              Save
            </button>
            <a
              href="/api/resume/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-[11px] text-[13px] font-semibold text-foreground"
            >
              Download PDF ↗
            </a>
          </div>
        }
      />

      <FormSection label="Profile" columns="1fr 1fr">
        <AdminFormField label="Name" required>
          <input
            className={adminInputClassName}
            value={profile.name}
            onChange={(e) => setProfile((current) => ({ ...current, name: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Role" required>
          <input
            className={adminInputClassName}
            value={profile.role}
            onChange={(e) => setProfile((current) => ({ ...current, role: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField label="Contact line" required span="1 / -1">
          <input
            className={adminInputClassName}
            value={profile.contactLine}
            onChange={(e) =>
              setProfile((current) => ({ ...current, contactLine: e.target.value }))
            }
          />
        </AdminFormField>
        <AdminFormField label="Skills" required span="1 / -1">
          <TagInput
            tags={profile.skills}
            onChange={(skills) => setProfile((current) => ({ ...current, skills }))}
          />
        </AdminFormField>
        <AdminFormField label="Core tools" required span="1 / -1">
          <TagInput
            tags={profile.coreTools}
            onChange={(coreTools) => setProfile((current) => ({ ...current, coreTools }))}
          />
        </AdminFormField>
      </FormSection>

      <div className="mt-[22px] flex flex-col gap-[22px]">
        <ReorderableList
          label="Experience"
          items={experiences.map((item) => ({
            id: item.id,
            primary: item.title,
            secondary: `${item.org} · ${item.period}`,
            bullets: item.bullets,
          }))}
          onMoveUp={(id) =>
            void handleReorder(experiences, id, 'up', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = experiences.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertExperience({
                id: payload.id,
                profileId,
                title: item.title,
                org: item.org,
                period: item.period,
                bullets: [...item.bullets],
                sortOrder: payload.sortOrder,
              })
            })
          }
          onMoveDown={(id) =>
            void handleReorder(experiences, id, 'down', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = experiences.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertExperience({
                id: payload.id,
                profileId,
                title: item.title,
                org: item.org,
                period: item.period,
                bullets: [...item.bullets],
                sortOrder: payload.sortOrder,
              })
            })
          }
          onRemove={(id) => {
            void deleteExperience(id).then((result) => {
              if (!result.success) showError(result.error)
              else router.refresh()
            })
          }}
          onAdd={() => openAdd('experience')}
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = experiences.find((exp) => exp.id === item.id)
                if (entry) openEditExperience(entry)
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />

        <ReorderableList
          label="Education"
          items={education.map((item) => ({
            id: item.id,
            primary: item.title,
            secondary: `${item.note} · ${item.period}`,
          }))}
          onMoveUp={(id) =>
            void handleReorder(education, id, 'up', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = education.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertEducation({
                id: payload.id,
                profileId,
                title: item.title,
                note: item.note,
                period: item.period,
                sortOrder: payload.sortOrder,
              })
            })
          }
          onMoveDown={(id) =>
            void handleReorder(education, id, 'down', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = education.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertEducation({
                id: payload.id,
                profileId,
                title: item.title,
                note: item.note,
                period: item.period,
                sortOrder: payload.sortOrder,
              })
            })
          }
          onRemove={(id) => {
            void deleteEducation(id).then((result) => {
              if (!result.success) showError(result.error)
              else router.refresh()
            })
          }}
          onAdd={() => openAdd('education')}
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = education.find((edu) => edu.id === item.id)
                if (entry) openEditEducation(entry)
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />

        <ReorderableList
          label="Languages"
          items={languages.map((item) => ({
            id: item.id,
            primary: item.name,
            secondary: item.level,
          }))}
          onMoveUp={(id) =>
            void handleReorder(languages, id, 'up', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = languages.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertLanguage({
                id: payload.id,
                profileId,
                name: item.name,
                level: item.level,
                sortOrder: payload.sortOrder,
              })
            })
          }
          onMoveDown={(id) =>
            void handleReorder(languages, id, 'down', async (payload) => {
              const profileId = await ensureProfileId()
              if (!profileId) return { success: false, error: 'Profile required' }
              const item = languages.find((entry) => entry.id === payload.id)
              if (!item) return { success: false, error: 'Not found' }
              return upsertLanguage({
                id: payload.id,
                profileId,
                name: item.name,
                level: item.level,
                sortOrder: payload.sortOrder,
              })
            })
          }
          onRemove={(id) => {
            void deleteLanguage(id).then((result) => {
              if (!result.success) showError(result.error)
              else router.refresh()
            })
          }}
          onAdd={() => openAdd('language')}
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = languages.find((lang) => lang.id === item.id)
                if (entry) openEditLanguage(entry)
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />

        <ReorderableList
          label="Selected work"
          items={selectedWork.map((item) => ({
            id: item.id,
            primary: item.workTitle,
            secondary: item.noteOverride ?? undefined,
          }))}
          onMoveUp={(id) =>
            void handleReorder(selectedWork, id, 'up', async (payload) =>
              updateSelectedWork({ id: payload.id, sortOrder: payload.sortOrder })
            )
          }
          onMoveDown={(id) =>
            void handleReorder(selectedWork, id, 'down', async (payload) =>
              updateSelectedWork({ id: payload.id, sortOrder: payload.sortOrder })
            )
          }
          onRemove={(id) => {
            void removeSelectedWork(id).then((result) => {
              if (!result.success) showError(result.error)
              else router.refresh()
            })
          }}
          onAdd={() => openAdd('selectedWork')}
          renderExtra={(item) => (
            <button
              type="button"
              onClick={() => {
                const entry = selectedWork.find((work) => work.id === item.id)
                if (entry) openEditSelectedWork(entry)
              }}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary"
            >
              Edit
            </button>
          )}
        />
      </div>

      {modal && (
        <ResumeEntryModal
          key={[
            modal.kind,
            modal.experience?.id,
            modal.education?.id,
            modal.language?.id,
            modal.selectedWork?.id,
          ]
            .filter(Boolean)
            .join('-') || `${modal.kind}-new`}
          open
          kind={modal.kind}
          workOptions={initialData.workOptions}
          initialExperience={modal.experience}
          initialEducation={modal.education}
          initialLanguage={modal.language}
          initialSelectedWork={modal.selectedWork}
          onClose={() => setModal(null)}
          onSaveExperience={(draft) => void handleSaveExperience(draft)}
          onSaveEducation={(draft) => void handleSaveEducation(draft)}
          onSaveLanguage={(draft) => void handleSaveLanguage(draft)}
          onSaveSelectedWork={(draft) => void handleSaveSelectedWork(draft)}
        />
      )}

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
