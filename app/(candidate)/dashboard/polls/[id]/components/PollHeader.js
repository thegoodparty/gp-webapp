'use client'

import { usePoll } from '../../shared/hooks/PollProvider'
import H1 from '@shared/typography/H1'
export default function PollHeader() {
  const [poll] = usePoll()
  return (
    <div className="flex items-center gap-4 mb-4">
      {/* // TODO: add back in after we restore the list view */}
      {/* <Link href="/dashboard/polls">
        <IoArrowBack />
      </Link> */}
      <H1>{poll?.name}</H1>
    </div>
  )
}
