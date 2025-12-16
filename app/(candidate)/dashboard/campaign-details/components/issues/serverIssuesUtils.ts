import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

interface CandidatePosition {
  id: number
  topIssueId: number
  positionId: number
  description: string
  order: number
}

interface TopIssue {
  id: number
  name: string
  positions?: { id: number; name: string }[]
}

export async function serverLoadCandidatePosition(
  campaignId: number,
): Promise<CandidatePosition[] | false> {
  try {
    const payload = {
      id: campaignId,
    }
    const resp = await serverFetch<CandidatePosition[]>(
      apiRoutes.campaign.campaignPosition.find,
      payload,
    )
    if (!resp.ok) return []
    return resp.data || []
  } catch (e) {
    console.log('error at serverLoadCandidatePosition', e)
    return false
  }
}

export const serverFetchIssues = async (): Promise<TopIssue[]> => {
  const resp = await serverFetch<TopIssue[]>(apiRoutes.topIssue.list, undefined, {
    revalidate: 3600,
  })
  return resp.data || []
}
