import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Overline from '@shared/typography/Overline'
import Paper from '@shared/utils/Paper'
import TaskFlow from 'app/(candidate)/dashboard/components/tasks/flows/TaskFlow'
import {
  LEGACY_TASK_TYPES,
  TASK_TYPES,
} from 'app/(candidate)/dashboard/shared/constants/tasks.const'
import { Campaign } from 'helpers/types'

interface ScheduleCardProps {
  type: string
  campaign: Campaign
  isCustom?: boolean
  fileName?: string
}

const ScheduleCard = (props: ScheduleCardProps): React.JSX.Element => {
  const { type } = props
  let typeText = ''
  let taskType = ''
  if (type === LEGACY_TASK_TYPES.sms) {
    typeText = 'text'
    taskType = TASK_TYPES.text
  }
  if (type === LEGACY_TASK_TYPES.telemarketing) {
    typeText = 'robocall'
    taskType = TASK_TYPES.robocall
  }

  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <H3>Schedule a campaign</H3>
        <Overline className="text-gray-600 mb-4">Resources</Overline>
        <Body2>
          Connect with our Politics team to schedule a {typeText} campaign.
          Attach your script and pay just{' '}
          {type === 'sms'
            ? '$.035 per text or less. Replies are free.'
            : '$.04 per outbound call. Automatically leave voicemails for one and a half cents.'}
        </Body2>
      </div>
      <TaskFlow {...props} type={taskType} isCustom={props.isCustom ?? false} customButton={<></>} />
    </Paper>
  )
}

export default ScheduleCard
