import 'server-only'

import { env } from '@/env'
import type { ResumePdfData } from '@/lib/resume/pdf-document'

async function getResumeFromConstants(): Promise<ResumePdfData> {
  const { RESUME_PAGE_DATA } = await import('@/constants/resume-page-data')
  return {
    name: RESUME_PAGE_DATA.name,
    role: RESUME_PAGE_DATA.role,
    contactLine: RESUME_PAGE_DATA.contactLine,
    experience: RESUME_PAGE_DATA.experience.map((e) => ({
      title: e.title,
      org: e.org,
      period: e.period,
      bullets: [...e.bullets],
    })),
    selectedWork: RESUME_PAGE_DATA.selectedWork.map((sw) => ({
      name: sw.name,
      note: sw.note,
    })),
    skills: [...RESUME_PAGE_DATA.skills],
    coreTools: [...RESUME_PAGE_DATA.coreTools],
    education: RESUME_PAGE_DATA.education.map((e) => ({
      title: e.title,
      note: e.note,
      period: e.period,
    })),
    languages: RESUME_PAGE_DATA.languages.map((l) => ({
      name: l.name,
      level: l.level,
    })),
  }
}

async function getResumeFromDb(): Promise<ResumePdfData | null> {
  const { resumeData } = await import('@/lib/data/resume.data')

  const profile = await resumeData.getProfile()

  if (!profile) return null

  return {
    name: profile.name,
    role: profile.role,
    contactLine: profile.contactLine,
    experience: profile.experiences.map((e: { title: string; org: string; period: string; bullets: string[] }) => ({
      title: e.title,
      org: e.org,
      period: e.period,
      bullets: e.bullets,
    })),
    selectedWork: profile.selectedWork.map((sw: { work: { title: string; metric: string; metricLabel: string }; noteOverride: string | null }) => ({
      name: sw.work.title,
      note:
        sw.noteOverride ??
        `${sw.work.metric} ${sw.work.metricLabel}`.trim(),
    })),
    skills: profile.skills,
    coreTools: profile.coreTools,
    education: profile.education.map((e: { title: string; note: string; period: string }) => ({
      title: e.title,
      note: e.note,
      period: e.period,
    })),
    languages: profile.languages.map((l: { name: string; level: string }) => ({
      name: l.name,
      level: l.level,
    })),
  }
}

export async function getResumeData(): Promise<ResumePdfData> {
  if (env.contentSource === 'db') {
    const dbData = await getResumeFromDb()
    if (dbData) return dbData
  }
  return getResumeFromConstants()
}
