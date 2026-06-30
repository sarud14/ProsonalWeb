export interface ResumeProfileFormState {
  readonly id?: string
  readonly name: string
  readonly role: string
  readonly contactLine: string
  readonly skills: readonly string[]
  readonly coreTools: readonly string[]
}

export interface ResumeExperienceItem {
  readonly id: string
  readonly title: string
  readonly org: string
  readonly period: string
  readonly bullets: readonly string[]
  readonly sortOrder: number
}

export interface ResumeEducationItem {
  readonly id: string
  readonly title: string
  readonly note: string
  readonly period: string
  readonly sortOrder: number
}

export interface ResumeLanguageItem {
  readonly id: string
  readonly name: string
  readonly level: string
  readonly sortOrder: number
}

export interface ResumeSelectedWorkItem {
  readonly id: string
  readonly workId: string
  readonly workTitle: string
  readonly noteOverride: string | null
  readonly sortOrder: number
}

export interface ResumeWorkOption {
  readonly id: string
  readonly title: string
}

export interface ResumePageData {
  readonly profile: ResumeProfileFormState
  readonly experiences: readonly ResumeExperienceItem[]
  readonly education: readonly ResumeEducationItem[]
  readonly languages: readonly ResumeLanguageItem[]
  readonly selectedWork: readonly ResumeSelectedWorkItem[]
  readonly workOptions: readonly ResumeWorkOption[]
}

export type ResumeEntryKind = 'experience' | 'education' | 'language' | 'selectedWork'

export interface ResumePageViewProps {
  readonly initialData: ResumePageData
}

export interface ResumeExperienceDraft {
  readonly id?: string
  readonly title: string
  readonly org: string
  readonly period: string
  readonly bullets: readonly string[]
}

export interface ResumeEducationDraft {
  readonly id?: string
  readonly title: string
  readonly note: string
  readonly period: string
}

export interface ResumeLanguageDraft {
  readonly id?: string
  readonly name: string
  readonly level: string
}

export interface ResumeSelectedWorkDraft {
  readonly id?: string
  readonly workId: string
  readonly noteOverride: string
}
