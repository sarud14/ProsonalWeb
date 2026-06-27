'use server'

import { reactionData } from '@/lib/data/reaction.data'
import type { ActionResult } from '@/types/action.types'
import { addReactionSchema, getReactionsSchema } from '@/validators/reaction-action.schema'

export async function addReaction(
  input: unknown
): Promise<ActionResult<{ count: number }>> {
  const parsed = addReactionSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const reaction = await reactionData.increment(
    parsed.data.contentType,
    parsed.data.slug,
    parsed.data.kind
  )
  return { success: true, data: { count: reaction.count } }
}

export async function getReactions(
  input: unknown
): Promise<ActionResult<{ reactions: { kind: string; count: number }[] }>> {
  const parsed = getReactionsSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const rows = await reactionData.getByContent(
    parsed.data.contentType,
    parsed.data.slug
  )
  return {
    success: true,
    data: {
      reactions: rows.map((r: { kind: string; count: number }) => ({
        kind: r.kind,
        count: r.count,
      })),
    },
  }
}
