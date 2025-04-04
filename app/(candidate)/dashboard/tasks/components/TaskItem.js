import { useState } from 'react'
import Button from '@shared/buttons/Button'
import Body2 from '@shared/typography/Body2'
import {
  CheckRounded,
  LockRounded,
  OpenInNewRounded,
} from '@mui/icons-material'
import TaskCheck from './TaskCheck'
import H4 from '@shared/typography/H4'

// NOTE: copied from CampaignTaskType enum in gp-api
const TASK_TYPES = {
  texting: 'texting',
  robocall: 'robocall',
  doorKnocking: 'door-knocking',
  phoneBanking: 'phone-banking',
  link: 'link',
}

export default function TaskItem({
  task,
  daysUntilElection,
  isPro,
  isCompleted,
}) {
  const [checked, setChecked] = useState(isCompleted)

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
    if (proRequired && !isPro) {
      // TODO: direct to pro upgrade
      return
    }

    switch (flowType) {
      case TASK_TYPES.texting:
        // TODO: implement texting flow
        console.log('texting flow')
        break
      case TASK_TYPES.robocall:
        // TODO: implement robocall flow
        console.log('robocall flow')
        break
      case TASK_TYPES.doorKnocking:
        // TODO: implement door knocking flow
        console.log('door knocking flow')
        break
      case TASK_TYPES.phoneBanking:
        // TODO: implement phone banking flow
        console.log('phone banking flow')
        break
      default:
        console.warn('Unknown task type:', flowType)
    }
  }

  const isExternalLink = flowType === TASK_TYPES.link
  const isExpired = daysUntilElection < deadline

  return (
    <li className="flex gap-4 p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
      <div className="mt-1">
        <TaskCheck checked={checked} onClick={() => setChecked(true)} />
      </div>
      <div className={`flex-grow ${checked ? 'text-indigo-400' : ''}`}>
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
          disabled={checked || isCompleted}
          className="flex items-center"
        >
          {isCompleted ? (
            <CheckRounded className="mr-1 text-base" />
          ) : (
            proRequired && <LockRounded className="mr-1 text-base" />
          )}
          {cta || 'Complete Task'}
          {isExternalLink && <OpenInNewRounded className="ml-1 text-base" />}
        </Button>
      )}
    </li>
  )
}
