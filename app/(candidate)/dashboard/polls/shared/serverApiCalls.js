import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export const getPolls = async () => {
  const res = await serverFetch(apiRoutes.polls.list)
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPoll = async (pollId) => {
  const res = await serverFetch(apiRoutes.polls.get, { pollId })
  if (res.ok) {
    return res.data
  }
  return null
}

export const getPollTopIssues = async (pollId) => {
  const res = await serverFetch(apiRoutes.polls.topIssues, { pollId })
  if (res.ok) {
    return res.data
  }
  return null
}
