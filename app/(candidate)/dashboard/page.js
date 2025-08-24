import pageMetaData from 'helpers/metadataHelper'
import DashboardPage from './components/DashboardPage'
import candidateAccess from './shared/candidateAccess'
import { fetchUserCampaign } from '../onboarding/shared/getCampaign'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

const fetchTasks = async () => {
  const resp = await serverFetch(apiRoutes.campaign.tasks.list)
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
  const tasks = await fetchTasks()

  return (
    <>
      <HubSpotChatWidgetScript />
      <DashboardPage pathname="/dashboard" campaign={campaign} tasks={tasks} />
    </>
  )
}
