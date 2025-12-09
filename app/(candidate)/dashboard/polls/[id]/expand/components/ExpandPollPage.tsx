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
import { Poll } from '../../../shared/poll-types'
import { PollScheduledDateSelector } from '../../../components/PollScheduledDateSelector'

const AudienceSelectionForm: React.FC<{
  poll: Poll
  onNext: (audience: number) => void
  onBack: () => void
}> = ({ poll, onNext, onBack }) => {
  const query = useTotalConstituentsWithCellPhone()
  const [selection, setSelection] = useState<
    { count: number; isRecommended: boolean } | undefined
  >(undefined)

  const handleNext = () => {
    if (!selection) return
    trackEvent(EVENTS.expandPolls.recommendationsCompleted, {
      count: selection.count,
      recommended: selection.isRecommended,
    })
    onNext(selection.count)
  }

  const content = (children: React.ReactNode) => (
    <ExpandPollLayout>
      <H1 className="text-center">
        How many more messages would you like to send?
      </H1>
      {children}
      <ExpandStepFooter
        currentStep={1}
        onBack={onBack}
        disabledNext={!selection}
        onNext={handleNext}
        onNextText="Pick Send Date"
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
        showRecommended={!!poll.lowConfidence}
      />
    </>,
  )
}

type State = {
  mode: 'audience-selection' | 'date-selection'
  audience: number | undefined
  scheduledDate: Date | undefined
}

export default function ExpandPollPage({
  count,
  scheduledDate,
}: {
  count: number | undefined
  scheduledDate: Date | undefined
}) {
  const [poll] = usePoll()
  const router = useRouter()

  const [state, setState] = useState<State>(() => {
    const initialState: State = {
      mode: 'audience-selection',
      audience: count,
      scheduledDate,
    }
    if (count && scheduledDate) {
      initialState.mode = 'date-selection'
    }
    return initialState
  })

  // We track this event here instead of in AudienceSelectionForm
  // because it should only be tracked once, even if the user hits "Back"
  // to get back to the audience form.
  useEffect(() => {
    trackEvent(EVENTS.expandPolls.recommendationsViewed)
  }, [])

  const handleBack = () => {
    if (state.mode === 'audience-selection') {
      router.push(`/dashboard/polls/${poll.id}`)
    } else {
      setState({ ...state, mode: 'audience-selection' })
    }
  }

  const handleNext = () => {
    if (!state.audience || !state.scheduledDate) {
      return
    }
    router.push(
      `/dashboard/polls/${poll.id}/expand-review?count=${
        state.audience
      }&scheduledDate=${encodeURIComponent(state.scheduledDate.toISOString())}`,
    )
  }

  if (state.mode === 'audience-selection') {
    return (
      <AudienceSelectionForm
        poll={poll}
        onNext={(count) =>
          setState({ ...state, mode: 'date-selection', audience: count })
        }
        onBack={handleBack}
      />
    )
  }

  return (
    <ExpandPollLayout>
      <H1 className="text-center">
        When would you like to send your text messages?
      </H1>
      <PollScheduledDateSelector
        scheduledDate={state.scheduledDate}
        onChange={(date) => setState({ ...state, scheduledDate: date })}
      />

      <ExpandStepFooter
        currentStep={2}
        onBack={handleBack}
        disabledNext={!state.scheduledDate}
        onNext={handleNext}
        onNextText="Review"
      />
    </ExpandPollLayout>
  )
}
