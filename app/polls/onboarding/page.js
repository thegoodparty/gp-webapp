import pageMetaData from 'helpers/metadataHelper'

import OnboardingPage from './components/OnboardingPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import requireElectedOffice from '../shared/requireElectedOffice'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding',
})

export const metadata = meta

export default async function Page({}) {
  await candidateAccess()
  await requireElectedOffice()

  return <OnboardingPage />
}
