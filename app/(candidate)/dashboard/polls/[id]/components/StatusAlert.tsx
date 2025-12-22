'use client'
import { MdLock } from 'react-icons/md'
import { usePoll } from '../../shared/hooks/PollProvider'
import { Alert, AlertTitle } from 'goodparty-styleguide'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { dateUsHelper } from 'helpers/dateHelper'
import { PollStatus } from '../../shared/poll-types'

export default function StatusAlert() {
  const [{ status, scheduledDate }] = usePoll()
  if (status === PollStatus.COMPLETED) {
    return null
  }
  let variant: 'default' | 'destructive' | 'success' = 'default'
  switch (status) {
    case PollStatus.IN_PROGRESS:
      variant = 'destructive'
      break
    case PollStatus.SCHEDULED:
      variant = 'success'
      break
  }
  return (
    <Alert variant={variant} className="mb-4">
      <AlertTitle>
        {status == PollStatus.IN_PROGRESS && (
          <div className="flex items-center gap-2 text-red-500">
            <MdLock />
            <span>This poll is currently in progress.</span>
          </div>
        )}
        {status === PollStatus.SCHEDULED && (
          <div className="flex items-center gap-2 text-green-500">
            <IoIosCheckmarkCircleOutline />
            <span>
              This poll is scheduled to send on {dateUsHelper(scheduledDate)} at
              11:00 AM.
            </span>
          </div>
        )}
      </AlertTitle>
    </Alert>
  )
}
