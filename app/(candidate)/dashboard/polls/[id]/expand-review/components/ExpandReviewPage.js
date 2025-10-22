'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import H1 from '@shared/typography/H1'
import PreviewCard from 'app/polls/onboarding/components/steps/PreviewCard'
import { PRICE_PER_MESSAGE } from '../../../shared/constants'
import { numberFormatter } from 'helpers/numberHelper'
import { dateUsHelper } from 'helpers/dateHelper'
import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import ExpandStepFooter from '../../expand/shared/ExpandStepFooter'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function ExpandReviewPage({ count }) {
  const [poll] = usePoll()
  const router = useRouter()

  useEffect(() => {
    trackEvent(EVENTS.expandPolls.review)
  }, [])

  const handleNext = () => {
    router.push(`/dashboard/polls/${poll.id}/expand-payment?count=${count}`)
  }
  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}/expand`)
  }

  const { messageContent, imageUrl } = poll
  const nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000

  return (
    <ExpandPollLayout>
      <H1 className="text-center">Review your SMS poll.</H1>
      <PreviewCard
        demoMessageText={messageContent}
        imageUrl={imageUrl}
        estimatedCompletionDate={dateUsHelper(nextWeek, 'long')}
        count={count}
        timeline="1 week"
        cost={`$${numberFormatter(PRICE_PER_MESSAGE * count, 2)}`}
      />
      <ExpandStepFooter
        currentStep={2}
        onBack={handleBack}
        onNext={handleNext}
        onNextText="Go to payment"
      />
    </ExpandPollLayout>
  )
}
