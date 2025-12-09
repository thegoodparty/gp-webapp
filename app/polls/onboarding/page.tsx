import { React } from 'react'
import pageMetaData from 'helpers/metadataHelper'
import OnboardingPage from './components/OnboardingPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding',
})

export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await requireAuth()
  await candidateAccess()

  return <OnboardingPage />
}

