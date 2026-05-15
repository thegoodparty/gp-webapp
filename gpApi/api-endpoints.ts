import type { Race } from 'app/onboarding/[slug]/[step]/components/ballotOffices/types'
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

export interface MeetingBriefingSourceDto {
  id: string
  label: string
  kind: 'internal' | 'official' | 'news' | 'community'
  iconInitial: string
  url: string | null
}

export interface MeetingBriefingAgendaItemDto {
  id: string
  title: string
  kind: 'procedural' | 'consent' | 'public_input' | 'action' | 'informational'
  hasBriefing: boolean
  whatToExpect?: string
}

export interface MeetingBriefingActionItemDto {
  id: string
  title: string
  overview: string
  constituentSentiment: {
    summary: string
    detail?: string
    sources: string[]
  } | null
  recentNews: Array<{ title: string; outlet: string; url: string }>
  budgetImpact: {
    summary: string
    sources: string[]
  } | null
  talkingPoints: string[]
  sources: MeetingBriefingSourceDto[]
}

export interface MeetingBriefingResponseDto {
  id: string
  slug: string
  meetingId: string
  title: string
  meetingDate: string
  status: 'briefing_ready' | 'awaiting_agenda' | 'generating' | 'failed'
  readingTimeMinutes: number
  generatedAt: string
  meeting: {
    id: string
    name: string
    body: string
    type: 'city_council' | 'planning_board' | 'town_hall'
    scheduledAt: string
    location: string
  }
  executiveSummary: string
  agenda: MeetingBriefingAgendaItemDto[]
  actionItems: MeetingBriefingActionItemDto[]
}

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

  'GET /v1/elected-office/current': {
    Request: {}
    Response: ElectedOffice
  }

  'POST /v1/elected-office': {
    Request: {}
    Response: ElectedOffice
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
    Response: {
      outlets: Array<{
        name: string
        type: 'TV' | 'print' | 'radio'
        description: string
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
    Response: MeetingBriefingResponseDto
  }

  'GET /v1/elections/race-by-position': {
    Request: {
      brPositionId: string
      zip: string
      electionDate: string
    }
    Response: Race
  }
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
