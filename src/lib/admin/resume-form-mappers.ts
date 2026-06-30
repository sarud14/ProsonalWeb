import type {
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeLanguageItem,
  ResumePageData,
  ResumeProfileFormState,
  ResumeSelectedWorkItem,
  ResumeWorkOption,
} from '@/types/admin-resume.types'

interface DbResumeProfile {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly contactLine: string
  readonly skills: readonly string[]
  readonly coreTools: readonly string[]
  readonly experiences: readonly {
    readonly id: string
    readonly title: string
    readonly org: string
    readonly period: string
    readonly bullets: readonly string[]
    readonly sortOrder: number
  }[]
  readonly education: readonly {
    readonly id: string
    readonly title: string
    readonly note: string
    readonly period: string
    readonly sortOrder: number
  }[]
  readonly languages: readonly {
    readonly id: string
    readonly name: string
    readonly level: string
    readonly sortOrder: number
  }[]
  readonly selectedWork: readonly {
    readonly id: string
    readonly workId: string
    readonly noteOverride: string | null
    readonly sortOrder: number
    readonly work: { readonly title: string }
  }[]
}

export function emptyResumeProfile(): ResumeProfileFormState {
  return {
    name: '',
    role: '',
    contactLine: '',
    skills: [],
    coreTools: [],
  }
}

export function mapResumePageData(
  profile: DbResumeProfile | null,
  workOptions: readonly ResumeWorkOption[]
): ResumePageData {
  if (!profile) {
    return {
      profile: emptyResumeProfile(),
      experiences: [],
      education: [],
      languages: [],
      selectedWork: [],
      workOptions,
    }
  }

  const experiences: ResumeExperienceItem[] = profile.experiences.map((item) => ({
    id: item.id,
    title: item.title,
    org: item.org,
    period: item.period,
    bullets: [...item.bullets],
    sortOrder: item.sortOrder,
  }))

  const education: ResumeEducationItem[] = profile.education.map((item) => ({
    id: item.id,
    title: item.title,
    note: item.note,
    period: item.period,
    sortOrder: item.sortOrder,
  }))

  const languages: ResumeLanguageItem[] = profile.languages.map((item) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    sortOrder: item.sortOrder,
  }))

  const selectedWork: ResumeSelectedWorkItem[] = profile.selectedWork.map((item) => ({
    id: item.id,
    workId: item.workId,
    workTitle: item.work.title,
    noteOverride: item.noteOverride,
    sortOrder: item.sortOrder,
  }))

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      contactLine: profile.contactLine,
      skills: [...profile.skills],
      coreTools: [...profile.coreTools],
    },
    experiences,
    education,
    languages,
    selectedWork,
    workOptions,
  }
}
