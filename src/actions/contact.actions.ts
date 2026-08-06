'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import {
  CONTACT_HONEYPOT_FAKE_ID,
  CONTACT_RATE_LIMIT_EMAIL_WINDOW_MS,
  CONTACT_RATE_LIMIT_ERROR,
  CONTACT_RATE_LIMIT_GLOBAL_WINDOW_MS,
  CONTACT_RATE_LIMIT_IP_WINDOW_MS,
} from '@/constants/contact'
import { contactData } from '@/lib/data/contact.data'
import { requireAdminSession } from '@/lib/actions/helpers'
import {
  hashClientIp,
  isContactRateLimited,
  isHoneypotFilled,
  resolveClientIp,
} from '@/lib/contact/anti-abuse'
import { env } from '@/env'
import type { ActionResult } from '@/types/action.types'
import { submitContactSchema } from '@/validators/contact-action.schema'

function revalidateInbox(): void {
  revalidatePath('/admin')
  revalidatePath('/admin/messages')
}

function resolveIpHashSalt(): string {
  if (env.nextAuthSecret.length > 0) return env.nextAuthSecret
  return 'contact-ip-hash-dev-salt'
}

export async function submitContact(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = submitContactSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  if (isHoneypotFilled(parsed.data.website)) {
    return { success: true, data: { id: CONTACT_HONEYPOT_FAKE_ID } }
  }

  const headerStore = await headers()
  const clientIp = resolveClientIp(
    headerStore.get('x-forwarded-for'),
    headerStore.get('x-real-ip')
  )
  const sourceIpHash = clientIp
    ? hashClientIp(clientIp, resolveIpHashSalt())
    : null

  const now = Date.now()
  const email = parsed.data.email.trim().toLowerCase()

  const [ipCount, emailCount, globalCount] = await Promise.all([
    sourceIpHash
      ? contactData.countRecentByIpHash(
          sourceIpHash,
          new Date(now - CONTACT_RATE_LIMIT_IP_WINDOW_MS)
        )
      : Promise.resolve(0),
    contactData.countRecentByEmail(
      email,
      new Date(now - CONTACT_RATE_LIMIT_EMAIL_WINDOW_MS)
    ),
    contactData.countRecent(
      new Date(now - CONTACT_RATE_LIMIT_GLOBAL_WINDOW_MS)
    ),
  ])

  if (
    isContactRateLimited({
      ipCount,
      emailCount,
      globalCount,
      hasIpHash: sourceIpHash !== null,
    })
  ) {
    return { success: false, error: CONTACT_RATE_LIMIT_ERROR }
  }

  const msg = await contactData.create({
    name: parsed.data.name.trim(),
    email,
    message: parsed.data.message.trim(),
    sourceIpHash,
  })

  revalidateInbox()
  return { success: true, data: { id: msg.id } }
}

export async function markContactRead(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.markRead(id)
  revalidateInbox()
  return { success: true, data: null }
}

export async function archiveContact(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.archive(id)
  revalidateInbox()
  return { success: true, data: null }
}

export async function deleteContact(
  id: string
): Promise<ActionResult> {
  await requireAdminSession()
  await contactData.delete(id)
  revalidateInbox()
  return { success: true, data: null }
}
