import clsx from 'clsx'
import { POLL_STATUS_LABELS } from '../shared/constants'
import { PollStatus } from '../shared/poll-types'

export const StatusBadge: React.FC<{ status: PollStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-500'
  switch (status) {
    case PollStatus.IN_PROGRESS:
      colorClass = 'bg-blue-500'
      break
    case PollStatus.SCHEDULED:
      colorClass = 'bg-black'
      break
    case PollStatus.COMPLETED:
      colorClass = 'bg-green-500'
      break
  }
  return (
    <div
      className={clsx(
        'inline-block rounded-md px-2 py-1 text-sm  text-white',
        colorClass,
      )}
    >
      {POLL_STATUS_LABELS[status]}
    </div>
  )
}
