import clsx from 'clsx'
import { POLL_STATUS } from '../shared/constants'

export default function StatusBadge({ status }) {
  let colorClass = 'bg-gray-500'
  switch (status) {
    case POLL_STATUS.IN_PROGRESS:
      colorClass = 'bg-blue-500'
      break
    case POLL_STATUS.SCHEDULED:
      colorClass = 'bg-black'
      break
    case POLL_STATUS.DONE:
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
      {statusLabels[status]}
    </div>
  )
}
