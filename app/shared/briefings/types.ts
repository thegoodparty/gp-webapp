/**
 * Frontend types for briefings and annotations.
 *
 * Briefing types are sourced from the generated agent contract at
 *   gpApi/generated/agent-job-contracts.ts
 * which mirrors runbooks/experiments/meeting_briefing/manifest.json. Field
 * names stay snake_case (the agent emits snake_case JSON and gp-api passes
 * the artifact through untouched).
 *
 * Internal QA fields from the artifact (claims, required_data_points,
 * disclosure, run_metadata, per-item research) are present on the type but
 * not currently rendered.
 */

import type {
  MeetingBriefingFull,
  MeetingBriefingPlaceholder,
} from 'gpApi/generated/agent-job-contracts'

// ---------------------------------------------------------------------------
// Briefing (v2 artifact)
// ---------------------------------------------------------------------------

export type BriefingStatus =
  | MeetingBriefingFull['briefing_status']
  | MeetingBriefingPlaceholder['briefing_status']

export type BriefingType = MeetingBriefingFull['briefing_type']

export type Item = MeetingBriefingFull['items'][number]
export type ItemTier = Item['tier']
export type ItemDisplay = Item['display']

export type ConstituentSentiment = NonNullable<
  ItemDisplay['constituent_sentiment']
>
export type RecentNewsEntry = NonNullable<ItemDisplay['recent_news']>[number]
export type BudgetImpact = NonNullable<ItemDisplay['budget_impact']>
export type BudgetImpactFigure = BudgetImpact['figures'][number]

export type Source = MeetingBriefingFull['sources'][number]
export type SourceType = Source['source_type']
export type ArticleType = NonNullable<Source['article_type']>

export type HaystaqStatus = ConstituentSentiment['haystaq_status']

/**
 * Full briefing artifact plus a computed display title built in
 * `app/shared/briefings/server.ts` from briefing_type + meeting_date, and the
 * Prisma row UUID (`briefing_id`) returned alongside the artifact by
 * `GET /v1/meetings/:date/briefing`. The UUID powers public share URLs of
 * the form `goodparty.org/api/v1/briefings/{uuid}`.
 */
export type Briefing = MeetingBriefingFull & {
  title: string
  briefing_id: string
  /**
   * Local meeting start time as `HH:MM` (24h). Present in the gp-api briefing
   * artifact even though the generated `MeetingBriefingFull` type is stale and
   * doesn't list it yet. Marked optional to remain safe if the artifact omits
   * the field.
   */
  meeting_time?: string
  /** IANA tz name for `meeting_time`. Same caveat as `meeting_time`. */
  meeting_timezone?: string
}

/**
 * Returned by getBriefingBySlug when the API signals no agenda yet.
 * Meeting metadata is populated from the org's known schedule.
 */
export interface AwaitingBriefing {
  status: 'awaiting_agenda'
  slug: string
  meetingName: string
  meetingDate: string
  meetingTime: string
  meetingTimezone: string
  location: string
  durationMinutes: number
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

export type OcrStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'skipped'

export interface AnnotationNoteAttachmentData {
  id: string
  fileName: string
  mimeType: string
  sizeBytes: number
  ocrStatus: OcrStatus
  ocrText: string | null
  ocrError: string | null
  ocrCompletedAt: string | null
  createdAt: string
}

export interface AnnotationNoteData {
  id: string
  /** Optional once Phase 2's attachment-only flow ships. */
  body: string | null
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
      /** body is optional for attachment-only notes (Phase 2). */
      payload: { body?: string }
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
