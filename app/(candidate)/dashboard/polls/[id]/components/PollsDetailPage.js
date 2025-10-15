'use client'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import Paper from '@shared/utils/Paper'
import PollsPageGuard from '../../components/PollsPageGuard'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import PollHeader from './PollHeader'
import PollsContent from './PollsContent'

export default function PollsDetailPage({ pathname }) {
  const { electedOffice } = useElectedOffice()

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={electedOffice}
      showAlert={false}
    >
      <PollsPageGuard>
        <Paper className="min-h-full">
          <PollHeader />
          <PollsContent />
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
