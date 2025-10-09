'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import Paper from '@shared/utils/Paper'
import PollsPageGuard from '../../components/PollsPageGuard'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import PollHeader from './PollHeader'
import StatusAlert from './StatusAlert'
import PollMessage from './PollMessage'
import PollAudience from './PollAudience'
import PollDetails from './PollDetails'

export default function PollsDetailPage({ pathname }) {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <PollHeader />
          <StatusAlert />
          <div className="flex items-center flex-col gap-4 p-3 md:p-4 bg-gray-100 rounded-lg border border-gray-200">
            <PollMessage />
            <PollAudience />
            <PollDetails />
          </div>
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
