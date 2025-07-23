export const dynamic = 'force-dynamic'

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'
import OnboardingPage from './components/OnboardingPage'
import { fetchContentByType } from 'helpers/fetchHelper'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
})
export const metadata = meta

export default async function Page({ params }) {
  const { slug, step } = await params
  const campaign = await getCampaign(params)

  const totalSteps = 5

  let stepInt = step ? parseInt(step, 10) : 1
  if (Number.isNaN(stepInt) || stepInt < 1 || stepInt > totalSteps) {
    redirect(`/onboarding/${slug}/1`)
  }

  let pledge
  if (stepInt === 4) {
    pledge = await fetchContentByType('pledge')
  }

  const childProps = {
    step: stepInt,
    campaign,
    totalSteps,
    pledge,
  }
  return <OnboardingPage {...childProps} />
}
