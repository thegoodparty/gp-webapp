'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import PollHeader from './PollHeader'
import PollsContent from './PollsContent'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { usePoll } from '../../shared/hooks/PollProvider'
import { waitForUsersnap } from '@shared/scripts/UserSnapScript'
import { PollStatus } from '../../shared/poll-types'

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

  const pollStatus = poll.status
  useEffect(() => {
    trackEvent(EVENTS.polls.resultsViewed, { status: pollStatus })
    if (pollStatus === PollStatus.COMPLETED) {
      showSurvey()
    }
  }, [pollStatus])

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full">
        <PollHeader />
        <PollsContent />
      </Paper>
    </DashboardLayout>
  )
}
