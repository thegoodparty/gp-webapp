'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { ProPricingCard } from 'app/(candidate)/dashboard/upgrade-to-pro/components/ProPricingCard'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { usePageExit } from '@shared/hooks/usePageExit'
import { Campaign, CandidatePosition } from 'helpers/types'

interface PricingCardConfig {
  title: string
  features: string[]
  price: string
  sub: string
  primaryCard?: boolean
}

interface UpdateToProPageProps {
  pathname?: string
  campaign: Campaign | null
  candidatePositions?: CandidatePosition[]
}

const CARD_DIY: PricingCardConfig = {
  title: 'DIY @ Election Board',
  features: [
    'Confusing, unstructured data',
    'Outdated systems',
    'Bureaucratic processes',
    'Little to no support',
  ],
  price: 'Free',
  sub: 'Cumbersome experience',
}

const CARD_PRO: PricingCardConfig = {
  title: 'GoodParty.org',
  features: [
    'Comprehensive data tailored to your community',
    'Easy voter segmentation for targeted outreach',
    'AI campaign assistant',
    'Candidate community',
    'Free campaign resources',
  ],
  price: '$10/month',
  sub: 'Unlimited Records',
  primaryCard: true,
}

const CARD_COMPETITORS: PricingCardConfig = {
  title: 'Our Competitors',
  features: [
    'Expensive and low quality data sets',
    'Difficult voter segmentation',
    'Lack of actionable insights',
    'Inefficient workflows',
    'Partisan leaning',
  ],
  price: '$200+',
  sub: 'Based on 10,000 records',
}

export default function DetailsPage(
  props: UpdateToProPageProps,
): React.JSX.Element {
  usePageExit(() => {
    trackEvent(EVENTS.ProUpgrade.SplashPage.Exit)
  })

  const handleJoinProOnClick = (): void => {
    trackEvent(EVENTS.ProUpgrade.SplashPage.ClickUpgrade)
  }

  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="mx-auto bg-white rounded-xl p-4 md:px-16 md:py-12">
          <H1 className="text-center mb-2">Why pay more for less?</H1>
          <Body2 className="text-center mb-8">
            GoodParty.org Pro has everything you need to improve your outreach
            for a fraction of the price:
          </Body2>

          <div className="mt-8 mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProPricingCard {...CARD_DIY} />
            <ProPricingCard {...CARD_PRO} />
            <ProPricingCard {...CARD_COMPETITORS} />
          </div>

          <Button
            size="large"
            href={'/dashboard/pro-sign-up'}
            onClick={handleJoinProOnClick}
            className="!block md:w-[300px] mx-auto mt-12"
          >
            Start today for just $10/month.
          </Button>
        </div>
      </CandidatePositionsProvider>
    </DashboardLayout>
  )
}
