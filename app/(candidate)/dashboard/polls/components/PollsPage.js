'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import PollsTable from './PollsTable'
import PollsPageGuard from './PollsPageGuard'

export default function PollsPage({ pathname }) {
  const { electedOffice } = useElectedOffice()

  return (
    <DashboardLayout pathname={pathname} campaign={electedOffice} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <H1>Polls</H1>
          <Body1 className="text-gray-500 mb-4">
            Manage your constituent engagement
          </Body1>
          <PollsTable />
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
