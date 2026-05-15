/**
 * Frontend types for briefings and annotations.
 *
 * Briefing types mirror the v2 meeting_briefing artifact schema, sourced
 * from the agent manifest at:
 *   https://github.com/thegoodparty/runbooks/blob/main/experiments/meeting_briefing/manifest.json
 * Snake_case lives at the API boundary (see gpApi/api-endpoints.ts); these
 * types are camelCase, mapped by app/shared/briefings/server.ts.
 *
 * Internal QA fields from the artifact (claims, required_data_points,
 * disclosure, run_metadata, per-item research) are intentionally NOT
 * surfaced here yet; they can be added when we need to render them.
 */

// ---------------------------------------------------------------------------
// Briefing (v2 artifact)
// ---------------------------------------------------------------------------

export type BriefingStatus =
  | 'briefing_ready'
  | 'awaiting_agenda'
  | 'no_meeting_found'
  | 'agenda_provided_by_user'
  | 'error'

export type BriefingType =
  | 'city_council_meeting'
  | 'county_legislature_meeting'
  | 'school_board_meeting'

export type ItemTier = 'featured' | 'queued' | 'standard'

export type ArticleType =
  | 'reporting'
  | 'opinion'
  | 'editorial'
  | 'press_release'
  | 'government_communication'

export type SourceType =
  | 'agenda_packet'
  | 'news'
  | 'government_website'
  | 'campaign'
  | 'haystaq'

export type HaystaqStatus = 'ok' | 'no_match' | 'city_mismatch' | 'no_column'
export type HaystaqSource = 'curated' | 'dictionary_fallback'

// ---------------------------------------------------------------------------
// Item display
// ---------------------------------------------------------------------------

export interface ConstituentSentiment {
  summary: string
  detail?: string | null
  districtNote?: string | null
  haystaqColumn: string
  meanScore: number
  scoreDirection: string
  voterCount: number
  haystaqStatus: HaystaqStatus
  haystaqSource: HaystaqSource
  sourceIds: string[]
}

export interface RecentNewsEntry {
  headline: string
  publication: string
  articleType: ArticleType
  publicationDate?: string | null
  url: string
}

export interface BudgetImpactFigure {
  label: string
  value: string
  sourceId: string
}

export interface BudgetImpact {
  summary: string
  figures: BudgetImpactFigure[]
  sourceIds: string[]
}

export interface ItemDisplay {
  summary: string
  constituentSentiment?: ConstituentSentiment | null
  recentNews?: RecentNewsEntry[] | null
  budgetImpact?: BudgetImpact | null
  talkingPoints?: string[] | null
  sourceIds?: string[]
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

export interface Item {
  id: string
  itemNumber: string | null
  title: string
  tier: ItemTier
  voteRequired: boolean
  tierReason: string[]
  display: ItemDisplay
}

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

export interface Source {
  id: string
  name: string
  url?: string | null
  sourceType: SourceType
  publisher?: string | null
  articleType?: ArticleType | null
  publicationDate?: string | null
  pageNumber?: number | null
  sectionHeading?: string | null
  scoreValue?: number | null
}

// ---------------------------------------------------------------------------
// Briefing
// ---------------------------------------------------------------------------

export interface Briefing {
  experimentId: string
  briefingType: BriefingType
  briefingStatus: BriefingStatus
  generatedAt: string
  officialName: string
  meetingDate: string
  estimatedReadMinutes: number
  executiveSummary: string
  items: Item[]
  sources: Source[]
  /**
   * Computed display title. The v2 artifact does not carry one; we build
   * it in server.ts from briefingType + meetingDate.
   */
  title: string
}

/** Slim shape for the landing list. Coming from `GET /v1/meetings`. */
export interface BriefingSummary {
  id: string
  slug: string
  meetingDate: string
  meetingName: string
  scheduledAt: string
  location: string
  status: 'briefing_ready' | 'awaiting_agenda'
}

// ---------------------------------------------------------------------------
// Annotations (my system) — unchanged
// ---------------------------------------------------------------------------

export type AnnotationKind = 'note' | 'chat' | 'bug_report'
export type AnnotationResourceType = 'briefing'

export interface AnnotationAnchor {
  jsonPath: string | null
  start: number | null
  end: number | null
}

export interface AnnotationNoteAttachmentData {
  id: string
  fileName: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

export interface AnnotationNoteData {
  id: string
  body: string
  attachments: AnnotationNoteAttachmentData[]
  createdAt: string
  updatedAt: string
}

export interface AnnotationChatData {
  id: string
  createdAt: string
}

export interface AnnotationBugReportData {
  id: string
  description: string
  submittedAt: string
}

export interface Annotation {
  id: string
  kind: AnnotationKind
  resourceType: AnnotationResourceType
  resourceId: string
  authorUserId: number
  jsonPath: string | null
  start: number | null
  end: number | null
  createdAt: string
  updatedAt: string
  note?: AnnotationNoteData
  chat?: AnnotationChatData
  bugReport?: AnnotationBugReportData
}

export type CreateAnnotationInput =
  | {
      kind: 'note'
      anchor: AnnotationAnchor
      payload: { body: string }
    }
  | {
      kind: 'bug_report'
      anchor: AnnotationAnchor
      payload: { description: string }
    }
  | {
      kind: 'chat'
      anchor: AnnotationAnchor
      payload: { firstMessage: string | null }
    }

// ---------------------------------------------------------------------------
// Chat (owned by Collin's team; mirrored here for stub during dev)
// ---------------------------------------------------------------------------

export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface ChatMessage {
  id: string
  conversationId: string
  role: ChatMessageRole
  content: string
  createdAt: string
}

export interface ChatConversation {
  id: string
  ownerUserId: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
