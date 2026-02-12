'use client'

import Button from '@shared/buttons/Button'
import { FaChevronLeft } from 'react-icons/fa'
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
      <Button
        href="/dashboard/voter-records"
        size="large"
        className="w-full flex items-center"
        onClick={() => {
          trackEvent(EVENTS.VoterData.FileDetail.ClickBack, {
            type,
            file: fileName,
          })
        }}
      >
        <FaChevronLeft />
        <div className="ml-2">Back to All Voter Files</div>
      </Button>
    </>
  )
}
