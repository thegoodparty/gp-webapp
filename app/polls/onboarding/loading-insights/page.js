import pageMetaData from 'helpers/metadataHelper'
import LoadingInsightsPage from './components/LoadingInsightsPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/loading-insights',
})

export const metadata = meta

export default async function Page({}) {
  await requireAuth('/polls/onboarding/loading-insights')
  await candidateAccess()

  return <LoadingInsightsPage />
}
