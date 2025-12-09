'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExpandPollLayout from '../shared/ExpandPollLayout'
import ExpandStepFooter from '../shared/ExpandStepFooter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import {
  PollAudienceSelector,
  useTotalConstituentsWithCellPhone,
} from '../../../shared/audience-selection'
import { LuLoaderCircle } from 'react-icons/lu'

export default function ExpandPollPage() {
  const [poll] = usePoll()
  const router = useRouter()
  const query = useTotalConstituentsWithCellPhone()
  const [selection, setSelection] = useState<
    { count: number; isRecommended: boolean } | undefined
  >(undefined)

  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}`)
  }

  const handleNext = () => {
    if (!selection) return
    trackEvent(EVENTS.expandPolls.recommendationsCompleted, {
      count: selection.count,
      recommended: selection.isRecommended,
    })
    router.push(
      `/dashboard/polls/${poll.id}/expand-review?count=${selection.count}`,
    )
  }

  useEffect(() => {
    trackEvent(EVENTS.expandPolls.recommendationsViewed)
  }, [])

  const content = (children: React.ReactNode) => (
    <ExpandPollLayout>
      <H1 className="text-center">
        How many more messages would you like to send?
      </H1>
      {children}
      <ExpandStepFooter
        currentStep={1}
        onBack={handleBack}
        disabledNext={!selection}
        onNext={handleNext}
        onNextText="Review"
      />
    </ExpandPollLayout>
  )

  if (query.status !== 'success') {
    return content(
      <LuLoaderCircle
        className="animate-spin text-blue-500 mx-auto my-4"
        size={60}
      />,
    )
  }
  // Poll response count will always be defined for an expanding poll, so this ??
  // operation is just to satisfy the type checker.
  const responseCount = poll.responseCount ?? 0

  return content(
    <>
      <Body1 className="text-center my-4 text-muted-foreground">
        We won&apos;t send text messages to constituents you&apos;ve already
        messaged.
      </Body1>
      <PollAudienceSelector
        expectedResponseRate={responseCount / poll.audienceSize}
        totalConstituentsWithCellPhone={query.data.totalConstituents}
        alreadySent={poll.audienceSize}
        responsesAlreadyReceived={responseCount}
        onSelect={setSelection}
      />
    </>,
  )
}
