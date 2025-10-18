'use client'

import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import Crumbs from '../../../../shared/Crumbs'
import Title from './Title'
import ConfidenceAlert from 'app/(candidate)/dashboard/polls/shared/ConfidenceAlert'
import DetailsSection from './DetailsSection'
import PollsPageGuard from 'app/(candidate)/dashboard/polls/components/PollsPageGuard'

export default function PollIssueDetailPage({ pathname }) {
  const [campaign] = useCampaign()
  const [issue] = useIssue()
  const [poll] = usePoll()
  const { title } = issue || {}

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
      <PollsPageGuard>
        <Paper className="min-h-full">
          <Crumbs breadcrumbsLinks={breadcrumbsLinks} />
          <Title />
          <ConfidenceAlert />
          <DetailsSection />
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
