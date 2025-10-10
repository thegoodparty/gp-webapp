'use client'
import { MdLock } from 'react-icons/md'
import { usePoll } from '../hooks/PollProvider'
import { Alert, AlertTitle } from 'goodparty-styleguide'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { dateUsHelper } from 'helpers/dateHelper'
import { POLL_STATUS } from '../../shared/constants'

export default function StatusAlert() {
  const [poll] = usePoll()
  const { status, scheduledDate } = poll
  if (status === POLL_STATUS.DONE) {
    return null
  }
  let variant = 'default'
  switch (status) {
    case POLL_STATUS.IN_PROGRESS:
      variant = 'destructive'
      break
    case POLL_STATUS.SCHEDULED:
      variant = 'success'
      break
  }
  return (
    <Alert variant={variant} className="mb-4">
      <AlertTitle>
        {status === POLL_STATUS.IN_PROGRESS && (
          <div className="flex items-center gap-2 text-red-500">
            <MdLock />
            <span>
              This poll is currently in progress and cannot be edited.
            </span>
          </div>
        )}
        {status === POLL_STATUS.SCHEDULED && (
          <div className="flex items-center gap-2 text-green-500">
            <IoIosCheckmarkCircleOutline />
            <span>
              This poll is scheduled to send on {dateUsHelper(scheduledDate)}
            </span>
          </div>
        )}
      </AlertTitle>
    </Alert>
  )
}
