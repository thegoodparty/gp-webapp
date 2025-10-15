'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import PollsPageGuard from '../../components/PollsPageGuard'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import PollHeader from './PollHeader'
import PollsContent from './PollsContent'

export default function PollsDetailPage({ pathname }) {
  const { campaign } = useCampaign()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <PollHeader />
          <PollsContent />
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
