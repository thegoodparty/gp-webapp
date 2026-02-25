'use client'

import { usePoll } from '../../shared/hooks/PollProvider'
import H1 from '@shared/typography/H1'
import DownloadResults from './DownloadResults'

export default function PollHeader(): React.JSX.Element {
  const [poll] = usePoll()
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        {/* // TODO: add back in after we restore the list view */}
        {/* <Link href="/dashboard/polls">
          <IoArrowBack />
        </Link> */}
        <H1>{poll.name}</H1>
      </div>
      {!!poll.responseCount && (
        <div className="hidden md:block">
          <DownloadResults />
        </div>
      )}
    </div>
  )
}
