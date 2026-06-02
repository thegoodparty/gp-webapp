import type { Race } from 'app/onboarding/[slug]/[step]/components/ballotOffices/types'
import type {
  SynthesizeSpeechRequest,
  SynthesizeSpeechResponse,
  TranscribeSessionRequest,
  TranscribeSessionResponse,
} from 'app/dashboard/briefings/shared/speech-types'
import type { Poll } from 'app/dashboard/polls/shared/poll-types'
import { Campaign, CampaignDetails, User } from 'helpers/types'
import type { ContactsStats } from 'app/dashboard/polls/shared/queries'
import type { GetPollIssuesResponse } from 'app/dashboard/polls/shared/serverApiCalls'
import type {
  SegmentResponse,
  Person,
  ListContactsResponse,
  GetConstituentIssuesResponse,
  GetIndividualActivitiesResponse,
} from 'app/dashboard/contacts/[[...attr]]/components/shared/contacts-types'
import type { AnnotationAnchor, ChatMessage } from 'app/shared/briefings/types'
import { MeetingBriefingOutput } from './generated/agent-job-contracts'

export interface MeetingsListItemDto {
  meetingDate: string
  meetingTime: string
  meetingTimezone: string
  durationMinutes: number
  meetingName: string
  location: string
  hasBriefing: boolean
}

export interface MeetingsListResponseDto {
  scheduleKnown: boolean
  meetings: MeetingsListItemDto[]
}

/**
 * gp-api emits this shape (not part of the agent artifact) when no
 * MeetingBriefing row exists for the requested date. Distinguished from a
 * `MeetingBriefingPlaceholder` artifact by the top-level `status` field.
 */
export interface MeetingBriefingAwaitingDto {
  status: 'awaiting_agenda'
  meetingDate: string
  meetingName: string
  meetingTime: string
  meetingTimezone: string
  location: string
  durationMinutes: number
}

// Mirrors `OpponentSchema` in gp-api
// (`src/campaignStrategy/schemas/strategicLandscape.schema.ts`). `incumbent`
// is nullable because the LLM may legitimately not know.
export interface StrategicLandscapeOpponent {
  fullName: string
  partyAffiliation: string
  incumbent: boolean | null
  politicalSummary: string
  keyFacts: string[]
  websites: string[]
}

export interface StrategicLandscapeData {
  opportunities: string[]
  challenges: string[]
  opponents: StrategicLandscapeOpponent[]
}

// Discriminated union matching the polling response on gp-api.
export type StrategicLandscapeResponse =
  | { status: 'ready'; data: StrategicLandscapeData }
  | { status: 'generating' }

// Mirrors `CommunityEventSchema` in
// `gp-api/src/campaignStrategy/schemas/communityEvents.schema.ts`.
// `address` is the venue's physical street address and `url` is the
// direct event-page URL. Either can be null when the search data
// didn't surface it.
export interface CommunityEvent {
  title: string
  description: string
  date: string
  address: string | null
  url: string | null
}

export interface CommunityEventsData {
  events: CommunityEvent[]
}

export type CommunityEventsResponse =
  | { status: 'ready'; data: CommunityEventsData }
  | { status: 'generating' }

export type APIEndpoints = {
  'GET /v1/users/me': {
    Request: {}
    Response: User
  }

  'GET /v1/organizations': {
    Request: {}
    Response: {
      organizations: Organization[]
    }
  }
  'GET /v1/organizations/:slug': {
    Request: {}
    Response: Organization
  }

  'PATCH /v1/organizations/:slug': {
    Request: {
      ballotReadyPositionId?: string | null | undefined
      overrideDistrictId?: string | null | undefined
      customPositionName?: string | null | undefined
    }
    Response: Organization
  }

  'GET /v1/campaigns/mine': {
    Request: {}
    Response: Campaign
  }

  'GET /v1/campaigns/mine/status': {
    Request: {}
    Response: {
      status: string | false
      slug?: string
      step?: number
    }
  }

  'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin': {
    Request: {
      pin: string
    }
    Response: void
  }

  // Polling endpoint. 200 → ready, 202 → still generating (poll again ~3s).
  // First-time generation runs three Gemini pipelines in parallel; on cache
  // hit subsequent calls return 200 immediately. Mirrors
  // `StrategicLandscapeResponseSchema` on gp-api.
  'POST /v1/campaignStrategy/mine/strategic-landscape': {
    Request: {}
    Response: StrategicLandscapeResponse
  }

  // Section 7 community events. Polling endpoint — same shape as
  // strategic-landscape. 200 → ready (events array up to length 3), 202 →
  // generating (poll again ~3s). Mirrors `CommunityEventsResponseSchema`
  // in `gp-api/src/campaignStrategy/schemas/communityEvents.schema.ts`.
  'POST /v1/campaignStrategy/mine/community-events': {
    Request: {}
    Response: CommunityEventsResponse
  }

  'GET /v1/elected-office/current': {
    Request: {}
    Response: ElectedOffice
  }

  'POST /v1/elected-office': {
    Request: {}
    Response: ElectedOffice
  }

  'POST /v1/meetings/briefings/dispatch': {
    Request: {
      electedOfficeId: string
      kind: 'schedule' | 'briefing'
    }
    Response: { dispatched: true; kind: 'schedule' | 'briefing' }
  }

  'GET /v1/contacts/stats': {
    Request: {}
    Response: ContactsStats
  }

  'GET /v1/onboarding/contacts/stats': {
    Request: {
      ballotReadyPositionId?: string
      districtId?: string
    }
    Response: ContactsStats
  }

  'GET /v1/onboarding/local-news': {
    Request: {
      city?: string
      state: string
      office: string
    }
    Response:
      | { status: 'pending' }
      | {
          status: 'ready'
          outlets: Array<{
            name: string
            type: 'TV' | 'print' | 'radio'
            description: string
            email?: string | null
            phone?: string | null
            address?: string | null
          }>
        }
  }

  'GET /v1/onboarding/voter-issues': {
    Request: {}
    Response: {
      issues: Array<{
        label: string
        score: number
        priority: 'high' | 'medium' | 'low'
      }>
    }
  }

  'POST /v1/polls/initial-poll': {
    Request: {
      message: string
      swornInDate: string
      imageUrl: string | null | undefined
      scheduledDate: string | null | undefined
    }
    Response: Poll
  }

  'GET /v1/polls/:pollId': {
    Request: {}
    Response: Poll
  }

  'GET /v1/polls': {
    Request: {}
    Response: {
      results: Poll[]
      pagination: { nextCursor: string | undefined }
    }
  }

  'GET /v1/polls/:pollId/top-issues': {
    Request: {}
    Response: GetPollIssuesResponse
  }

  'GET /v1/organizations/admin/list': {
    Request: { slug?: string; email?: string }
    Response: { organizations: AdminOrganization[] }
  }

  'GET /v1/admin/users/search': {
    Request: { email: string }
    Response: { id: number; email: string; name: string | null }[]
  }

  'POST /v1/admin/users/impersonate/:userId': {
    Request: { actorEmail?: string }
    Response: { token: string }
  }

  'POST /v1/voters/voter-file/filter': {
    Request: { name?: string } & Record<string, unknown>
    Response: SegmentResponse
  }
  'PUT /v1/voters/voter-file/filter/:id': {
    Request: { name?: string } & Record<string, unknown>
    Response: SegmentResponse
  }
  'GET /v1/voters/voter-file/filters': {
    Request: {}
    Response: SegmentResponse[]
  }
  'DELETE /v1/voters/voter-file/filter/:id': {
    Request: {}
    Response: {}
  }

  'GET /v1/contacts': {
    Request: {
      page?: number
      resultsPerPage?: number
      segment?: string
      search?: string
    }
    Response: ListContactsResponse
  }
  'GET /v1/contacts/:id': {
    Request: {}
    Response: Person
  }
  'GET /v1/contacts/download': {
    Request: { segment?: string }
    Response: Blob
  }

  'GET /v1/contact-engagement/:id/issues': {
    Request: { take?: number; after?: string }
    Response: GetConstituentIssuesResponse
  }
  'GET /v1/contact-engagement/:id/activities': {
    Request: { take?: number; after?: string }
    Response: GetIndividualActivitiesResponse
  }

  'GET /v1/meetings': {
    Request: {}
    Response: MeetingsListResponseDto
  }

  'GET /v1/meetings/:date/briefing': {
    Request: { date: string }
    Response: MeetingBriefingOutput | MeetingBriefingAwaitingDto
  }

  'POST /v1/speech/synthesize': {
    Request: SynthesizeSpeechRequest
    Response: SynthesizeSpeechResponse
  }

  'POST /v1/speech/transcribe/session': {
    Request: TranscribeSessionRequest
    Response: TranscribeSessionResponse
  }

  // Briefing annotations. Backend ships responses in snake_case. The
  // frontend AnnotationsApi client translates these to the camelCase
  // Annotation shape consumed by components. Briefings are addressed
  // by meeting date (YYYY-MM-DD), matching `GET /v1/meetings/:date/briefing`.
  'GET /v1/meetings/:date/briefing/annotations': {
    Request: { date: string }
    Response: { annotations: ApiAnnotation[] }
  }
  'POST /v1/meetings/:date/briefing/annotations': {
    Request: ApiCreateAnnotationInput & { date: string }
    Response: ApiAnnotation
  }
  'PUT /v1/annotations/:annotationId/note': {
    Request: { body: string }
    Response: ApiAnnotation
  }
  'DELETE /v1/annotations/:annotationId': {
    Request: {}
    Response: void
  }
  'POST /v1/annotations/:annotationId/note/attachments/presign': {
    Request: { annotationId: string } & ApiAttachmentPresignRequest
    Response: ApiAttachmentPresignResponse
  }
  'POST /v1/annotations/:annotationId/note/attachments/:attachmentId/complete': {
    Request: { annotationId: string; attachmentId: string }
    Response: void
  }
  'DELETE /v1/annotations/:annotationId/note/attachments/:attachmentId': {
    Request: { annotationId: string; attachmentId: string }
    Response: void
  }

  'GET /v1/meetings/:date/briefing/feedback': {
    Request: { date: string }
    Response: { feedback: ApiArtifactFeedback[] }
  }
  'PUT /v1/meetings/:date/briefing/items/:itemId/feedback': {
    Request: { date: string; itemId: string; feedback: ApiArtifactFeedbackKind }
    Response: ApiArtifactFeedback
  }
  'DELETE /v1/meetings/:date/briefing/items/:itemId/feedback': {
    Request: { date: string; itemId: string }
    Response: void
  }

  'GET /v1/elections/race-by-position': {
    Request: {
      brPositionId: string
      zip: string
      electionDate: string
    }
    Response: Race
  }

  // Briefing chat routes — cross-repo contract with gp-api PR #1607.
  // Request/response shapes mirror gp-api's createBriefingChatSchema,
  // getConversationResponseSchema, and sendMessageSchema. SSE message
  // streaming is intentionally not modeled here because clientRequest
  // can't consume an SSE body — see chat-api.ts streamMessage for the
  // raw fetch path.
  'POST /v1/briefing-chats': {
    Request: {
      meetingDate: string
      anchor: AnnotationAnchor
    }
    Response: {
      annotationId: string
      conversationId: string
    }
  }
  'GET /v1/briefing-chats/:annotationId': {
    Request: {}
    Response: {
      conversationId: string
      messages: ChatMessage[]
    }
  }
  'DELETE /v1/briefing-chats/:annotationId': {
    Request: {}
    Response: void
  }
}

// Backend (snake_case) annotation types. Mirrors @goodparty_org/contracts
// in gp-api. The AnnotationsApi client maps to/from the camelCase shape
// the rest of the frontend uses.
export type ApiAnnotationKind = 'note' | 'chat' | 'bug_report'
export type ApiAnnotationResourceType = 'briefing'

export interface ApiAnnotationAnchorInput {
  json_path: string | null
  start: number | null
  end: number | null
}

export type ApiOcrStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'skipped'

export interface ApiAnnotationNoteAttachment {
  id: string
  file_name: string
  mime_type: string
  size_bytes: number
  ocr_status: ApiOcrStatus
  ocr_text: string | null
  ocr_error: string | null
  ocr_completed_at: string | null
  created_at: string
}

export interface ApiAnnotationNote {
  id: string
  /** Optional once attachment-only notes ship (Phase 2). */
  body: string | null
  attachments: ApiAnnotationNoteAttachment[]
  created_at: string
  updated_at: string
}

export interface ApiAttachmentPresignRequest {
  file_name: string
  mime_type: string
  size_bytes: number
}

export interface ApiAttachmentPresignResponse {
  attachment_id: string
  upload_url: string
  storage_key: string
}

export interface ApiAnnotationBugReport {
  id: string
  description: string
  submitted_at: string
}

export interface ApiAnnotationChat {
  id: string
  created_at: string
}

export interface ApiAnnotation {
  id: string
  kind: ApiAnnotationKind
  resource_type: ApiAnnotationResourceType
  resource_id: string
  author_user_id: number
  json_path: string | null
  start: number | null
  end: number | null
  created_at: string
  updated_at: string
  note?: ApiAnnotationNote
  bug_report?: ApiAnnotationBugReport
  chat?: ApiAnnotationChat
}

export type ApiCreateAnnotationInput =
  | {
      kind: 'note'
      anchor: ApiAnnotationAnchorInput
      /** body is optional for attachment-only notes (Phase 2). */
      payload: { body?: string }
    }
  | {
      kind: 'bug_report'
      anchor: ApiAnnotationAnchorInput
      payload: { description: string }
    }

export type ApiArtifactResourceType = 'agenda_item'
export type ApiArtifactFeedbackKind = 'positive' | 'negative'

export interface ApiArtifactFeedback {
  id: string
  organization_slug: string
  submitter_user_id: number
  artifact_type: ApiArtifactResourceType
  artifact_id: string
  feedback: ApiArtifactFeedbackKind
  created_at: string
  updated_at: string
}

export type Organization = {
  slug: string
  name: string | null
  positionName: string | null
  position: null | { id: string; brPositionId: string; state: string }
  district: null | { id: string; l2Type: string; l2Name: string }
  electedOfficeId: string | null
  campaignId: number | null
}

export type AdminOrganization = Organization & {
  extra: {
    positionName: string | null
    hasDistrictOverride: boolean
    owner: {
      id: string
      email: string
      firstName: string | null | undefined
      lastName: string | null | undefined
      phone: string | null | undefined
    }
    campaign: {
      id: number
      slug: string
      details: CampaignDetails | null
    } | null
  }
}

export type ElectedOffice = {
  id: string
  swornInDate: string | null
}
