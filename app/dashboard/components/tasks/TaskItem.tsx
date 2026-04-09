import {
  DISPLAY_TASK_TYPES,
  TASK_TYPES,
  formatTaskDate,
} from '../../shared/constants/tasks.const'
import CampaignPlanTaskItem from 'app/dashboard/campaign-plan/components/CampaignPlanTaskItem'
import AwarenessTaskItem from './AwarenessTaskItem'

export interface Task {
  id: string
  title: string
  description: string
  cta?: string
  proRequired?: boolean
  flowType: (typeof TASK_TYPES)[keyof typeof TASK_TYPES]
  week: number
  deadline?: number
  date?: string | null
  link?: string
  completed: boolean
  defaultAiTemplateId?: string | number
}

interface TaskItemProps {
  task: Task
  daysUntilElection: number
  electionDate: string | undefined
  isPro: boolean
  isLegacyList?: boolean
  onCheck: (task: Task) => void
  onAction: (task: Task) => void
}

export default function TaskItem({
  task,
  daysUntilElection,
  electionDate,
  isPro,
  isLegacyList = true,
  onCheck,
  onAction,
}: TaskItemProps): React.JSX.Element {
  const {
    title,
    description,
    flowType,
    deadline,
    date,
    link,
    completed,
    proRequired,
  } = task

  const formattedDate = formatTaskDate(date, electionDate, deadline)

  if (flowType === TASK_TYPES.awareness) {
    return (
      <li className="border-t border-black/12">
        <AwarenessTaskItem
          title={title}
          description={description}
          date={formattedDate}
          onClick={() => onAction(task)}
        />
      </li>
    )
  }

  const isExpired = deadline ? daysUntilElection < deadline : false
  const noLongerAvailable = isExpired && !completed
  const locked = noLongerAvailable || Boolean(proRequired && !isPro)
  let lockedReason = ''
  if (noLongerAvailable) {
    lockedReason = 'This task is no longer available'
  } else if (proRequired && !isPro) {
    lockedReason = 'This task is only available to Pro users'
  }

  const displayTaskType = flowType
    ? (DISPLAY_TASK_TYPES[flowType] ?? flowType)
    : ''

  const linkForRow =
    (isLegacyList && completed) ||
    (!isLegacyList && flowType === TASK_TYPES.events)
      ? undefined
      : link

  const suppressRowAction = completed && !isLegacyList && !link

  return (
    <li className="border-t border-black/12">
      <CampaignPlanTaskItem
        title={title}
        description={description}
        date={formattedDate}
        type={displayTaskType}
        checked={completed}
        locked={locked}
        lockedReason={lockedReason}
        onCheckedChange={() => onCheck(task)}
        onClick={suppressRowAction ? undefined : () => onAction(task)}
        link={linkForRow}
        noLongerAvailable={noLongerAvailable}
      />
    </li>
  )
}
