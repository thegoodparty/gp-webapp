import pageMetaData from 'helpers/metadataHelper'
import NewOnboardingFlow from './components/NewOnboardingFlow'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding/new-flow',
})
export const metadata = meta

export default function Page(): React.JSX.Element {
  return <NewOnboardingFlow />
}
