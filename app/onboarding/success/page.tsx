import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from 'app/dashboard/shared/candidateAccess'
import { getServerUser } from 'helpers/userServerHelper'
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'
import { CAMPAIGN_STRATEGY_FLAG_KEY } from '@shared/experiments/campaignStrategyFlag'
import SuccessPage from './components/SuccessPage'

const meta = pageMetaData({
  title: 'Your Campaign Plan | GoodParty.org',
  description: 'Your campaign plan is ready.',
  slug: '/onboarding/success',
})

export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const initialUser = await getServerUser()
  // Direct nav, refresh, or stale share links also have to respect the
  // campaign-strategy flag — without this guard, the post-pledge redirect
  // gating in OnboardingFlow is bypassable.
  return (
    <FeatureFlagGuard
      flagKey={CAMPAIGN_STRATEGY_FLAG_KEY}
      redirectTo="/dashboard"
    >
      <SuccessPage initialUser={initialUser} />
    </FeatureFlagGuard>
  )
}
