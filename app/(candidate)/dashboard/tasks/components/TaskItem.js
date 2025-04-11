import Button from '@shared/buttons/Button'
import Body2 from '@shared/typography/Body2'
import { CheckRounded, LockRounded } from '@mui/icons-material'
import TaskCheck from './TaskCheck'
import H4 from '@shared/typography/H4'

export default function TaskItem({
  task,
  daysUntilElection,
  isPro,
  isCompleted,
  onCheck,
  onAction,
}) {
  const {
    id: taskId,
    title,
    description,
    cta,
    proRequired,
    flowType,
    week,
    deadline,
    link,
  } = task

  const handleAction = () => {
    onAction(task)
  }

  const handleCheck = () => {
    onCheck(task)
  }

  const isExternalLink = link !== undefined
  const isExpired = daysUntilElection < deadline

  return (
    <li className="flex gap-4 p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
      <div className="mt-1">
        <TaskCheck checked={isCompleted} onClick={handleCheck} />
      </div>
      <div className={`flex-grow ${isCompleted ? 'text-indigo-400' : ''}`}>
        <H4 className="mb-1">{title}</H4>
        <Body2>{description}</Body2>
      </div>
      {isExpired ? (
        <Button
          size="medium"
          color="neutral"
          className="flex items-center"
          disabled
        >
          <LockRounded className="mr-1 text-base" />
          No Longer Available
        </Button>
      ) : (
        <Button
          href={isExternalLink ? link : undefined}
          onClick={isExternalLink ? undefined : handleAction}
          size="medium"
          color={isCompleted ? 'success' : 'secondary'}
          disabled={isCompleted}
          className="flex items-center"
        >
          {isCompleted ? (
            <CheckRounded className="mr-1 text-base" />
          ) : (
            proRequired && !isPro && <LockRounded className="mr-1 text-base" />
          )}
          {cta || 'Complete Task'}
        </Button>
      )}
    </li>
  )
}
