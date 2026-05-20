'use client'
import DashboardLayout from '../shared/DashboardLayout'
import { useEffect } from 'react'
import { calculateContactGoalsFromCampaign } from './voterGoalsHelpers'
import ElectionOver from './ElectionOver'
import EmptyState from './EmptyState'
import { updateUser } from 'helpers/userHelper'
import { useUser } from '@shared/hooks/useUser'
import PrimaryResultModal from './PrimaryResultModal'
import LoadingAnimationModal from '@shared/utils/LoadingAnimationModal'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import TasksList from './tasks/TasksList'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type { Task } from './tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'
import { usePositionName } from '@shared/hooks/usePositionName'
import { useCampaign } from '@shared/hooks/useCampaign'
import { usePostElectionState } from './usePostElectionState'

interface DashboardPageProps {
  pathname: string
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
}

const DashboardPage = ({
  pathname,
  tasks,
  tcrCompliance,
}: DashboardPageProps): React.JSX.Element => {
  const [_, setUser] = useUser()
  const [campaign] = useCampaign()
  const {
    electionInPast,
    primaryLost,
    primaryResultModalOpen,
    primaryElectionDate,
    electionDate,
    closePrimaryResultModal,
  } = usePostElectionState()

  const positionName = usePositionName()

  useEffect(() => {
    // TODO: we're only having to do this, because we're caching the user object in the cookie and
    //  accessing it from there, instead of the source of truth, the DB.
    //  What we should be doing is fetching the user object from the server on each route change,
    //  and then we won't have to do this.
    const updateUserCookie = async () => {
      const updated = await updateUser()
      if (updated) {
        setUser(updated)
      }
    }

    updateUserCookie()
  }, [])

  const contactGoals = campaign
    ? calculateContactGoalsFromCampaign(campaign)
    : false

  trackEvent(EVENTS.Dashboard.Viewed, {
    p2vCompleted: `${campaign?.raceTargetMetrics ? 'true' : 'false'}`,
  })

  return (
    <VoterContactsProvider>
      <CampaignUpdateHistoryProvider>
        <DashboardLayout pathname={pathname} campaign={campaign}>
          {campaign ? (
            <>
              <div>
                {contactGoals ? (
                  <>
                    {electionInPast || primaryLost ? (
                      <ElectionOver />
                    ) : (
                      <TasksList
                        campaign={campaign}
                        tasks={tasks}
                        tcrCompliance={tcrCompliance}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
              {primaryElectionDate && electionDate && (
                <PrimaryResultModal
                  open={primaryResultModalOpen}
                  onClose={closePrimaryResultModal}
                  electionDate={electionDate}
                  officeName={positionName}
                />
              )}
            </>
          ) : (
            <LoadingAnimationModal
              title="Loading your dashboard"
              fullPage={false}
            />
          )}
        </DashboardLayout>
      </CampaignUpdateHistoryProvider>
    </VoterContactsProvider>
  )
}

export default DashboardPage
