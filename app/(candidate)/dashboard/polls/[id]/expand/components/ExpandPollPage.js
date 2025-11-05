'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import TitleSection from './TitleSection'
import SelectSection from './SelectSection'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExpandPollLayout from '../shared/ExpandPollLayout'
import ExpandStepFooter from '../shared/ExpandStepFooter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function ExpandPollPage() {
  const [poll] = usePoll()
  const router = useRouter()
  const [selection, setSelection] = useState(null)

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

  return (
    <ExpandPollLayout>
      <TitleSection />
      <SelectSection countCallback={setSelection} />
      <ExpandStepFooter
        currentStep={1}
        onBack={handleBack}
        disabledNext={!selection}
        onNext={handleNext}
        onNextText="Review"
      />
    </ExpandPollLayout>
  )
}
