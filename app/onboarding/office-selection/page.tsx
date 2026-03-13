export const dynamic = 'force-dynamic'

import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'
import OnboardingPage from '../[slug]/[step]/components/OnboardingPage'
import { fetchUserCampaign } from '../shared/getCampaign'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const existingCampaign = await fetchUserCampaign()
  if (existingCampaign) {
    redirect(`/onboarding/${existingCampaign.slug}/1`)
  }

  return <OnboardingPage step={1} totalSteps={4} />
}
