'use client'

import { usePoll } from '../hooks/PollProvider'
import ConfidenceAlert from './ConfidenceAlert'

export default function CompletedPoll() {
  const [poll] = usePoll()

  return (
    <div>
      <ConfidenceAlert />
    </div>
  )
}
