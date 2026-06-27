export interface ResumeExperienceRole {
  readonly title: string
  readonly org: string
  readonly period: string
  readonly bullets: readonly string[]
}

export interface ResumeSelectedWorkItem {
  readonly name: string
  readonly note: string
}

export interface ResumeEducationItem {
  readonly title: string
  readonly note: string
  readonly period: string
}

export interface ResumeLanguageItem {
  readonly name: string
  readonly level: string
}

export interface ResumePageData {
  readonly name: string
  readonly role: string
  readonly contactLine: string
  readonly experience: readonly ResumeExperienceRole[]
  readonly selectedWork: readonly ResumeSelectedWorkItem[]
  readonly skills: readonly string[]
  readonly coreTools: readonly string[]
  readonly education: readonly ResumeEducationItem[]
  readonly languages: readonly ResumeLanguageItem[]
}
