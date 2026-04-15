'use client'
import { CampaignCountdown } from 'app/dashboard/components/CampaignCountdown'
import { VoterContactsCount } from 'app/dashboard/components/VoterContactsCount'
import { RemainingTasks } from 'app/dashboard/components/RemainingTasks'
import { CampaignProgress } from 'app/dashboard/components/CampaignProgress'
import { Campaign } from 'helpers/types'

export interface DashboardTask {
  id: string
  completed: boolean
}

interface DashboardHeaderProps {
  campaign: Campaign
  tasks?: DashboardTask[]
}

export const DashboardHeader = ({
  campaign,
  tasks = [],
}: DashboardHeaderProps): React.JSX.Element => {
  const { raceTargetMetrics, details: campaignDetails } = campaign || {}
  const { electionDate } = campaignDetails || {}

  const numOfRemainingTasks = tasks?.filter((task) => !task.completed).length ?? 0

  return (
    <section className="mb-6">
      <CampaignCountdown electionDate={electionDate} />
      <VoterContactsCount raceTargetMetrics={raceTargetMetrics} />
      <RemainingTasks numOfRemainingTasks={numOfRemainingTasks} />
      <CampaignProgress raceTargetMetrics={raceTargetMetrics} />
    </section>
  )
}
