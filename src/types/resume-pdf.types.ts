export interface ResumeExperience {
  title: string
  org: string
  period: string
  bullets: string[]
}

export interface ResumeSelectedWork {
  name: string
  note: string
}

export interface ResumeEducation {
  title: string
  note: string
  period: string
}

export interface ResumeLanguage {
  name: string
  level: string
}

export interface ResumePdfData {
  name: string
  role: string
  contactLine: string
  experience: ResumeExperience[]
  selectedWork: ResumeSelectedWork[]
  skills: string[]
  coreTools: string[]
  education: ResumeEducation[]
  languages: ResumeLanguage[]
}
