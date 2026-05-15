/**
 * Frontend types for briefings and annotations.
 *
 * These mirror the contracts package shapes that will live in
 * `@goodparty_org/contracts` once Melecia and Swain publish them. Once those
 * land, replace the type bodies here with `export type X = ContractsX` re-exports
 * so the rest of the app does not need to change imports.
 */

// ---------------------------------------------------------------------------
// Briefing JSON (produced by Melecia, served by Swain)
// ---------------------------------------------------------------------------

export type BriefingStatus =
  | 'briefing_ready'
  | 'awaiting_agenda'
  | 'generating'
  | 'failed'

export type AgendaItemKind =
  | 'procedural'
  | 'consent'
  | 'public_input'
  | 'action'
  | 'informational'

export type SourceKind = 'internal' | 'official' | 'news' | 'community'

export type MeetingType = 'city_council' | 'planning_board' | 'town_hall'

export interface Source {
  id: string
  label: string
  kind: SourceKind
  iconInitial: string
  url: string | null
}

export interface AgendaItem {
  id: string
  title: string
  kind: AgendaItemKind
  hasBriefing: boolean
  /** Short description of what to expect for this item. Used for items
   *  that do not warrant a full action briefing (procedural, consent,
   *  public comment, informational). Optional. */
  whatToExpect?: string
}

export interface ConstituentSentiment {
  summary: string
  detail?: string
  sources: string[]
}

export interface NewsItem {
  title: string
  outlet: string
  url: string
}

export interface BudgetImpact {
  summary: string
  sources: string[]
}

export interface ActionItem {
  id: string
  title: string
  overview: string
  constituentSentiment: ConstituentSentiment | null
  recentNews: NewsItem[]
  budgetImpact: BudgetImpact | null
  talkingPoints: string[]
  sources: Source[]
}

export interface Meeting {
  id: string
  name: string
  body: string
  type: MeetingType
  scheduledAt: string // ISO 8601 with timezone
  location: string
}

export interface Briefing {
  id: string
  slug: string
  meetingId: string
  title: string
  meetingDate: string // human-readable, e.g. "June 1, 2026"
  status: BriefingStatus
  readingTimeMinutes: number
  generatedAt: string
  meeting: Meeting
  executiveSummary: string
  agenda: AgendaItem[]
  actionItems: ActionItem[]
}

/** Slim shape for the landing list. */
export interface BriefingSummary {
  id: string
  slug: string
  meetingDate: string
  meetingName: string
  meetingType: MeetingType
  scheduledAt: string
  location: string
  status: BriefingStatus
}

// ---------------------------------------------------------------------------
// Annotations (my system)
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
  id: string // ChatConversation id
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
