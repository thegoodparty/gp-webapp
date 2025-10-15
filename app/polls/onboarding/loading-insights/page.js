import pageMetaData from 'helpers/metadataHelper'
import LoadingInsightsPage from './components/LoadingInsightsPage'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/loading-insights',
})

export const metadata = meta

export default async function Page({}) {
  await serveAccess()

  return <LoadingInsightsPage />
}
