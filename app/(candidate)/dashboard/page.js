import pageMetaData from 'helpers/metadataHelper'
import DashboardPage from './components/DashboardPage'
import candidateAccess from './shared/candidateAccess'
import { fetchUserCampaign } from '../onboarding/shared/getCampaign'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

const fetchTasks = async () => {
  const currentDate = new Date().toISOString().split('T')[0]

  const resp = await serverFetch(apiRoutes.campaign.tasks.list, {
    date: currentDate,
  })
  return resp.data
}

const meta = pageMetaData({
  title: 'Campaign Dashboard | GoodParty.org',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()

  const campaign = await fetchUserCampaign()
  const [tasks, tcrComplianceResponse] = await Promise.all([
    fetchTasks(),
    serverFetch(apiRoutes.campaign.tcrCompliance.fetch),
  ])

  const tcrCompliance = tcrComplianceResponse.ok
    ? tcrComplianceResponse.data
    : null

  return (
    <>
      <HubSpotChatWidgetScript />
      <DashboardPage pathname="/dashboard" campaign={campaign} tasks={tasks} tcrCompliance={tcrCompliance} />
    </>
  )
}
