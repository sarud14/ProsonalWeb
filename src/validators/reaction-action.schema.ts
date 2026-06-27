import { z } from 'zod'

const CONTENT_TYPES = ['work', 'journal', 'engineering'] as const
const REACTION_KINDS = ['like', 'insightful', 'helpful'] as const

export const addReactionSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  slug: z.string().min(1).max(255),
  kind: z.enum(REACTION_KINDS),
})

export const getReactionsSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  slug: z.string().min(1).max(255),
})
