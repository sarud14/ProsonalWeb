// Tokens that landing stats / module labels can contain instead of a hand-typed
// number, so counts follow the published content and never go stale.
export const LANDING_COUNT_TOKENS = {
  WORK_COUNT: '{workCount}',
  DOMAIN_COUNT: '{domainCount}',
} as const

export const LANDING_COUNT_MIN_DIGITS = 2
