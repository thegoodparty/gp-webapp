import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export type Poll = {
  id: string
  name: string
  status: 'in_progress' | 'expanding' | 'completed'
  messageContent: string
  imageUrl?: string
  scheduledDate: string
  estimatedCompletionDate: string
  completedDate?: string
  audienceSize: number
  responseCount?: number
  lowConfidence?: boolean
}

export type GetPollsResponse = {
  results: Poll[]
  pagination: { nextCursor: string | undefined }
}

export type PollIssue = {
  pollId: string
  title: string
  summary: string
  details: string
  mentionCount: number
  representativeComments: Array<{
    comment: string
  }>
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
    {
      revalidate: 60,
    },
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
    {
      revalidate: 60,
    },
  )
  if (res.ok) {
    return res.data
  }
  return null
}
export const getPoll = async (pollId: string) => {
  const res = await serverFetch<Poll>(
    apiRoutes.polls.get,
    { pollId },
    { revalidate: 60 },
  )
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
