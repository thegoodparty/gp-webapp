const statusToText = {
  newIssue: 'New Issue',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  wontDo: "Won't Do",
  completed: 'Completed',
}

const statusToColor = {
  newIssue: 'bg-slate-100',
  accepted: 'bg-green-100',
  inProgress: 'bg-yellow-100',
  wontDo: 'bg-red-100',
  completed: 'bg-green-100',
}

export default function StatusPill({ status }) {
  return (
    <div
      className={`rounded-full py-1 px-3 border border-slate-200 inline-block text-xs font-medium ${statusToColor[status]}`}
    >
      {statusToText[status]}
    </div>
  )
}
