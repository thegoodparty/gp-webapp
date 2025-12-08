import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { Poll, PollIssue } from './poll-types'

export type GetPollsResponse = {
  results: Poll[]
  pagination: { nextCursor: string | undefined }
}

export type GetPollIssuesResponse = {
  results: PollIssue[]
}

export type HasPollsResponse = {
  hasPolls: boolean
}

export const hasPolls = async () => {
  const res = await serverFetch<HasPollsResponse>(
    apiRoutes.polls.hasPolls,
    undefined,
  )
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPolls = async () => {
  const res = await serverFetch<GetPollsResponse>(
    apiRoutes.polls.list,
    undefined,
  )
  if (res.ok) {
    return res.data
  }
  return null
}
export const getPoll = async (pollId: string) => {
  const res = await serverFetch<Poll>(apiRoutes.polls.get, { pollId })
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPollTopIssues = async (pollId: string) => {
  const res = await serverFetch<GetPollIssuesResponse>(
    apiRoutes.polls.topIssues,
    { pollId },
    { revalidate: 60 },
  )
  if (res.ok) {
    return res.data
  }
  return null
}
