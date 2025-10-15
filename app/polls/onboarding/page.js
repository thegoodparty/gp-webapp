import pageMetaData from 'helpers/metadataHelper'
import OnboardingPage from './components/OnboardingPage'
import serveAccess from 'app/(candidate)/dashboard/shared/serveAccess'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve Onboarding',
  description: 'Welcome to GoodParty.org Serve Onboarding',
  slug: '/polls/onboarding',
})

export const metadata = meta

export default async function Page({}) {
  await serveAccess()

  return <OnboardingPage />
}
