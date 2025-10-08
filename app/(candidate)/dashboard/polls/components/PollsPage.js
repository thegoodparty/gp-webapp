'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import PollsTable from './PollsTable'

export default function WebsitePage({ pathname }) {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full">
        <H1>Polls</H1>
        <Body1 className="text-gray-500 mb-4">
          Manage your constituent engagement
        </Body1>
        <PollsTable />
      </Paper>
    </DashboardLayout>
  )
}
