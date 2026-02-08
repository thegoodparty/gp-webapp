'use client'
import { CampaignCountdown } from 'app/(candidate)/dashboard/components/CampaignCountdown'
import { VoterContactsCount } from 'app/(candidate)/dashboard/components/VoterContactsCount'
import { RemainingTasks } from 'app/(candidate)/dashboard/components/RemainingTasks'
import { CampaignProgress } from 'app/(candidate)/dashboard/components/CampaignProgress'
import { Campaign, PathToVictoryData } from 'helpers/types'

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
  const { pathToVictory: p2vObject, details: campaignDetails } = campaign || {}
  const pathToVictory: PathToVictoryData = p2vObject?.data || {}
  const { electionDate } = campaignDetails || {}

  const numOfRemainingTasks = tasks.filter((task) => !task.completed).length

  return (
    <section className="mb-6">
      <CampaignCountdown electionDate={electionDate} />
      <VoterContactsCount pathToVictory={pathToVictory} />
      <RemainingTasks numOfRemainingTasks={numOfRemainingTasks} />
      <CampaignProgress pathToVictory={pathToVictory} />
    </section>
  )
}
