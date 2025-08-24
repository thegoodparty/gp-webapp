import { useMemo } from 'react'
import Button from '@shared/buttons/Button'
import Body2 from '@shared/typography/Body2'
import { CheckRounded, LockRounded } from '@mui/icons-material'
import TaskCheck from './TaskCheck'
import H4 from '@shared/typography/H4'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'

export default function TaskItem({
  task,
  daysUntilElection,
  isPro,
  onCheck,
  onAction,
  onUnCheck,
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

  const isExternalLink = link && link.startsWith('http')
  const isExpired = daysUntilElection < deadline
  const noLongerAvailable = isExpired && !completed
  const proLocked = proRequired && !isPro

  const checkTrackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Task Checkmark', {
        id: taskId,
        type: flowType,
        weekNumber: week,
        daysUntilElection: daysUntilElection,
        checked: completed,
      }),
    [taskId, flowType, week, daysUntilElection, completed],
  )

  const actionTrackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Task Button', {
        id: taskId,
        type: flowType,
        weekNumber: week,
        daysUntilElection: daysUntilElection,
        state: noLongerAvailable
          ? 'No Longer Available'
          : completed
          ? 'Completed'
          : proLocked
          ? 'Pro Locked'
          : 'Available',
      }),
    [
      taskId,
      flowType,
      week,
      daysUntilElection,
      noLongerAvailable,
      completed,
      proLocked,
    ],
  )
  const handleAction = () => {
    onAction(task)
  }

  const handleCheck = () => {
    onCheck(task)
  }

  const handleUnCheck = () => {
    onUnCheck(task)
  }

  return (
    <li className="flex flex-col sm:flex-row items-center p-4 mt-4 gap-x-4 bg-white rounded-lg border border-black/[0.12]">
      <div className="flex items-center gap-x-2 gap-y-4 w-full sm:w-auto">
        <div className="mt-1 self-start">
          <TaskCheck
            checked={completed}
            onClick={handleCheck}
            trackingAttrs={checkTrackingAttrs}
            onUnCheck={handleUnCheck}
          />
        </div>
        <div className={`${completed ? 'text-indigo-400' : ''}`}>
          <H4 className="mb-1">{title}</H4>
          <Body2>{description}</Body2>
        </div>
      </div>
      {noLongerAvailable ? (
        <Button
          onClick={handleAction}
          size="medium"
          color="neutral"
          className="sm:flex items-center ml-auto w-full sm:w-auto mt-4 sm:mt-0 whitespace-nowrap"
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
          className="sm:flex items-center ml-auto w-full sm:w-auto mt-4 sm:mt-0 whitespace-nowrap"
          {...actionTrackingAttrs}
        >
          {completed ? (
            <CheckRounded className="mr-1 text-base" />
          ) : (
            proLocked && <LockRounded className="mr-1 text-base" />
          )}
          {cta || 'Complete Task'}
        </Button>
      )}
    </li>
  )
}
