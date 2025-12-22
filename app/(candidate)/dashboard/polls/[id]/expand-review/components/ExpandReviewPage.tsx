'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import H1 from '@shared/typography/H1'
import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import ExpandStepFooter from '../../expand/shared/ExpandStepFooter'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PollPreview } from '../../../components/PollPreview'

export default function ExpandReviewPage({
  count,
  scheduledDate,
}: {
  count: number
  scheduledDate: Date
}) {
  const [poll] = usePoll()
  const router = useRouter()

  useEffect(() => {
    trackEvent(EVENTS.expandPolls.reviewViewed, { count })
  }, [])

  const params = `count=${count}&scheduledDate=${encodeURIComponent(
    scheduledDate.toISOString(),
  )}`

  const handleNext = () => {
    router.push(`/dashboard/polls/${poll.id}/expand-payment?${params}`)
  }
  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}/expand?${params}`)
  }

  const { messageContent, imageUrl } = poll

  return (
    <ExpandPollLayout>
      <H1 className="text-center mb-4">Review your SMS poll.</H1>
      <PollPreview
        scheduledDate={scheduledDate}
        targetAudienceSize={count}
        imageUrl={imageUrl}
        message={messageContent}
        isFree={false}
      />
      <ExpandStepFooter
        currentStep={3}
        onBack={handleBack}
        onNext={handleNext}
        onNextText="Go to payment"
      />
    </ExpandPollLayout>
  )
}
