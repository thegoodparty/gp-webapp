'use client'

import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/navigation'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import { Sheet, SheetContent, SheetTitle } from 'goodparty-styleguide'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { usePoll } from './hooks/PollProvider'

type ButtonType = 'gatherMoreFeedback' | 'viewPartialResults'

interface LowConfidenceModalProps {
  open: boolean
  onClose: () => void
}

/**
 * LowConfidenceModal - Displays when poll results have low statistical confidence.
 *
 * Desktop: Centered modal
 * Mobile: Bottom sheet
 *
 * Users must acknowledge by clicking a button - no outside click dismissal.
 */
export default function LowConfidenceModal({
  open,
  onClose,
}: LowConfidenceModalProps): React.JSX.Element {
  const [poll] = usePoll()
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 1023px)')

  const handleButtonClick = (button: ButtonType) => {
    trackEvent(EVENTS.polls.lowConfidenceModalClicked, { button })

    if (button === 'gatherMoreFeedback') {
      router.push(`/dashboard/polls/${poll.id}/expand`)
    } else {
      onClose()
    }
  }

  const content = (
    <div className="flex flex-col items-center text-center p-4 lg:p-0">
      <div className="text-6xl mb-6">
        <span role="img" aria-label="Warning">
          ⚠️
        </span>
      </div>
      <H1 className="mb-4">Low Confidence Results</H1>
      <Body2 className="mb-8 max-w-md">
        The results of your poll are not statistically significant. We recommend
        gathering more feedback to increase the confidence of your results.
      </Body2>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          size="large"
          color="secondary"
          onClick={() => handleButtonClick('gatherMoreFeedback')}
          className="w-full sm:w-auto"
        >
          Gather More Feedback
        </Button>
        <Button
          size="large"
          color="neutral"
          onClick={() => handleButtonClick('viewPartialResults')}
          className="w-full sm:w-auto"
        >
          View Partial Results
        </Button>
      </div>
    </div>
  )

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={() => {}}>
        <SheetTitle className="sr-only">Low Confidence Results</SheetTitle>
        <SheetContent
          side="bottom"
          className="rounded-t-xl p-6 z-[1301]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Centered modal
  return (
    <Modal
      open={open}
      closeCallback={onClose}
      preventBackdropClose
      preventEscClose
      hideClose
    >
      <div className="p-4 md:p-8">{content}</div>
    </Modal>
  )
}
