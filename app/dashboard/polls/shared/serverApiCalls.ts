import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { PollIssue } from './poll-types'
import { serverRequest } from 'gpApi/server-request'

export type GetPollIssuesResponse = {
  results: PollIssue[]
}

export type HasPollsResponse = {
  hasPolls: boolean
}

export const hasPolls = async () => {
  const res = await serverFetch<HasPollsResponse>(apiRoutes.polls.hasPolls)
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPolls = async () =>
  serverRequest('GET /v1/polls', {}).then((res) => res.data)

export const getPoll = async (pollId: string) => {
  const result = await serverRequest(
    'GET /v1/polls/:pollId',
    { pollId },
    { ignoreResponseError: true },
  )

  return result.ok ? result.data : undefined
}

export const getPollTopIssues = async (pollId: string) =>
  serverRequest('GET /v1/polls/:pollId/top-issues', { pollId }).then(
    (res) => res.data,
  )
