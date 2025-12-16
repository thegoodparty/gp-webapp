import Chip from '@shared/utils/Chip'

export type IssueStatus = 'newIssue' | 'accepted' | 'inProgress' | 'wontDo' | 'completed'

const statusToText = {
  newIssue: 'New Issue',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  wontDo: "Won't Do",
  completed: 'Completed',
} as const

const statusToColor = {
  newIssue: 'bg-slate-100',
  accepted: 'bg-slate-100',
  inProgress: 'bg-yellow-100',
  wontDo: 'bg-red-100',
  completed: 'bg-green-100',
} as const

interface StatusPillProps {
  status: IssueStatus
}

export default function StatusPill({ status }: StatusPillProps): React.JSX.Element {
  return (
    <Chip className={`${statusToColor[status]}`}>{statusToText[status]}</Chip>
  )
}
