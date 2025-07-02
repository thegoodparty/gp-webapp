import { useDroppable } from '@dnd-kit/core'
import H4 from '@shared/typography/H4'
import IssueCard from './IssueCard'
import { LuClipboardX } from 'react-icons/lu'
import Body2 from '@shared/typography/Body2'

const columnTypes = {
  accepted: {
    title: 'Accepted',
    statuses: ['accepted', 'newIssue'],
  },
  inProgress: {
    title: 'In Progress',
    statuses: ['inProgress'],
  },
  completed: {
    title: 'Resolved or Deferred',
    statuses: ['completed', 'wontDo'],
  },
}

export default function BoardColumn({ type, issues = [] }) {
  const { title, statuses } = columnTypes[type]

  const columnIssues = issues.filter((issue) => statuses.includes(issue.status))

  const { isOver, setNodeRef } = useDroppable({
    id: type,
    data: {
      type: 'column',
      columnType: type,
      accepts: ['issue'],
    },
  })

  return (
    <div className="rounded-md border border-slate-200 p-4 w-full min-h-[400px]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <H4>{title}</H4>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-300 text-slate-900 text-sm font-medium">
          {columnIssues.length}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[300px] transition-colors ${
          isOver
            ? 'bg-slate-50 border-2 border-dashed border-slate-300 rounded-md'
            : ''
        }`}
      >
        {columnIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}

        {columnIssues.length === 0 && (
          <div className="flex items-center justify-center mt-16  text-slate-400 ">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-200">
                <LuClipboardX size={28} />
              </div>
              <Body2 className="text-slate-400">No issues</Body2>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
