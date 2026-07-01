export const SITE_AVAILABILITY_LABEL = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
} as const

export interface SiteAvailabilityDisplay {
  readonly label: string
  readonly dotClassName: string
  readonly textClassName: string
}

export function getSiteAvailabilityDisplay(isAvailable: boolean): SiteAvailabilityDisplay {
  if (isAvailable) {
    return {
      label: SITE_AVAILABILITY_LABEL.AVAILABLE,
      dotClassName: 'bg-success animate-pulse',
      textClassName: 'text-success',
    }
  }

  return {
    label: SITE_AVAILABILITY_LABEL.UNAVAILABLE,
    dotClassName: 'bg-destructive',
    textClassName: 'text-destructive',
  }
}
