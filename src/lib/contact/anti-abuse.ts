import { createHash } from 'node:crypto'

import {
  CONTACT_RATE_LIMIT_EMAIL_MAX,
  CONTACT_RATE_LIMIT_GLOBAL_MAX,
  CONTACT_RATE_LIMIT_IP_MAX,
} from '@/constants/contact'

export function isHoneypotFilled(website: string | undefined): boolean {
  return typeof website === 'string' && website.trim().length > 0
}

export function resolveClientIp(
  forwardedFor: string | null,
  realIp: string | null
): string | null {
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first && first.length > 0) return first
  }

  const trimmed = realIp?.trim()
  if (trimmed && trimmed.length > 0) return trimmed

  return null
}

export function hashClientIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export interface ContactRateLimitCounts {
  readonly ipCount: number
  readonly emailCount: number
  readonly globalCount: number
  readonly hasIpHash: boolean
}

export function isContactRateLimited(counts: ContactRateLimitCounts): boolean {
  if (counts.globalCount >= CONTACT_RATE_LIMIT_GLOBAL_MAX) return true
  if (counts.emailCount >= CONTACT_RATE_LIMIT_EMAIL_MAX) return true
  if (counts.hasIpHash && counts.ipCount >= CONTACT_RATE_LIMIT_IP_MAX) {
    return true
  }
  return false
}
