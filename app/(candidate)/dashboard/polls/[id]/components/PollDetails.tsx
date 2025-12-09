'use client'

import Body2 from '@shared/typography/Body2'
import { usePoll } from '../../shared/hooks/PollProvider'
import H4 from '@shared/typography/H4'
import { LuUsersRound } from 'react-icons/lu'
import { dateUsHelper } from 'helpers/dateHelper'

export default function PollDetails() {
  const [poll] = usePoll()
  const { scheduledDate, estimatedCompletionDate } = poll || {}
  return (
    <div className="w-full max-w-[600px] bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex gap-2 items-center mb-4">
        <LuUsersRound />
        <H4>Poll Details</H4>
      </div>
      <Body2>
        <ul>
          <li>
            <span className="font-medium">Method:</span>{' '}
            <span className="font-light">SMS Text Messages</span>
          </li>
          <li>
            <span className="font-medium">Scheduled Date:</span>{' '}
            <span className="font-light">
              {dateUsHelper(scheduledDate)} at 11:00 AM
            </span>
          </li>
          <li>
            <span className="font-medium">Estimated Completion Date:</span>{' '}
            <span className="font-light">
              {dateUsHelper(estimatedCompletionDate)} at 11:00 AM
            </span>
          </li>
        </ul>
      </Body2>
    </div>
  )
}
