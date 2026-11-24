import { SITE_FOOTER_BUILD_MONTH_TOKEN } from '@/constants/site-footer'

export function formatBuildMonth(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${date.getUTCFullYear()}.${month}`
}

export function fillBuildMonthToken(label: string, date: Date): string {
  return label.replaceAll(SITE_FOOTER_BUILD_MONTH_TOKEN, formatBuildMonth(date))
}
