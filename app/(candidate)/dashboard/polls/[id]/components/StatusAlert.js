'use client'
import { MdLock } from 'react-icons/md'
import { usePoll } from '../../shared/hooks/PollProvider'
import { Alert, AlertTitle } from 'goodparty-styleguide'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { dateUsHelper } from 'helpers/dateHelper'
import { POLL_STATUS } from '../../shared/constants'

export default function StatusAlert() {
  const [poll] = usePoll()
  const { status, scheduledDate } = poll
  if (status === POLL_STATUS.COMPLETED) {
    return null
  }
  let variant = 'default'
  switch (status) {
    case POLL_STATUS.IN_PROGRESS:
    case POLL_STATUS.EXPANDING:
      variant = 'destructive'
      break
    case POLL_STATUS.SCHEDULED:
      variant = 'success'
      break
  }
  return (
    <Alert variant={variant} className="mb-4">
      <AlertTitle>
        {[POLL_STATUS.IN_PROGRESS, POLL_STATUS.EXPANDING].includes(status) && (
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
