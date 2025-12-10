'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import { PollsTable } from './PollsTable'
import PollWelcomePage from 'app/polls/welcome/components/PollWelcomePage'
import Button from '@shared/buttons/Button'
import { LuLoaderCircle, LuPlus } from 'react-icons/lu'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { Poll } from '../shared/poll-types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

interface PollsPageProps {
  pathname: string
  polls: Poll[]
}

export default function PollsPage({ pathname, polls }: PollsPageProps) {
  const router = useRouter()
  const [campaign] = useCampaign()
  const { ready: flagsReady, on: pollCreationFlagOn } = useFlagOn(
    'serve-poll-creation',
  )

  const loadingContent = (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <Paper className="min-h-full flex justify-center items-center">
        <LuLoaderCircle
          className="animate-spin text-blue-500 mx-auto"
          size={60}
        />
      </Paper>
    </DashboardLayout>
  )

  const needsRedirect = !pollCreationFlagOn && polls.length === 1

  useEffect(() => {
    if (flagsReady && needsRedirect) {
      router.push(`/dashboard/polls/${polls[0]?.id}`)
    }
  }, [router, flagsReady, needsRedirect, polls])

  if (!flagsReady || needsRedirect) {
    return <>{loadingContent}</>
  }

  const hasPolls = polls.length > 0

  const pollCreationEnabled = pollCreationFlagOn && hasPolls

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
          {pollCreationEnabled && (
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
