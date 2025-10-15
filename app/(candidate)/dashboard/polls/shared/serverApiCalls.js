import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export const getPolls = async () => {
  const res = await serverFetch(apiRoutes.polls.list, null, {
    next: { revalidate: 60 },
  })
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPoll = async (pollId) => {
  const res = await serverFetch(
    apiRoutes.polls.get,
    { pollId },
    {
      next: { revalidate: 60 },
    },
  )
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPollTopIssues = async (pollId) => {
  const res = await serverFetch(
    apiRoutes.polls.topIssues,
    { pollId },
    {
      next: { revalidate: 60 },
    },
  )
  if (res.ok) {
    return res.data
  }
  return null
}
