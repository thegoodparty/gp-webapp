'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import { PollsTable } from './PollsTable'
import PollWelcomePage from 'app/polls/welcome/components/PollWelcomePage'
import Button from '@shared/buttons/Button'
import { LuPlus } from 'react-icons/lu'
import { Poll } from '../shared/poll-types'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

interface PollsPageProps {
  pathname: string
  polls: Poll[]
}

export default function PollsPage({ pathname, polls }: PollsPageProps) {
  const [campaign] = useCampaign()

  const hasPolls = polls.length > 0

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full">
        <div className="flex justify-between items-center">
          <div>
            <H1>Polls</H1>
            <Body1 className="text-gray-500 mb-4">
              Manage your constituent engagement
            </Body1>
          </div>
          {hasPolls && (
            <Button
              href="/dashboard/polls/create"
              variant="contained"
              color="info"
              onClick={() => {
                trackEvent(EVENTS.createPoll.createPollClicked)
              }}
            >
              <span className="flex items-center gap-2">
                <LuPlus /> Create Poll
              </span>
            </Button>
          )}
        </div>
        {hasPolls ? <PollsTable polls={polls} /> : <PollWelcomePage />}
      </Paper>
    </DashboardLayout>
  )
}
