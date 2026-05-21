export const dynamic = 'force-dynamic'

import pageMetaData from 'helpers/metadataHelper'
import OnboardingFlow from '../components/OnboardingFlow'
import { fetchUserCampaign } from '../shared/getCampaign'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const campaign = await fetchUserCampaign()
  return <OnboardingFlow campaign={campaign} />
}
