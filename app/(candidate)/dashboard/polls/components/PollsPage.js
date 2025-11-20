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
import Button from '@shared/buttons/Button'
import { LuPlus } from 'react-icons/lu'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'

export default function PollsPage({ pathname }) {
  const [campaign] = useCampaign()
  const [polls] = usePolls()
  const { on: pollCreationEnabled } = useFlagOn('serve-poll-creation')

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <PollsPageGuard>
        <Paper className="min-h-full">
          <div className="flex justify-between items-center">
            <div>
              <H1>Polls</H1>
              <Body1 className="text-gray-500 mb-4">
                Manage your constituent engagement
              </Body1>
            </div>
            {pollCreationEnabled && (
              <Button
                href="/dashboard/polls/create"
                variant="contained"
                color="info"
              >
                <span className="flex items-center gap-2">
                  <LuPlus /> Create Poll
                </span>
              </Button>
            )}
          </div>
          {polls?.results?.length > 0 ? <PollsTable /> : <PollWelcomePage />}
        </Paper>
      </PollsPageGuard>
    </DashboardLayout>
  )
}
