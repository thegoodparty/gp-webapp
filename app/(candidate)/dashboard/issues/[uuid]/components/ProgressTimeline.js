import Paper from '@shared/utils/Paper'
import { STATUS_DISPLAY_MAP } from '../../shared/constants'
import { dateUsHelper } from 'helpers/dateHelper'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import H5 from '@shared/typography/H5'

export default function ProgressTimeline({ issue, statusHistory }) {
  const timelineItems = []

  timelineItems.push({
    status: 'submitted',
    date: issue.createdAt,
    ...STATUS_DISPLAY_MAP.submitted,
  })

  statusHistory.forEach((change) => {
    const statusInfo = STATUS_DISPLAY_MAP[change.toStatus]
    if (statusInfo) {
      timelineItems.push({
        status: change.toStatus,
        date: change.createdAt,
        ...statusInfo,
      })
    }
  })

  return (
    <Paper className="col-span-12 md:col-span-4">
      <H3 className="mb-6">Progress Timeline</H3>

      <div>
        {timelineItems.map((item, index) => (
          <div key={index} className="pb-8 last:pb-0">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />

              <div className="ml-4">
                <H5 className="mb-1">{item.title}</H5>
                <Body2 className="text-gray-500 mb-1">
                  {dateUsHelper(item.date)}
                </Body2>
                <Body2 className="text-gray-600">{item.description}</Body2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}
