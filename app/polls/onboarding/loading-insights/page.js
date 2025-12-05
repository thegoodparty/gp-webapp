import pageMetaData from 'helpers/metadataHelper'
import LoadingInsightsPage from './components/LoadingInsightsPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'
import { hasPolls } from 'app/(candidate)/dashboard/polls/shared/serverApiCalls'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding/loading-insights',
})

export const metadata = meta

export default async function Page({}) {
  await requireAuth()
  await candidateAccess()
  const hasPollsResponse = await hasPolls()

  // If the user has polls, disallow onboarding and redirect to the dashboard polls page
  if (hasPollsResponse?.hasPolls) {
    return redirect('/dashboard/polls')
  }

  return <LoadingInsightsPage />
}
