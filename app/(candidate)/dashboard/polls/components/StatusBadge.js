import clsx from 'clsx'

const statusLabels = {
  inProgress: 'In Progress',
  scheduled: 'Scheduled',
  done: 'Done',
}

export default function StatusBadge({ status }) {
  let colorClass = 'bg-gray-500'
  switch (status) {
    case 'inProgress':
      colorClass = 'bg-blue-500'
      break
    case 'scheduled':
      colorClass = 'bg-black'
      break
    case 'done':
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
