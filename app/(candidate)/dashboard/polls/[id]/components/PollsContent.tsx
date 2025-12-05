'use client'
import StatusAlert from './StatusAlert'
import PollMessage from './PollMessage'
import PollAudience from './PollAudience'
import PollDetails from './PollDetails'
import { usePoll } from '../../shared/hooks/PollProvider'
import CompletedPoll from './CompletedPoll'

export default function PollsContent() {
  const [poll] = usePoll()

  // If a poll has responses, then show the issues
  if (!!poll?.responseCount) {
    return <CompletedPoll />
  }

  return (
    <>
      <StatusAlert />
      <div className="flex items-center flex-col gap-4 p-3 md:p-4 bg-gray-100 rounded-lg border border-gray-200">
        <PollMessage />
        <PollAudience />
        <PollDetails />
      </div>
    </>
  )
}
