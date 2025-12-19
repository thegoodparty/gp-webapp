import type { Poll } from 'app/(candidate)/dashboard/polls/shared/poll-types'
import type { ContactsStats } from 'app/(candidate)/dashboard/polls/shared/queries'
import type { GetPollIssuesResponse } from 'app/(candidate)/dashboard/polls/shared/serverApiCalls'

export type APIEndpoints = {
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
}
