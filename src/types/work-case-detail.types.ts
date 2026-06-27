export interface WorkCaseMetaItem {
  readonly label: string
  readonly value: string
}

export interface WorkCaseStatItem {
  readonly value: string
  readonly label: string
}

export interface WorkCaseConstraintItem {
  readonly tag: string
  readonly kind: string
  readonly title: string
  readonly body: string
}

export interface WorkCaseTierNode {
  readonly name: string
  readonly note: string
}

export interface WorkCaseTier {
  readonly label: string
  readonly code: string
  readonly connector: string | null
  readonly nodes: readonly WorkCaseTierNode[]
}

export interface WorkCaseDecisionItem {
  readonly id: string
  readonly title: string
  readonly context: string
  readonly tradeoff: string
}

export interface WorkCaseContextAsideItem {
  readonly label: string
  readonly value: string
}

export interface WorkCaseDetail {
  readonly contextHeadline: string
  readonly contextParagraphs: readonly string[]
  readonly contextAside: readonly WorkCaseContextAsideItem[]
  readonly problemCallout: string
  readonly problemStats: readonly WorkCaseStatItem[]
  readonly constraintsHeading: string
  readonly constraints: readonly WorkCaseConstraintItem[]
  readonly architectureHeadline: string
  readonly architectureBody: string
  readonly tiers: readonly WorkCaseTier[]
  readonly decisionsHeading: string
  readonly decisions: readonly WorkCaseDecisionItem[]
  readonly impactHeading: string
  readonly impact: readonly WorkCaseStatItem[]
  readonly outcomes: readonly string[]
}

export interface WorkCaseSectionLink {
  readonly id: string
  readonly num: string
  readonly label: string
}

export interface WorkCaseDetailViewProps {
  readonly work: import('@/types/work.types').WorkCaseStudy
  readonly detail: WorkCaseDetail
}

export interface WorkCaseContentsRailProps {
  readonly sections: readonly WorkCaseSectionLink[]
}

export interface WorkCaseSectionHeaderProps {
  readonly num: string
  readonly label: string
}
