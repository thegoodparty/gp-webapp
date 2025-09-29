import pageMetaData from 'helpers/metadataHelper'

import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import LoadingInsightsPage from './components/LoadingInsightsPage'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/loading-insights',
})

export const metadata = meta

export default async function Page({}) {
  await candidateAccess()

  return <LoadingInsightsPage />
}
