import clsx from 'clsx'
export default function StatusBadge({ status }) {
  let colorClass = 'bg-gray-500'
  switch (status) {
    case 'In progress':
      colorClass = 'bg-blue-500'
      break
    case 'Scheduled':
      colorClass = 'bg-black'
      break
    case 'Done':
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
      {status}
    </div>
  )
}
