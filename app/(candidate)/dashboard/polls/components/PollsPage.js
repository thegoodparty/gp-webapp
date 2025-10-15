'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import PollsTable from './PollsTable'
import PollsPageGuard from './PollsPageGuard'
import { usePolls } from '../shared/hooks/PollsProvider'
import PollWelcomePage from 'app/polls/welcome/components/PollWelcomePage'

export default function PollsPage({ pathname }) {
  const [campaign] = useCampaign()
  const [polls] = usePolls()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <H1>Polls</H1>
          <Body1 className="text-gray-500 mb-4">
            Manage your constituent engagement
          </Body1>
          {polls?.results?.length > 0 ? (
            <PollsTable />
          ) : (
            <PollWelcomePage fullPageMode={false} />
          )}
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
