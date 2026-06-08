// Single source of truth for the campaign-plan section order, titles, and
// numbering. Both the on-screen plan (`components/PlanSections.tsx`) and the
// downloadable PDF (`pdf/CampaignPlanPdfDocument.tsx`) derive their ordering,
// titles, and 1-based numbering from this list so the two views can't drift
// apart. Order matches the ClickUp campaign-plan template (the product
// source of truth).

export type PlanSectionKey =
  | 'executiveSummary'
  | 'strategicLandscape'
  | 'electoralGoals'
  | 'voterInsights'
  | 'resources'
  | 'timeline'
  | 'community'
  | 'voterContact'
  | 'measurement'
  | 'methodology'
  | 'glossary'

export interface PlanSectionDef {
  key: PlanSectionKey
  title: string
  // Strategic Landscape is the only section that can be hidden — it drops
  // out when the strategy agent fails or returns empty. Every other section
  // always renders.
  optional?: boolean
}

export const PLAN_SECTION_ORDER: readonly PlanSectionDef[] = [
  { key: 'executiveSummary', title: 'Executive Summary' },
  { key: 'strategicLandscape', title: 'Strategic Landscape', optional: true },
  { key: 'electoralGoals', title: 'Electoral Goals & Key Metrics' },
  { key: 'voterInsights', title: 'Voter Insights For Your District' },
  { key: 'resources', title: 'Projected Minimum Resources Needed' },
  { key: 'timeline', title: 'Campaign Timeline' },
  { key: 'community', title: 'Community Engagement & Earned Media' },
  { key: 'voterContact', title: 'Voter Contact Plan' },
  { key: 'measurement', title: 'Measurement & Accountability' },
  { key: 'methodology', title: 'Methodology & Data Sources' },
  { key: 'glossary', title: 'Glossary' },
]

export interface NumberedPlanSection extends PlanSectionDef {
  number: number
}

// Returns the visible sections in order, each carrying its 1-based display
// number. When Strategic Landscape is hidden, the sections after it shift up
// so numbering stays contiguous (1, 2, 3 … with no gap).
export const getNumberedPlanSections = (
  showStrategicLandscape: boolean,
): NumberedPlanSection[] =>
  PLAN_SECTION_ORDER.filter(
    (section) => showStrategicLandscape || !section.optional,
  ).map((section, index) => ({ ...section, number: index + 1 }))
