export const dynamic = 'force-dynamic'

import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'
import OnboardingPage from './components/OnboardingPage'
import { fetchContentByType } from 'helpers/fetchHelper'
import { PledgeContent } from 'helpers/types'

const meta = pageMetaData({
  title: 'Candidate Onboarding | GoodParty.org',
  description: 'Candidate Onboarding.',
  slug: '/onboarding',
})
export const metadata = meta

interface PageParams {
  slug: string
  step: string
}

export default async function Page({ params }: { params: Promise<PageParams> }): Promise<React.JSX.Element> {
  const { slug, step } = await params
  const campaign = await getCampaign({ slug })

  const totalSteps = 4

  let stepInt = step ? parseInt(step, 10) : 1
  if (Number.isNaN(stepInt) || stepInt < 1 || stepInt > totalSteps) {
    redirect(`/onboarding/${slug}/1`)
  }

  let pledge: PledgeContent | undefined
  if (stepInt === 3) {
    pledge = await fetchContentByType<PledgeContent>('pledge')
  }

  if (!campaign) {
    redirect('/run-for-office')
  }

  const childProps = {
    step: stepInt,
    campaign,
    totalSteps,
    pledge,
  }
  return <OnboardingPage {...childProps} />
}
