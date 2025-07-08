import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Body1 from '@shared/typography/Body1'
import H4 from '@shared/typography/H4'
import Paper from '@shared/utils/Paper'
import StatusPill from '../../shared/StatusPill'

export default function IssueCard({ issue }) {
  const { uuid, title, description, status } = issue

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: uuid,
      data: {
        type: 'issue',
        issue,
      },
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <Paper className="mb-3 p-4 hover:shadow-md transition-shadow">
        <H4 className="mb-2">{title}</H4>
        <Body1 className="text-slate-600 mb-3 line-clamp-3">
          {description}
        </Body1>
        <StatusPill status={status} />
      </Paper>
    </div>
  )
}
