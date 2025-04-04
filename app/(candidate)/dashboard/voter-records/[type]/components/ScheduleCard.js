import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Overline from '@shared/typography/Overline'
import Paper from '@shared/utils/Paper'
import ScheduleFlow from './ScheduleFlow'

export default function ScheduleCard(props) {
  const { type } = props
  let typeText = ''
  if (type === 'sms') {
    typeText = 'text'
  }
  if (type === 'telemarketing') {
    typeText = 'phone banking'
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
      <ScheduleFlow {...props} />
    </Paper>
  )
}
