'use client'

import Body2 from '@shared/typography/Body2'
import { usePoll } from '../hooks/PollProvider'
import H4 from '@shared/typography/H4'
import { LuUsersRound } from 'react-icons/lu'
import { dateUsHelper } from 'helpers/dateHelper'
import { numberFormatter } from 'helpers/numberHelper'

export default function PollDetails() {
  const [poll] = usePoll()
  const { scheduledDate, completedDate, cost } = poll
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
            <span className="font-light">{dateUsHelper(scheduledDate)}</span>
          </li>
          <li>
            <span className="font-medium">Completed Date:</span>{' '}
            <span className="font-light">{dateUsHelper(completedDate)}</span>
          </li>
          <li>
            <span className="font-medium">Cost:</span>{' '}
            <span className="font-light">${numberFormatter(cost)}</span>
          </li>
        </ul>
      </Body2>
      <Body2 className="mt-2 border-t border-gray-200 pt-2 text-gray-500">
        You&apos;ll only be charged once the poll is sent.
      </Body2>
    </div>
  )
}
