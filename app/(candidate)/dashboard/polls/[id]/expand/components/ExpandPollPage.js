'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import TitleSection from './TitleSection'
import SelectSection from './SelectSection'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ExpandPollLayout from '../shared/ExpandPollLayout'
import ExpandStepFooter from '../shared/ExpandStepFooter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function ExpandPollPage() {
  const [poll] = usePoll()
  const router = useRouter()
  const [count, setCount] = useState(null)

  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}`)
  }

  const handleNext = () => {
    if (!count) return
    trackEvent(EVENTS.expandPolls.selectedCount, { count })
    router.push(`/dashboard/polls/${poll.id}/expand-review?count=${count}`)
  }

  return (
    <ExpandPollLayout>
      <TitleSection />
      <SelectSection countCallback={setCount} />
      <ExpandStepFooter
        currentStep={1}
        onBack={handleBack}
        disabledNext={!count}
        onNext={handleNext}
        onNextText="Review"
      />
    </ExpandPollLayout>
  )
}
