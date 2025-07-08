import Chip from '@shared/utils/Chip'

const statusToText = {
  newIssue: 'New Issue',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  wontDo: "Won't Do",
  completed: 'Completed',
}

const statusToColor = {
  newIssue: 'bg-slate-100',
  accepted: 'bg-slate-100',
  inProgress: 'bg-yellow-100',
  wontDo: 'bg-red-100',
  completed: 'bg-green-100',
}

export default function StatusPill({ status }) {
  return (
    <Chip className={`${statusToColor[status]}`}>{statusToText[status]}</Chip>
  )
}
