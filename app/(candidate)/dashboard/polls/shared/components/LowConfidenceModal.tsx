'use client'

import { useRouter } from 'next/navigation'
import { LuInfo, LuMoveRight } from 'react-icons/lu'
import { Button } from 'goodparty-styleguide'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import Body1 from '@shared/typography/Body1'

export type LowConfidenceModalButtonClick = 'gatherMoreFeedback' | 'viewPartialResults'

interface LowConfidenceModalProps {
  open: boolean
  onClose: () => void
  onButtonClick?: (button: LowConfidenceModalButtonClick) => void
  pollId: string
}

export default function LowConfidenceModal({
  open,
  onClose,
  onButtonClick,
  pollId,
}: LowConfidenceModalProps) {
  const router = useRouter()

  const handleViewPartialResults = () => {
    onButtonClick?.('viewPartialResults')
    onClose()
  }

  const handleGatherMoreFeedback = () => {
    onButtonClick?.('gatherMoreFeedback')
    router.push(`/dashboard/polls/${pollId}/expand`)
  }

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      preventBackdropClose
      preventEscClose
      hideClose
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Blue circle with info icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
          <LuInfo className="w-6 h-6 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          A large enough percentage of your constituency didn&apos;t respond to
          your poll for reliable feedback.
        </h3>

        {/* Description */}
        <Body1 className="text-gray-500">
          We recommend you run the same poll to a larger sample of residents.
        </Body1>

        {/* Buttons */}
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto mt-4">
          <Button
            variant="outline"
            size="large"
            onClick={handleViewPartialResults}
            className="w-full lg:w-auto"
          >
            View partial results
          </Button>
          <Button
            size="large"
            onClick={handleGatherMoreFeedback}
            className="w-full lg:w-auto"
          >
            Gather more feedback
            <LuMoveRight className="ml-2" />
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}
