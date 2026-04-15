import pageMetaData from 'helpers/metadataHelper'
import DashboardContent from './components/DashboardContent'
import candidateAccess from './shared/candidateAccess'
import { fetchUserCampaign } from '../onboarding/shared/getCampaign'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'
import { redirect } from 'next/navigation'
import type { Task } from './components/tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'

const fetchTasks = async (): Promise<Task[]> => {
  const currentDate = new Date().toISOString().split('T')[0]

  const resp = await serverFetch<Task[]>(apiRoutes.campaign.legacyTasks.list, {
    date: currentDate,
  })
  return resp.data ?? []
}

const meta = pageMetaData({
  title: 'Campaign Dashboard | GoodParty.org',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const electedOfficeResp = await serverFetch(apiRoutes.electedOffice.current)
  if (electedOfficeResp?.ok && electedOfficeResp?.data) {
    return redirect('/dashboard/polls')
  }

  let campaign, tasks, tcrCompliance
  try {
    const [campaignResult, tasksResult, tcrComplianceResponse] =
      await Promise.all([
        fetchUserCampaign(),
        fetchTasks(),
        serverFetch<TcrCompliance>(apiRoutes.campaign.tcrCompliance.fetch),
      ])
    campaign = campaignResult
    tasks = tasksResult ?? []
    tcrCompliance = tcrComplianceResponse.ok
      ? tcrComplianceResponse.data
      : null
  } catch (error) {
    console.error('Dashboard data fetch failed, redirecting to AI insights', error)
    return redirect('/dashboard/ai-insights')
  }

  return (
    <>
      <HubSpotChatWidgetScript />
      <DashboardContent
        pathname="/dashboard"
        campaign={campaign}
        tasks={tasks}
        tcrCompliance={tcrCompliance}
      />
    </>
  )
}
