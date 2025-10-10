'use client'
import StatusAlert from './StatusAlert'
import PollMessage from './PollMessage'
import PollAudience from './PollAudience'
import PollDetails from './PollDetails'
import { usePoll } from '../hooks/PollProvider'
import CompletedPoll from './CompletedPoll'
import { POLL_STATUS } from '../../shared/constants'

export default function PollsContent() {
  const [poll] = usePoll()
  const { status } = poll || {}
  return status !== POLL_STATUS.COMPLETED ? (
    <>
      <StatusAlert />
      <div className="flex items-center flex-col gap-4 p-3 md:p-4 bg-gray-100 rounded-lg border border-gray-200">
        <PollMessage />
        <PollAudience />
        <PollDetails />
      </div>
    </>
  ) : (
    <CompletedPoll />
  )
}
