import { adminAccessOnly } from 'helpers/permissionHelper'
import CandidateMetricsPage from './components/CandidateMetricsPage'
import pageMetaData from 'helpers/metadataHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly'
import { Params } from 'next/dist/server/request/params'

interface UpdateHistoryItem {
  createdAt: number
  user: { firstName: string }
}

const fetchAdminUpdateHistory = async (
  slug: string,
): Promise<UpdateHistoryItem[]> => {
  try {
    const payload = {
      slug,
    }
    const resp = await serverFetch<UpdateHistoryItem[]>(
      apiRoutes.campaign.updateHistory.list,
      payload,
    )
    return resp.data
  } catch (e) {
    console.log('error at fetchUpdateHistory', e)
    return []
  }
}

const meta = pageMetaData({
  title: 'Candidate Metrics | GoodParty.org',
  description: 'Admin Candidate Metrics',
  slug: '/admin/candidate-metrics',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page({
  params,
}: {
  params: Params
}): Promise<React.JSX.Element | null> {
  await adminAccessOnly()
  const resolvedParams = await params
  const slug = resolvedParams.slug
  if (!slug || Array.isArray(slug)) {
    return null
  }
  const campaign = await fetchCampaignBySlugAdminOnly(slug)
  if (!campaign) {
    return null
  }
  const updateHistory = await fetchAdminUpdateHistory(slug)

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Candidate Metrics',
    campaign,
    updateHistory,
  }
  return <CandidateMetricsPage {...childProps} />
}
