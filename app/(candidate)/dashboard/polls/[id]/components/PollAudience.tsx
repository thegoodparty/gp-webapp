'use client'

import Body2 from '@shared/typography/Body2'
import { usePoll } from '../../shared/hooks/PollProvider'
import H4 from '@shared/typography/H4'
import { LuUsersRound } from 'react-icons/lu'
import { numberFormatter } from 'helpers/numberHelper'

export default function PollAudience(): React.JSX.Element {
  const [poll] = usePoll()
  const { audienceSize } = poll || {}
  return (
    <div className="w-full max-w-[600px] bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex gap-2 items-center mb-4">
        <LuUsersRound />
        <H4>Audience</H4>
      </div>
      <Body2>{numberFormatter(audienceSize || 0)} randomly selected residents</Body2>
    </div>
  )
}
