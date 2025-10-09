'use client'
import { MdLock } from 'react-icons/md'
import { usePoll } from '../hooks/PollProvider'
import { Alert, AlertTitle } from 'goodparty-styleguide'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { dateUsHelper } from 'helpers/dateHelper'

export default function StatusAlert() {
  const [poll] = usePoll()
  const { status, startDate } = poll
  if (status === 'done') {
    return null
  }
  let variant = 'default'
  switch (status) {
    case 'inProgress':
      variant = 'destructive'
      break
    case 'scheduled':
      variant = 'success'
      break
  }
  return (
    <Alert variant={variant} className="mb-4">
      <AlertTitle>
        {status === 'inProgress' && (
          <div className="flex items-center gap-2 text-red-500">
            <MdLock />
            <span>
              This poll is currently in progress and cannot be edited.
            </span>
          </div>
        )}
        {status === 'scheduled' && (
          <div className="flex items-center gap-2 text-green-500">
            <IoIosCheckmarkCircleOutline />
            <span>
              This poll is scheduled to send on {dateUsHelper(startDate)}
            </span>
          </div>
        )}
      </AlertTitle>
    </Alert>
  )
}
