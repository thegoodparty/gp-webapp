'use client'

import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import Crumbs from '../../../../shared/Crumbs'
import Title from './Title'
import ConfidenceAlert from 'app/(candidate)/dashboard/polls/shared/ConfidenceAlert'
import DetailsSection from './DetailsSection'
import { useIssue } from 'app/(candidate)/dashboard/polls/shared/hooks/IssueProvider'
import { usePoll } from 'app/(candidate)/dashboard/polls/shared/hooks/PollProvider'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function PollIssueDetailPage({
  pathname,
}: {
  pathname: string
}) {
  const [campaign] = useCampaign()
  const { title } = useIssue()
  const [poll] = usePoll()

  useEffect(() => {
    trackEvent(EVENTS.polls.issueDetailsViewed)
  }, [])

  const breadcrumbsLinks = [
    { href: `/dashboard/polls`, label: 'Polls' },
    {
      label: `${poll.name}`,
      href: `/dashboard/polls/${poll.id}`,
    },
    {
      label: `${title}`,
    },
  ]

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full">
        <Crumbs breadcrumbsLinks={breadcrumbsLinks} />
        <Title />
        <ConfidenceAlert />
        <DetailsSection />
      </Paper>
    </DashboardLayout>
  )
}
