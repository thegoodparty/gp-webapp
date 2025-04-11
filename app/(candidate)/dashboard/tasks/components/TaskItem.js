import Button from '@shared/buttons/Button'
import Body2 from '@shared/typography/Body2'
import { CheckRounded, LockRounded } from '@mui/icons-material'
import TaskCheck from './TaskCheck'
import H4 from '@shared/typography/H4'

export default function TaskItem({
  task,
  daysUntilElection,
  isPro,
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
    completed,
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
    <li className="flex items-center gap-4 p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
      <div className="mt-1 self-start">
        <TaskCheck checked={completed} onClick={handleCheck} />
      </div>
      <div className={`flex-grow ${completed ? 'text-indigo-400' : ''}`}>
        <H4 className="mb-1">{title}</H4>
        <Body2>{description}</Body2>
      </div>
      {isExpired && !completed ? (
        <Button
          onClick={handleAction}
          size="medium"
          color="neutral"
          className="flex items-center"
        >
          <LockRounded className="mr-1 text-base" />
          No Longer Available
        </Button>
      ) : (
        <Button
          href={isExternalLink ? link : undefined}
          target="_blank"
          onClick={isExternalLink ? undefined : handleAction}
          size="medium"
          color={completed ? 'success' : 'secondary'}
          disabled={completed}
          className="flex items-center"
        >
          {completed ? (
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
