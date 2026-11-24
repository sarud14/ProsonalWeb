import {
  LANDING_COUNT_MIN_DIGITS,
  LANDING_COUNT_TOKENS,
} from '@/constants/landing-count-tokens'
import type { LandingCounts } from '@/types/landing.types'
import type { WorkCaseStudy } from '@/types/work.types'

export function buildLandingCounts(
  works: readonly Pick<WorkCaseStudy, 'domains'>[],
): LandingCounts {
  const domains = new Set(works.flatMap((work) => work.domains.map((d) => d.trim())).filter(Boolean))
  return { workCount: works.length, domainCount: domains.size }
}

export function padLandingNumber(count: number): string {
  return String(count).padStart(LANDING_COUNT_MIN_DIGITS, '0')
}

export function fillLandingCountTokens(text: string, counts: LandingCounts): string {
  return text
    .replaceAll(LANDING_COUNT_TOKENS.WORK_COUNT, padLandingNumber(counts.workCount))
    .replaceAll(LANDING_COUNT_TOKENS.DOMAIN_COUNT, padLandingNumber(counts.domainCount))
}
