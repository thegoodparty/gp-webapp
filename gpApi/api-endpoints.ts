import type { Poll } from 'app/dashboard/polls/shared/poll-types'
import type { ContactsStats } from 'app/dashboard/polls/shared/queries'
import type { GetPollIssuesResponse } from 'app/dashboard/polls/shared/serverApiCalls'
import type {
  SegmentResponse,
  Person,
  ListContactsResponse,
  GetConstituentIssuesResponse,
  GetIndividualActivitiesResponse,
} from 'app/dashboard/contacts/[[...attr]]/components/shared/contacts-types'
import { Campaign, CampaignDetails } from 'helpers/types'

export type APIEndpoints = {
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
      ballotReadyPositionId?: string | undefined
      overrideDistrictId?: string | null | undefined
      customOfficeName?: string | null | undefined
    }
    Response: Organization
  }

  'GET /v1/campaigns/mine': {
    Request: {}
    Response: Campaign
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

  'POST /v1/admin/users/impersonate/:userId': {
    Request: {}
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
