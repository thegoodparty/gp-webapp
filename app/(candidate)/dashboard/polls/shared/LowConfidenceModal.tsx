'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/navigation'
import MuiModal from '@mui/material/Modal'
import { Button, Sheet, SheetContent, SheetTitle } from 'goodparty-styleguide'
import { LuInfo, LuMoveRight } from 'react-icons/lu'
import { usePoll } from './hooks/PollProvider'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

interface LowConfidenceModalProps {
  open: boolean
  onClose: () => void
}

export default function LowConfidenceModal({
  open,
  onClose,
}: LowConfidenceModalProps) {
  const [poll] = usePoll()
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showContent, setShowContent] = useState(open)

  useEffect(() => {
    if (isDesktop) {
      setShowContent(open)
      return
    }
    // Add slight delay for mobile slide animation
    const timer = setTimeout(() => setShowContent(open), open ? 0 : 200)
    return () => clearTimeout(timer)
  }, [open, isDesktop])

  const handleViewPartialResults = () => {
    trackEvent(EVENTS.polls.lowConfidenceModalClicked, {
      button: 'viewPartialResults',
    })
    onClose()
  }

  const handleGatherMoreFeedback = () => {
    trackEvent(EVENTS.polls.lowConfidenceModalClicked, {
      button: 'gatherMoreFeedback',
    })
    router.push(`/dashboard/polls/${poll.id}/expand`)
  }

  const modalContent = (
    <>
      {/* Blue circle with info icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <LuInfo className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-center text-gray-900 mb-2">
        A large enough percentage of your constituency didn&apos;t respond to
        your poll for reliable feedback.
      </h2>

      {/* Description */}
      <p className="text-base text-center text-gray-500 mb-6">
        We recommend you run the same poll to a larger sample of residents.
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-2 w-full">
        <Button
          variant="outline"
          className="w-full rounded-full"
          size="large"
          onClick={handleViewPartialResults}
        >
          View partial results
        </Button>
        <Button
          variant="default"
          className="w-full rounded-full"
          size="large"
          onClick={handleGatherMoreFeedback}
        >
          Gather more feedback
          <LuMoveRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </>
  )

  // Render desktop modal (centered)
  if (isDesktop) {
    return (
      <MuiModal
        open={open}
        // Prevent closing on backdrop click or ESC
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-lg shadow-lg p-12 max-w-[538px] mx-4 outline-none">
            {modalContent}
          </div>
        </div>
      </MuiModal>
    )
  }

  // Render mobile bottom sheet
  return (
    <Sheet open={open || showContent} onOpenChange={() => {}}>
      <SheetTitle className="sr-only">Low Confidence Warning</SheetTitle>
      <SheetContent
        side="bottom"
        className="rounded-t-[32px] p-6 pt-8"
        // Prevent closing via overlay click
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {modalContent}
      </SheetContent>
    </Sheet>
  )
}
