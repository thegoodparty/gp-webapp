'use client'

import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import LoadingState from './LoadingState'
import HeaderSection from './HeaderSection'
import { useCampaign } from '@shared/hooks/useCampaign'
import ProgressSection from './ProgressSection'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import { calculateContactGoalsFromCampaign } from '../voterGoalsHelpers'
import EmptyState from '../EmptyState'
import { Task } from '../tasks/TaskItem'
import { TcrCompliance } from 'helpers/types'
import TasksList from '../tasks/TasksList'

export default function CampaignManager({
  pathname,
  tasks,
  tcrCompliance,
}: {
  pathname: string
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
}) {
  const [campaign] = useCampaign()
  if (!campaign) {
    return null
  }

  const contactGoals = calculateContactGoalsFromCampaign(campaign)

  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <VoterContactsProvider>
        <CampaignUpdateHistoryProvider>
          <HeaderSection />
          <ProgressSection />
          <LoadingState />
        </CampaignUpdateHistoryProvider>
        {contactGoals ? (
          <TasksList
            campaign={campaign}
            tasks={tasks}
            tcrCompliance={tcrCompliance}
            isLegacyList={false}
          />
        ) : (
          <div className="mt-4">
            <EmptyState />
          </div>
        )}
      </VoterContactsProvider>
    </DashboardLayout>
  )
}
