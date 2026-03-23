import {
  DISPLAY_TASK_TYPES,
  TASK_TYPES,
} from '../../shared/constants/tasks.const'
import { dateUsHelper } from 'helpers/dateHelper'
import CampaignPlanTaskItem from 'app/dashboard/campaign-plan/components/CampaignPlanTaskItem'
import { subDays } from 'date-fns'

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
  onCheck: (task: Task) => void
  onAction: (task: Task) => void
}

export default function TaskItemTemp({
  task,
  daysUntilElection,
  electionDate,
  isPro,
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

  const isExpired = deadline ? daysUntilElection < deadline : false
  const noLongerAvailable = isExpired && !completed
  const locked = noLongerAvailable || Boolean(proRequired && !isPro)

  const displayTaskType =
    flowType in DISPLAY_TASK_TYPES
      ? DISPLAY_TASK_TYPES[flowType as keyof typeof DISPLAY_TASK_TYPES]
      : flowType

  return (
    <li className="border-t border-black/12">
      <CampaignPlanTaskItem
        title={title}
        description={description}
        date={
          date
            ? dateUsHelper(new Date(date))
            : electionDate && deadline
              ? dateUsHelper(subDays(new Date(electionDate), deadline))
              : ''
        }
        type={displayTaskType}
        checked={completed}
        locked={locked}
        onCheckedChange={() => onCheck(task)}
        onClick={() => onAction(task)}
        link={link}
        noLongerAvailable={noLongerAvailable}
      />
    </li>
  )
}
