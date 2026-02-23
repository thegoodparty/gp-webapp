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

export const getPolls = async () => {
  const res = await serverRequest('GET /v1/polls', {})
  return res.ok ? res.data : null
}

export const getPoll = async (pollId: string) => {
  const res = await serverRequest('GET /v1/polls/:pollId', { pollId })
  return res.ok ? res.data : null
}

export const getPollTopIssues = async (pollId: string) => {
  const res = await serverRequest('GET /v1/polls/:pollId/top-issues', {
    pollId,
  })
  return res.ok ? res.data : null
}
