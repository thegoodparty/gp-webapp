'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import PollHeader from './PollHeader'
import PollsContent from './PollsContent'
import { useEffect, useState } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { usePoll } from '../../shared/hooks/PollProvider'
import { waitForUsersnap } from '@shared/scripts/UserSnapScript'
import { PollStatus } from '../../shared/poll-types'
import LowConfidenceModal from '../../shared/LowConfidenceModal'
import { isPollExpanding } from '../../shared/poll-utils'

const showSurvey = async () => {
  try {
    const api = await waitForUsersnap()
    api.logEvent('serve-product-market-fit')
  } catch (error) {
    console.error('Failed to load Usersnap API', error)
  }
}

export default function PollsDetailPage({ pathname }: { pathname: string }) {
  const [poll] = usePoll()
  const [campaign] = useCampaign()
  const [showLowConfidenceModal, setShowLowConfidenceModal] = useState(false)

  const pollStatus = poll.status
  // Show modal if poll has responses, is low confidence, and is not currently expanding
  const shouldShowLowConfidenceModal =
    !!poll.responseCount && !!poll.lowConfidence && !isPollExpanding(poll)

  useEffect(() => {
    trackEvent(EVENTS.polls.resultsViewed, {
      status: pollStatus,
      lowConfidenceModalShown: shouldShowLowConfidenceModal,
    })
    if (pollStatus === PollStatus.COMPLETED) {
      showSurvey()
    }
    // Show the modal on page load if conditions are met
    if (shouldShowLowConfidenceModal) {
      setShowLowConfidenceModal(true)
    }
  }, [pollStatus, shouldShowLowConfidenceModal])

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full">
        <PollHeader />
        <PollsContent />
      </Paper>
      <LowConfidenceModal
        open={showLowConfidenceModal}
        onClose={() => setShowLowConfidenceModal(false)}
      />
    </DashboardLayout>
  )
}
