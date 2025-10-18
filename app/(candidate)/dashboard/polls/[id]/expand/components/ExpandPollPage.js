'use client'

import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import PollsPageGuard from 'app/(candidate)/dashboard/polls/components/PollsPageGuard'
import Crumbs from '../../../shared/Crumbs'
import { usePoll } from '../../../shared/hooks/PollProvider'

export default function PollIssueDetailPage({ pathname }) {
  const [campaign] = useCampaign()
  const [poll] = usePoll()

  const breadcrumbsLinks = [
    { href: `/dashboard/polls`, label: 'Polls' },
    {
      label: `${poll.name}`,
      href: `/dashboard/polls/${poll.id}`,
    },
    {
      label: 'Expand Poll',
    },
  ]

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <Crumbs breadcrumbsLinks={breadcrumbsLinks} />
          expand poll page
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
