import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  contactLine: z.string().min(1),
  skills: z.array(z.string().min(1)),
  coreTools: z.array(z.string().min(1)),
})

export const upsertExperienceSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().min(1),
  title: z.string().min(1),
  org: z.string().min(1),
  period: z.string().min(1),
  bullets: z.array(z.string().min(1)),
  sortOrder: z.number().int().min(0).optional(),
})

export const upsertEducationSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().min(1),
  title: z.string().min(1),
  note: z.string().min(1),
  period: z.string().min(1),
  sortOrder: z.number().int().min(0).optional(),
})

export const upsertLanguageSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().min(1),
  name: z.string().min(1),
  level: z.string().min(1),
  sortOrder: z.number().int().min(0).optional(),
})

export const addSelectedWorkSchema = z.object({
  profileId: z.string().min(1),
  workId: z.string().min(1),
  noteOverride: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export const updateSelectedWorkSchema = z.object({
  id: z.string().min(1),
  noteOverride: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpsertExperienceInput = z.infer<typeof upsertExperienceSchema>
export type UpsertEducationInput = z.infer<typeof upsertEducationSchema>
export type UpsertLanguageInput = z.infer<typeof upsertLanguageSchema>
export type AddSelectedWorkInput = z.infer<typeof addSelectedWorkSchema>
export type UpdateSelectedWorkInput = z.infer<typeof updateSelectedWorkSchema>
