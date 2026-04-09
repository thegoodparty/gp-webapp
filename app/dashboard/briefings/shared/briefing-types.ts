/**
 * Briefing wire format types — match the meeting_pipeline JSON output.
 * See: gp-ai-projects/meeting_pipeline/scripts/generate_briefing.py
 *
 * TODO: When pipeline renames card → guidance and detail → analysis,
 *       update PriorityIssue fields here to match.
 */

export type PriorityIssueGuidance = {
  headline: string
  whatYouNeedToDo: string
  askThisInTheRoom: string
  tryThis: string | null
  actionButtons: unknown[]
}

export type PriorityIssueAnalysis = {
  whatIsHappening: string
  whatDecision: string
  whyItMatters: string
  recommendation: string
  actionItem: string
  askThis: string
  tryThis: string | null
  whoIsPresenting: string
  supportingContext: string | null
  supportingDocuments: { name: string; url: string }[]
}

export type PriorityIssue = {
  number: number
  slug: string
  agendaItemTitle: string
  category: string
  // TODO: rename card → guidance, detail → analysis in pipeline then update here
  card: PriorityIssueGuidance
  detail?: PriorityIssueAnalysis
}

export type FullAgendaItem = {
  number: string
  title: string
  description: string
  category: string
  isPriority?: boolean
  priorityNumber?: number
}

export type Briefing = {
  version: string
  generatedAt: string
  generationModel: string
  generationCostUsd?: number

  meeting: {
    citySlug: string
    cityName: string
    state: string
    body: string
    date: string
    time: string | null
    title: string
    readTime: string
    sourceUrl: string | null
    sourceType: string
  }

  executiveSummary: {
    headline: string
    subheadline: string
    priorityItemCount: number
    totalAgendaItems: number
  }

  priorityIssues: PriorityIssue[]
  fullAgenda: FullAgendaItem[]
  fullAgendaSummary: string

  constituentData: {
    available: boolean
    voterCount: number | null
    topIssues: { name: string; score: number; tier: string }[]
    ideology: Record<string, number> | null
  }

  footer: {
    preparedBy: string
    contactNote: string
  }
}

export type BriefingListItem = {
  citySlug: string
  cityName: string
  state: string
  date: string
  title: string
  readTime: string
  priorityItemCount: number
  totalAgendaItems: number
  executiveHeadline: string
}
