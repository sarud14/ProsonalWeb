import type { FocusRoadmapDot } from '@/constants/focus'

export interface FocusRoadmapItem {
  readonly title: string
  readonly note: string
  readonly dot: FocusRoadmapDot
}

export interface FocusRoadmapColumn {
  readonly phase: string
  readonly tag: string
  readonly items: readonly FocusRoadmapItem[]
}

export interface FocusReadingItem {
  readonly idx: string
  readonly title: string
}

export interface FocusPageData {
  readonly updatedLabel: string
  readonly topic: string
  readonly intro: string
  readonly roadmap: readonly FocusRoadmapColumn[]
  readonly learning: readonly string[]
  readonly reading: readonly FocusReadingItem[]
}

export interface FocusPageViewProps {
  readonly data: FocusPageData
}
