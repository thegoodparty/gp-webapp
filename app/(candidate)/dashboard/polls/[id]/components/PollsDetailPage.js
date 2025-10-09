'use client'
import H1 from '@shared/typography/H1'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import PollsPageGuard from '../../components/PollsPageGuard'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'

export default function PollsDetailPage({ pathname }) {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <H1>Polls detail</H1>
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
