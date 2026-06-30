'use server'

import { revalidatePath } from 'next/cache'

import { resumeData } from '@/lib/data/resume.data'
import { createRevision, requireAdminSession } from '@/lib/actions/helpers'
import type { ActionResult } from '@/types/action.types'
import {
  updateProfileSchema,
  upsertExperienceSchema,
  upsertEducationSchema,
  upsertLanguageSchema,
  addSelectedWorkSchema,
  updateSelectedWorkSchema,
} from '@/validators/resume-action.schema'

const RESUME_PATHS = ['/resume'] as const

function revalidateResume(): void {
  for (const p of RESUME_PATHS) revalidatePath(p)
}

export async function updateResumeProfile(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const existing = await resumeData.getProfile()
  if (existing) {
    await createRevision('resume', existing.id, existing)
    const profile = await resumeData.updateProfile(existing.id, parsed.data)
    revalidateResume()
    return { success: true, data: { id: profile.id } }
  }

  const profile = await resumeData.createProfile(
    parsed.data as { name: string; role: string; contactLine: string }
  )
  revalidateResume()
  return { success: true, data: { id: profile.id } }
}

export async function upsertExperience(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = upsertExperienceSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  if (id) {
    const exp = await resumeData.updateExperience(id, {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    })
    revalidateResume()
    return { success: true, data: { id: exp.id } }
  }

  const exp = await resumeData.createExperience({
    ...data,
    sortOrder: data.sortOrder ?? 0,
  })
  revalidateResume()
  return { success: true, data: { id: exp.id } }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdminSession()
  await resumeData.deleteExperience(id)
  revalidateResume()
  return { success: true, data: null }
}

export async function upsertEducation(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = upsertEducationSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  if (id) {
    const edu = await resumeData.updateEducation(id, {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    })
    revalidateResume()
    return { success: true, data: { id: edu.id } }
  }

  const edu = await resumeData.createEducation({
    ...data,
    sortOrder: data.sortOrder ?? 0,
  })
  revalidateResume()
  return { success: true, data: { id: edu.id } }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await requireAdminSession()
  await resumeData.deleteEducation(id)
  revalidateResume()
  return { success: true, data: null }
}

export async function upsertLanguage(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = upsertLanguageSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data

  if (id) {
    const lang = await resumeData.updateLanguage(id, {
      ...data,
      sortOrder: data.sortOrder ?? 0,
    })
    revalidateResume()
    return { success: true, data: { id: lang.id } }
  }

  const lang = await resumeData.createLanguage({
    ...data,
    sortOrder: data.sortOrder ?? 0,
  })
  revalidateResume()
  return { success: true, data: { id: lang.id } }
}

export async function deleteLanguage(id: string): Promise<ActionResult> {
  await requireAdminSession()
  await resumeData.deleteLanguage(id)
  revalidateResume()
  return { success: true, data: null }
}

export async function addSelectedWork(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = addSelectedWorkSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const sw = await resumeData.createSelectedWork(parsed.data)

  revalidateResume()
  return { success: true, data: { id: sw.id } }
}

export async function updateSelectedWork(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAdminSession()

  const parsed = updateSelectedWorkSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const { id, ...data } = parsed.data
  const sw = await resumeData.updateSelectedWork(id, data)

  revalidateResume()
  return { success: true, data: { id: sw.id } }
}

export async function removeSelectedWork(id: string): Promise<ActionResult> {
  await requireAdminSession()
  await resumeData.deleteSelectedWork(id)
  revalidateResume()
  return { success: true, data: null }
}
