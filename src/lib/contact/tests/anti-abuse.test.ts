import { describe, expect, it } from 'vitest'

import {
  CONTACT_RATE_LIMIT_EMAIL_MAX,
  CONTACT_RATE_LIMIT_GLOBAL_MAX,
  CONTACT_RATE_LIMIT_IP_MAX,
} from '@/constants/contact'
import {
  hashClientIp,
  isContactRateLimited,
  isHoneypotFilled,
  resolveClientIp,
} from '@/lib/contact/anti-abuse'

describe('isHoneypotFilled', () => {
  it('returns false when website is undefined or blank', () => {
    expect(isHoneypotFilled(undefined)).toBe(false)
    expect(isHoneypotFilled('')).toBe(false)
    expect(isHoneypotFilled('   ')).toBe(false)
  })

  it('returns true when website has content', () => {
    expect(isHoneypotFilled('https://spam.example')).toBe(true)
  })
})

describe('resolveClientIp', () => {
  it('prefers the first x-forwarded-for hop', () => {
    expect(resolveClientIp('203.0.113.10, 10.0.0.1', '127.0.0.1')).toBe(
      '203.0.113.10'
    )
  })

  it('falls back to x-real-ip when forwarded-for is missing', () => {
    expect(resolveClientIp(null, '198.51.100.2')).toBe('198.51.100.2')
  })

  it('returns null when no IP headers are present', () => {
    expect(resolveClientIp(null, null)).toBe(null)
    expect(resolveClientIp('  ', '')).toBe(null)
  })
})

describe('hashClientIp', () => {
  it('returns a stable sha256 hex for the same ip and salt', () => {
    const a = hashClientIp('203.0.113.10', 'test-salt')
    const b = hashClientIp('203.0.113.10', 'test-salt')
    expect(a).toBe(b)
    expect(a).toMatch(/^[a-f0-9]{64}$/)
  })

  it('changes when the salt changes', () => {
    expect(hashClientIp('203.0.113.10', 'salt-a')).not.toBe(
      hashClientIp('203.0.113.10', 'salt-b')
    )
  })
})

describe('isContactRateLimited', () => {
  it('returns false under all caps', () => {
    expect(
      isContactRateLimited({
        ipCount: CONTACT_RATE_LIMIT_IP_MAX - 1,
        emailCount: CONTACT_RATE_LIMIT_EMAIL_MAX - 1,
        globalCount: CONTACT_RATE_LIMIT_GLOBAL_MAX - 1,
        hasIpHash: true,
      })
    ).toBe(false)
  })

  it('returns true when the IP cap is reached', () => {
    expect(
      isContactRateLimited({
        ipCount: CONTACT_RATE_LIMIT_IP_MAX,
        emailCount: 0,
        globalCount: 0,
        hasIpHash: true,
      })
    ).toBe(true)
  })

  it('skips the IP cap when no IP hash is available', () => {
    expect(
      isContactRateLimited({
        ipCount: CONTACT_RATE_LIMIT_IP_MAX,
        emailCount: 0,
        globalCount: 0,
        hasIpHash: false,
      })
    ).toBe(false)
  })

  it('returns true when the email or global cap is reached', () => {
    expect(
      isContactRateLimited({
        ipCount: 0,
        emailCount: CONTACT_RATE_LIMIT_EMAIL_MAX,
        globalCount: 0,
        hasIpHash: true,
      })
    ).toBe(true)

    expect(
      isContactRateLimited({
        ipCount: 0,
        emailCount: 0,
        globalCount: CONTACT_RATE_LIMIT_GLOBAL_MAX,
        hasIpHash: true,
      })
    ).toBe(true)
  })
})
