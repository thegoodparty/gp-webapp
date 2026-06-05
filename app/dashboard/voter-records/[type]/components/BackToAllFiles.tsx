'use client'

import { Button } from '@styleguide'
import Link from 'next/link'
import { ChevronLeftIcon } from '@styleguide/components/ui/icons'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface BackToAllFilesProps {
  type: string
  fileName: string
}

export default function BackToAllFiles({
  type,
  fileName,
}: BackToAllFilesProps): React.JSX.Element {
  return (
    <>
      <Button asChild size="large" className="w-full flex items-center">
        <Link
          href="/dashboard/voter-records"
          onClick={() => {
            trackEvent(EVENTS.VoterData.FileDetail.ClickBack, {
              type,
              file: fileName,
            })
          }}
        >
          <ChevronLeftIcon />
          <div className="ml-2">Back to All Voter Files</div>
        </Link>
      </Button>
    </>
  )
}
