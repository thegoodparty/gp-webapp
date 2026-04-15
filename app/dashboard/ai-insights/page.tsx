import pageMetaData from 'helpers/metadataHelper'
import { fetchUserCampaign } from 'app/onboarding/shared/getCampaign'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AIInsightsPage } from './components/AIInsightsPage'
import { ExperimentRun } from './types'

const fetchExperimentRuns = async (): Promise<ExperimentRun[]> => {
  const response = await serverFetch<ExperimentRun[]>(
    apiRoutes.agentExperiments.mine,
  )
  if (!response.ok) {
    return []
  }
  return response.data || []
}

const meta = pageMetaData({
  title: 'AI Insights | GoodParty.org',
  description: 'AI-powered insights for your campaign strategy.',
  slug: '/dashboard/ai-insights',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  const user = await getServerUser()
  if (!user) {
    redirect('/sign-up')
  }

  const [campaign, experimentRuns] = await Promise.all([
    fetchUserCampaign(),
    fetchExperimentRuns(),
  ])

  const nextCookies = await cookies()
  const isImpersonating = !!nextCookies.get('impersonateToken')?.value
  if (!campaign?.details?.isAiBetaVip && !isImpersonating) {
    redirect('/dashboard')
  }

  return (
    <AIInsightsPage
      pathname="/dashboard/ai-insights"
      campaign={campaign}
      initialRuns={experimentRuns}
    />
  )
}
